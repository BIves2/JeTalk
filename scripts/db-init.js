import "dotenv/config"
import fs from "node:fs"
import path from "node:path"
import dns from "node:dns"
import { fileURLToPath } from "node:url"
import { createClient } from "@libsql/client"

// Sur certains réseaux Windows, l'IPv6 est annoncé mais injoignable.
// Forcer IPv4 évite des erreurs "fetch failed" / ETIMEDOUT.
dns.setDefaultResultOrder("ipv4first")

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sqlPath = path.join(__dirname, "..", "prisma", "init.sql")

const rawUrl = process.env.DATABASE_URL || "file:./database/dev.db"
// Le tableau de bord Turso peut fournir une URL `turso://`.
// @libsql/client attend `libsql://` (ou `https://`).
const url = rawUrl.replace(/^turso:\/\//, "libsql://")
const authToken = process.env.DATABASE_AUTH_TOKEN
const isRemote = /^(libsql|https?|wss?):\/\//.test(url)

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

function remoteHost(remoteUrl) {
    try {
        return new URL(remoteUrl.replace(/^(libsql|wss?):/, "https:")).hostname
    } catch {
        return "(URL invalide)"
    }
}

// Crée le dossier local si besoin (le fichier SQLite n'existe pas encore).
if (url.startsWith("file:")) {
    const filePath = url.slice("file:".length)
    const directory = path.dirname(path.resolve(process.cwd(), filePath))
    fs.mkdirSync(directory, { recursive: true })
}

if (!fs.existsSync(sqlPath)) {
    console.error("Script SQL introuvable :", sqlPath)
    process.exit(1)
}

if (isRemote && !authToken) {
    console.error("DATABASE_AUTH_TOKEN est absent.")
    console.error("Turso exige un jeton d'accès : créez-en un dans le tableau de bord Turso.")
    process.exit(1)
}

// Rend le script rejouable sans erreur si les tables existent déjà.
const sql = fs
    .readFileSync(sqlPath, "utf8")
    .replace(/CREATE TABLE (?!IF NOT EXISTS)/g, "CREATE TABLE IF NOT EXISTS ")
    .replace(/CREATE UNIQUE INDEX (?!IF NOT EXISTS)/g, "CREATE UNIQUE INDEX IF NOT EXISTS ")
    .replace(/CREATE INDEX (?!IF NOT EXISTS)/g, "CREATE INDEX IF NOT EXISTS ")

// Évite un blocage indéfini si le réseau ne répond pas.
const timeoutMs = Number(process.env.DB_TIMEOUT_MS) || 30000
function fetchWithTimeout(input, init = {}) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    return fetch(input, { ...init, signal: controller.signal })
        .finally(() => clearTimeout(timer))
}

let client

try {
    client = createClient({
        url,
        ...(authToken ? { authToken } : {}),
        fetch: fetchWithTimeout
    })

    if (isRemote) {
        console.log(`==> Connexion à Turso : ${remoteHost(url)}`)
        console.log(`    (délai maximum : ${timeoutMs / 1000} s)`)
    } else {
        console.log(`==> Initialisation du schéma sur ${url}...`)
    }

    // Test de connexion séparé : permet de distinguer un problème réseau
    // d'un problème de schéma SQL.
    await client.execute("SELECT 1 AS ok")
    console.log("[Message✅]: Connexion à la base réussie.")

    await client.executeMultiple(sql)
    console.log("[Message✅]: Tables créées (ou déjà présentes).")
    console.log("Étape suivante : pnpm db:seed")
} catch (error) {
    console.error("\n[Error🚨]: Impossible d'initialiser la base.")
    console.error(formatError(error))

    if (/fetch failed|ETIMEDOUT|ENOTFOUND|ECONNREFUSED|UND_ERR|abort/i.test(
        `${error?.message || ""} ${error?.cause?.code || ""} ${error?.cause?.message || ""}`
    )) {
        console.error("\nPiste réseau :")
        console.error("- Vérifiez votre connexion Internet, un VPN ou un pare-feu/antivirus.")
        console.error("- Testez avec : pnpm db:check")
        console.error("- Si Turso est bloqué depuis votre réseau, laissez Render initialiser la base au déploiement.")
    }

    process.exitCode = 1
} finally {
    client?.close()
}
