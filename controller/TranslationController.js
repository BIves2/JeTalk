import { getModel, isLocalModelAvailable } from "../config/modelInitialisation.js"
import axios from "axios"

const SYSTEM_TRANSLATION_PROMPT = `Tu es un traducteur automatique strict, professionnel et précis.
Tes règles de fonctionnement sont absolues et obligatoires :
-> Réponds UNIQUEMENT et EXCLUSIVEMENT avec le texte traduit
-> Ne rajoute AUCUNE introduction, ni formule de politesse, ni commentaire explicatif, ni balise (HTML, Markdown ou XML)
-> Corrige silencieusement les fautes d'orthographe ou de frappe du texte original
-> Ta traduction doit être fidèle, naturelle et refléter parfaitement le sens exact de la phrase de départ
-> Ne mets pas de décorations superflues (pas de guillemets superflus "" ou '', pas d'astérisques *)
`

/**
 * Traduction en ligne via l'API Groq
 */
async function translateWithGroq(message, lang) {
    const apiKey = process.env.GROQ_API
    if (!apiKey) {
        throw new Error("GROQ_API key is not configured in .env")
    }

    const targetLanguage = (lang === "Anglais" || lang === "en") ? "l'anglais" : "le français"
    const prompt = `Traduis fidèlement en ${targetLanguage} le texte suivant :\n${message}`

    const messages = [
        { role: "system", content: SYSTEM_TRANSLATION_PROMPT },
        { role: "user", content: prompt }
    ]

    const groqCandidateModels = ["qwen/qwen3.8-27b", "openai/gpt-oss-20b", "openai/gpt-oss-120b", "llama-3.1-8b-instant"]

    for (const modelId of groqCandidateModels) {
        try {
            console.log(`==> [Groq Translation] Trying model: ${modelId}...`)
            const response = await axios.post(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    model: modelId,
                    messages: messages,
                    temperature: 0.3,
                    max_tokens: 1000
                },
                {
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    },
                    timeout: 12000
                }
            )

            const reply = response.data?.choices?.[0]?.message?.content?.trim() || ""
            if (reply) {
                console.log(`[Message✅]: Groq translation success with ${modelId}`)
                return { translation: reply, provider: "Groq (En ligne)" }
            }
        } catch (apiError) {
            console.warn(`[Warning⚠️ Groq Model ${modelId} failed]:`, apiError.response?.data?.error?.message || apiError.message)
        }
    }

    throw new Error("Aucun modèle Groq n'a pu effectuer la traduction.")
}

/**
 * Traduction hors-ligne via le modèle local Qwen
 */
async function translateWithQwen(message, lang) {
    console.log("==> [Qwen Local] Starting local offline translation...")
    const model = await getModel()
    const { LlamaChatSession } = await import("node-llama-cpp")
    let context
    let sequence = null

    try {
        context = await model.createContext({
            contextSize: 1024,
            threads: 4
        })
        sequence = context.getSequence()

        const targetLanguage = (lang === "Anglais" || lang === "en") ? "l'anglais" : "le français"
        const prompt = `Traduis fidèlement en ${targetLanguage} le texte suivant :\n${message}`

        const session = new LlamaChatSession({
            contextSequence: sequence,
            systemPrompt: SYSTEM_TRANSLATION_PROMPT
        })

        const response = await session.prompt(prompt, {
            temperature: 0.3
        })

        return { translation: response.trim(), provider: "Qwen (Hors-ligne)" }
    } finally {
        if (sequence) {
            sequence.dispose()
        }
    }
}

async function TranslationController(req, res) {
    const { message, lang, isOnline } = req.body

    if (!message || !message.trim()) {
        return res.status(400).json({ error: "Le texte à traduire est obligatoire." })
    }

    console.log(`\n==> [Translation Request] Target: ${lang}, Length: ${message.length}`)
    console.log(`==> Mode requested: ${isOnline !== false ? "Online first" : "Forced offline"}`)

    try {
        let result = null

        // 1. Essayer Groq en premier recours si connecté ou non spécifié, et si la clé est présente
        if (isOnline !== false && process.env.GROQ_API) {
            try {
                result = await translateWithGroq(message, lang)
            } catch (groqError) {
                console.warn("[Warning⚠️ ]: Groq translation failed or network unavailable, falling back to local Qwen:", groqError.message)
                result = await translateWithQwen(message, lang)
            }
        } else {
            console.log("==> Running offline translation directly with local Qwen model")
            result = await translateWithQwen(message, lang)
        }

        console.log(`[Message✅]: Translation done via ${result.provider}`)
        return res.json({
            translation: result.translation,
            provider: result.provider
        })
    } catch (error) {
        console.error("[Error🚨] :", error)
        if (!isLocalModelAvailable()) {
            return res.status(503).json({
                code: "AI_UNAVAILABLE",
                msg: "Le service de traduction est momentanément indisponible. Réessayez plus tard."
            })
        }
        return res.status(500).json({ code: "INTERNAL_ERROR", msg: "Erreur lors de la traduction" })
    }
}

export default TranslationController