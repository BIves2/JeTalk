import "dotenv/config"
import express, { json } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "node:path"
import fs from "node:fs"
import { fileURLToPath } from "node:url"
import UserRoutes from "../routes/UserRoutes.js"
import { isLocalModelAvailable } from "../config/modelInitialisation.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

const PORT = Number(process.env.PORT) || 5000
const isProduction = process.env.NODE_ENV === "production"

// Origines autorisées à appeler l'API depuis un autre domaine.
// En production, Render fournit automatiquement RENDER_EXTERNAL_URL.
const allowedOrigins = new Set(
    [
        ...(process.env.CLIENT_URL || "http://localhost:5173").split(","),
        process.env.RENDER_EXTERNAL_URL
    ]
        .map((origin) => origin?.trim())
        .filter(Boolean)
)

// Nécessaire derrière le proxy HTTPS de Render pour les cookies sécurisés.
app.set("trust proxy", 1)

app.use(cors({
    origin(origin, callback) {
        // Pas d'en-tête Origin : requête serveur-à-serveur ou même origine.
        if (!origin || !isProduction || allowedOrigins.has(origin)) {
            return callback(null, true)
        }
        return callback(new Error("Origine non autorisée par CORS"))
    },
    credentials: true
}))
app.use(cookieParser())
app.use(json({ limit: "2mb" }))

// Requis par la détection vocale (WebAssembly / SharedArrayBuffer).
app.use((_req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
    next()
})

app.get("/api/health", (_req, res) => {
    res.json({
        status: "ok",
        uptime: process.uptime(),
        commit: process.env.RENDER_GIT_COMMIT || process.env.GIT_COMMIT || null,
        branch: process.env.RENDER_GIT_BRANCH || null,
        groqConfigured: Boolean(process.env.GROQ_API),
        localModelAvailable: isLocalModelAvailable()
    })
})

app.use("/", UserRoutes)

// Sert le build React (dist/) et renvoie index.html pour les routes côté client.
// Cela permet à /terms, /privacy, /about, /login, etc. de fonctionner en production.
const distDir = path.join(__dirname, "..", "dist")
if (fs.existsSync(distDir)) {
    app.use(express.static(distDir))

    app.use((req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") return next()
        if (req.path.startsWith("/api/")) {
            return res.status(404).json({ error: "Route API introuvable" })
        }
        return res.sendFile(path.join(distDir, "index.html"))
    })
} else if (isProduction) {
    console.warn("[Warning⚠️] Dossier dist/ introuvable : lancez `pnpm build` avant le serveur.")
}

// Gestion centralisée des erreurs (CORS, JSON invalide, etc.).
app.use((err, _req, res, _next) => {
    if (err?.message === "Origine non autorisée par CORS") {
        return res.status(403).json({ error: "Origine non autorisée" })
    }
    if (err?.type === "entity.parse.failed") {
        return res.status(400).json({ error: "Corps de requête JSON invalide" })
    }
    console.error("[Error🚨]", err)
    return res.status(500).json({ error: "Erreur interne du serveur" })
})

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched on port ${PORT} (${isProduction ? "production" : "development"})`)
    console.log(`http://localhost:${PORT}`)
})

// Arrêt propre lors d'un redéploiement Render.
for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => {
        server.close(() => process.exit(0))
    })
}

export default app
