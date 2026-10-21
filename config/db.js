import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const dbUrl = process.env.DATABASE_URL || "file:./database/dev.db"
const authToken = process.env.DATABASE_AUTH_TOKEN

const adapter = new PrismaLibSql({
    url: dbUrl,
    ...(authToken ? { authToken } : {})
})

const prisma = new PrismaClient({
    adapter
})

export default prisma
