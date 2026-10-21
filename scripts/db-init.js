import "dotenv/config"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@libsql/client"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sqlPath = path.join(__dirname, "..", "prisma", "init.sql")

const url = process.env.DATABASE_URL || "file:./database/dev.db"
const authToken = process.env.DATABASE_AUTH_TOKEN

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

// Rend le script rejouable sans erreur si les tables existent déjà.
const sql = fs
    .readFileSync(sqlPath, "utf8")
    .replace(/CREATE TABLE (?!IF NOT EXISTS)/g, "CREATE TABLE IF NOT EXISTS ")
    .replace(/CREATE UNIQUE INDEX (?!IF NOT EXISTS)/g, "CREATE UNIQUE INDEX IF NOT EXISTS ")
    .replace(/CREATE INDEX (?!IF NOT EXISTS)/g, "CREATE INDEX IF NOT EXISTS ")

const client = createClient({
    url,
    ...(authToken ? { authToken } : {})
})

try {
    console.log(`==> Initialisation du schéma sur ${url.startsWith("libsql:") ? "Turso" : url}...`)
    await client.executeMultiple(sql)
    console.log("[Message✅]: Tables créées (ou déjà présentes).")
    console.log("Étape suivante : pnpm db:seed")
} catch (error) {
    console.error("[Error🚨]: Impossible d'initialiser la base :", error.message)
    process.exitCode = 1
} finally {
    client.close()
}
