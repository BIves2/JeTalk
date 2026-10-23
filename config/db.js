import "dotenv/config"
import dns from "node:dns"
import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

// Évite les timeouts IPv6 sur certains réseaux.
dns.setDefaultResultOrder("ipv4first")

const dbUrl = (process.env.DATABASE_URL || "file:./database/dev.db")
    // Le tableau de bord Turso peut fournir une URL `turso://`.
    .replace(/^turso:\/\//, "libsql://")
const authToken = process.env.DATABASE_AUTH_TOKEN

const adapter = new PrismaLibSql({
    url: dbUrl,
    ...(authToken ? { authToken } : {})
})

const prisma = new PrismaClient({
    adapter
})

export default prisma
