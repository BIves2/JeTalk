import path from "node:path"
import fs from "node:fs"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Modèle GGUF facultatif, utilisé uniquement en mode hors-ligne.
// Il n'est pas versionné (986 Mo) : voir .gitignore.
export const MODEL_PATH = path.join(
    __dirname,
    "..",
    "models",
    "Qwen2.5-1.5B-Instruct-Q4_K_M.gguf"
)

let modelPromise = null

/**
 * Indique si le modèle local est présent sur le disque.
 * En production, l'application fonctionne sans lui grâce à Groq.
 */
export function isLocalModelAvailable() {
    return process.env.ENABLE_LOCAL_MODEL !== "false" && fs.existsSync(MODEL_PATH)
}

/**
 * Charge le modèle local à la première utilisation seulement.
 * Le chargement au démarrage consommait ~1 Go de RAM et empêchait
 * un déploiement sur une offre gratuite.
 */
export async function getModel() {
    if (!isLocalModelAvailable()) {
        throw new Error(
            "Modèle local indisponible. Configurez GROQ_API ou placez le fichier " +
            "Qwen2.5-1.5B-Instruct-Q4_K_M.gguf dans models/."
        )
    }

    if (!modelPromise) {
        modelPromise = (async () => {
            const { getLlama } = await import("node-llama-cpp")
            console.log("==> Chargement paresseux du modèle local (CPU)...")
            const llama = await getLlama({ gpu: false })
            const model = await llama.loadModel({ modelPath: MODEL_PATH })
            console.log("[Message✅]: Modèle local chargé.")
            return model
        })().catch((error) => {
            modelPromise = null
            throw error
        })
    }

    return modelPromise
}
