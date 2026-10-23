import "dotenv/config"
import dnsOrder from "node:dns"
import dns from "node:dns/promises"
import { createClient } from "@libsql/client"

// Sur certains réseaux Windows, l'IPv6 est annoncé mais injoignable.
dnsOrder.setDefaultResultOrder("ipv4first")

const rawUrl = process.env.DATABASE_URL || "file:./database/dev.db"
const url = rawUrl.replace(/^turso:\/\//, "libsql://")
const authToken = process.env.DATABASE_AUTH_TOKEN

function formatError(error) {
    const lines = []
    let current = error
    let depth = 0

    while (current && depth < 5) {
        const prefix = depth === 0 ? "" : `${"  ".repeat(depth)}↳ `
        const code = current.code ? `[${current.code}] ` : ""
        lines.push(`${prefix}${code}${current.message || current}`)

        for (const sub of current.errors || []) {
            const subCode = sub.code ? `[${sub.code}] ` : ""
            const address = sub.address ? ` (${sub.address}:${sub.port})` : ""
            lines.push(`${"  ".repeat(depth + 1)}- ${subCode}${sub.message || sub}${address}`)
        }

        current = current.cause
        depth++
    }

    return lines.join("\n")
}

function timeoutFetch(ms) {
    return (input, init = {}) => {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), ms)
        return fetch(input, { ...init, signal: controller.signal })
            .finally(() => clearTimeout(timer))
    }
}

if (url.startsWith("file:")) {
    console.log("Base locale détectée :", url)
    console.log("Aucun test réseau nécessaire. Utilisez pnpm db:init.")
    process.exit(0)
}

let parsed
try {
    parsed = new URL(url.replace(/^(libsql|wss?):/, "https:"))
} catch (error) {
    console.error("URL de base invalide.")
    console.error(formatError(error))
    process.exit(1)
}

console.log("=== Diagnostic Turso ===")
console.log("Hôte        :", parsed.hostname)
console.log("Jeton       :", authToken ? "présent" : "ABSENT")

let failed = false

if (!authToken) {
    failed = true
    console.error("DATABASE_AUTH_TOKEN est absent. Turso exige un token.")
}

try {
    const addresses = await dns.lookup(parsed.hostname, { all: true })
    console.log("DNS         :", addresses.map((a) => `${a.address} (IPv${a.family})`).join(", "))
} catch (error) {
    failed = true
    console.error("DNS         : ÉCHEC")
    console.error(formatError(error))
}

try {
    const response = await timeoutFetch(15000)(`https://${parsed.hostname}/`)
    console.log("HTTPS       : connexion réussie (statut", response.status + ")")
} catch (error) {
    failed = true
    console.error("HTTPS       : ÉCHEC")
    console.error(formatError(error))
    console.error("              (VPN, pare-feu, antivirus ou réseau susceptible de bloquer Turso)")
}

try {
    const client = createClient({
        url,
        ...(authToken ? { authToken } : {}),
        fetch: timeoutFetch(20000)
    })
    try {
        const result = await client.execute("SELECT 1 AS ok")
        console.log("Requête SQL : OK", JSON.stringify(result.rows[0]))
    } finally {
        client.close()
    }
} catch (error) {
    failed = true
    console.error("Requête SQL : ÉCHEC")
    console.error(formatError(error))
}

if (failed) {
    console.error("\nDiagnostic incomplet ou en échec. Si seule votre machine est concernée,")
    console.error("laissez Render exécuter `pnpm db:init` et `pnpm db:seed` au déploiement.")
    process.exitCode = 1
}
