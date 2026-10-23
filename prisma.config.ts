import { defineConfig } from 'prisma/config'
import 'dotenv/config'

// Le tableau de bord Turso peut fournir une URL `turso://`.
const databaseUrl = (process.env.DATABASE_URL || "file:./database/dev.db")
    .replace(/^turso:\/\//, "libsql://")

export default defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        // Valeur locale par défaut pour que `prisma generate` fonctionne
        // même sans fichier .env (utile pendant un build CI/CD).
        url: databaseUrl
    }
})
