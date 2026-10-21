import { defineConfig } from 'prisma/config'
import 'dotenv/config'

export default defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        // Valeur locale par défaut pour que `prisma generate` fonctionne
        // même sans fichier .env (utile pendant un build CI/CD).
        url: process.env.DATABASE_URL || "file:./database/dev.db"
    }
})
