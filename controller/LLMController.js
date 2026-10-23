import { getModel, isLocalModelAvailable } from "../config/modelInitialisation.js"
import { EdgeTTS } from "node-edge-tts"
import fs from "node:fs"
import path from "node:path"
import os from "node:os"
import axios from "axios"

/**
 * Vitesse TTS par niveau (EdgeTTS rate parameter)
 * Amateur    → lent   : -20% (pour bien articuler)
 * Intermediaire → normal : +0%
 * Avance     → rapide : +15%
 * Expert     → natif  : +25%
 */
const LEVEL_TO_RATE = {
    Amateur: "-20%",
    Intermediaire: "+0%",
    Avance: "+15%",
    Expert: "+25%"
}

// Modèles essayés dans l'ordre. Le premier disponible sur le compte Groq répond.
// Les modèles gpt-oss sont des modèles de raisonnement : il leur faut plus de
// jetons et un effort de raisonnement faible pour laisser de la place au texte.
const GROQ_MODELS = [
    { id: "qwen/qwen3.8-27b", maxTokens: 400 },
    { id: "openai/gpt-oss-120b", maxTokens: 800, reasoningEffort: "low" },
    { id: "openai/gpt-oss-20b", maxTokens: 800, reasoningEffort: "low" }
]

function buildMessages(systemPrompt, message, history = []) {
    return [
        { role: "system", content: systemPrompt },
        ...history.map(h => ({
            role: h.role === "assistant" ? "assistant" : "user",
            content: h.content
        })),
        { role: "user", content: message }
    ]
}

/**
 * Construit un system prompt dynamique selon le contexte de session
 */
/**
 * Construit un system prompt dynamique selon le contexte de session (Français ou Anglais)
 */
function buildSystemPrompt(sessionContext = {}) {
    const { subject, duration, niveau, langue, userName, userDescription } = sessionContext
    const isEnglish = (langue === "Anglais" || langue === "en" || langue === "English")

    let prompt
    if (isEnglish) {
        prompt = `You are a friendly and helpful AI voice assistant for learning English.\n`
        if (userName) prompt += `You are conversing with ${userName}.\n`
        if (userDescription) {
            prompt += `User description: "${userDescription}". Use this to tailor your conversation naturally.\n`
        }
        if (subject) {
            prompt += `\n⚠️ MANDATORY TOPIC: "${subject}".\n`
            prompt += `You MUST stay focused on this topic throughout the entire conversation.\n`
            prompt += `If the user digresses, gently bring them back to "${subject}".\n`
        }
        if (duration) {
            prompt += `The session duration is ${duration} minutes. Pace the discussion accordingly.\n`
        }
        prompt += `\nRules:
-> Speak ONLY in clear, natural English.
-> Keep your answers short (1 to 3 sentences maximum, 20 words max per sentence).
-> Be polite, encouraging, and engaging.
-> Do not use special characters like * or #.
-> Frequently ask the user if they understood or need help with new words.
-> Speech recognition may make minor transcription errors, so focus on the intended meaning.
`
    } else {
        prompt = `Tu es un assistant vocal d'apprentissage du français.\n`
        if (userName) {
            prompt += `Tu parles avec ${userName}.\n`
        }
        if (userDescription) {
            prompt += `Voici une description de l'utilisateur pour adapter ton ton et ta façon de parler : "${userDescription}"\n`
            prompt += `Inspire-toi de cette description pour personnaliser tes réponses de manière naturelle.\n`
        }
        if (subject) {
            prompt += `\n⚠️ SUJET OBLIGATOIRE DE CETTE CONVERSATION : "${subject}".\n`
            prompt += `Tu DOIS rester centré sur ce sujet pendant TOUTE la conversation.\n`
            prompt += `Si l'utilisateur s'en écarte, ramène-le gentiment mais clairement vers ce sujet.\n`
            prompt += `Ne parle pas d'autre chose que de "${subject}" sauf pour demander des clarifications liées à ce sujet.\n`
        }
        if (duration) {
            prompt += `La session dure ${duration} minutes. Gère le rythme de la conversation en conséquence.\n`
        }
        prompt += `\nTu dois respecter les consignes suivantes :
-> Tu ne dois pas générer des phrases trop longues, le plus simple c'est le plus efficace
-> Tu ne dois pas générer plus de trois phrases, et tu dois avoir une restriction de 20 mots par phrase maximum
-> Tu dois être poli, bienveillant et amusant
-> Ne mets pas de signes particuliers dans ta production (pas de *, # sauf si indispensable dans le contexte) mais mets quand même des ponctuations
-> Tu dois constamment demander à l'utilisateur s'il a bien compris en lui proposant d'expliquer des mots difficiles par exemple
-> Ce que l'utilisateur va t'envoyer peut contenir des fautes (à cause du micro), donc essaie de comprendre le sens et non exactement les écrits
`
    }

    return prompt
}

/**
 * Synthèse TTS d'un texte vers un buffer MP3 via EdgeTTS.
 * Edge-TTS peut échouer ponctuellement (403, connexion WebSocket coupée).
 * On retente donc jusqu'à trois fois avant de laisser le navigateur lire le texte.
 */
async function synthesizeSpeech(text, voice = 'fr-FR-EloiseNeural', rate = '+0%', lang = 'fr-FR') {
    const maxAttempts = 3

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const ttsEdge = new EdgeTTS({
            voice,
            lang,
            outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
            rate
        })
        const tempFile = path.join(
            os.tmpdir(),
            `tts_${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`
        )

        let timer
        try {
            const synthPromise = ttsEdge.ttsPromise(text, tempFile)
            // Évite un rejet non géré si la synthèse aboutit après le délai.
            synthPromise.catch(() => {})
            const timeoutPromise = new Promise((_, reject) => {
                timer = setTimeout(() => reject(new Error("Edge-TTS timeout")), 12000)
            })

            await Promise.race([synthPromise, timeoutPromise])

            if (fs.existsSync(tempFile)) {
                const audio = fs.readFileSync(tempFile)
                if (audio.length > 0) {
                    return audio
                }
            }
            console.warn(`[Warning⚠️ Edge-TTS] Tentative ${attempt}/${maxAttempts} : fichier audio vide`)
        } catch (err) {
            console.warn(
                `[Warning⚠️ Edge-TTS] Tentative ${attempt}/${maxAttempts} échouée :`,
                err?.message || err?.error || String(err)
            )
        } finally {
            clearTimeout(timer)
            if (fs.existsSync(tempFile)) {
                try { fs.unlinkSync(tempFile) } catch (cleanupError) {
                    console.warn("[Warning⚠️ Edge-TTS] Nettoyage impossible :", cleanupError.message)
                }
            }
        }

        if (attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 500 * attempt))
        }
    }

    console.error("[Error🚨 Edge-TTS] Les trois tentatives ont échoué.")
    return null
}

/**
 * Génération de texte via Groq sans streaming.
 * La réponse est ensuite synthétisée en audio ou renvoyée au client.
 */
async function generateWithGroq(systemPrompt, message, history = []) {
    const apiKey = process.env.GROQ_API
    if (!apiKey) throw new Error("GROQ_API key is not configured in .env")

    const messages = buildMessages(systemPrompt, message, history)
    const failures = []

    console.log("==> [Groq] Calling Groq API (text mode)...")
    for (const model of GROQ_MODELS) {
        const started = Date.now()
        try {
            console.log(`==> [Groq] Trying model: ${model.id}...`)
            const payload = {
                model: model.id,
                messages,
                temperature: 0.7,
                max_tokens: model.maxTokens
            }
            if (model.reasoningEffort) payload.reasoning_effort = model.reasoningEffort

            const response = await axios.post(
                "https://api.groq.com/openai/v1/chat/completions",
                payload,
                {
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    },
                    timeout: 15000
                }
            )

            const reply = response.data?.choices?.[0]?.message?.content?.trim()
            if (reply) {
                console.log(`[Message✅]: Groq text response received with ${model.id} (${Date.now() - started} ms)`)
                return reply
            }
            failures.push(`${model.id}: réponse vide`)
        } catch (apiError) {
            const detail = apiError.response?.data?.error?.message || apiError.message
            failures.push(`${model.id}: ${detail}`)
            console.warn(`[Warning⚠️ Groq Model ${model.id} failed]:`, detail)
        }
    }

    throw new Error(`Aucun modèle Groq n'a pu répondre. ${failures.join(" | ")}`)
}

/**
 * Génération de texte via le modèle local Qwen (hors ligne) — mode phrase par phrase
 */
async function generateWithQwenStreaming(systemPrompt, message, history = [], onSentence) {
    console.log("==> [Qwen Local] Starting local inference with streaming...")
    // Import et chargement uniquement si le mode hors-ligne est réellement utilisé.
    const model = await getModel()
    const { LlamaChatSession } = await import("node-llama-cpp")
    let context
    let sequence = null

    try {
        context = await model.createContext({ contextSize: 1024, threads: 4 })
        sequence = context.getSequence()

        const session = new LlamaChatSession({
            contextSequence: sequence,
            chatHistory: history || [],
            systemPrompt
        })

        let buffer = ""
        let fullText = ""

        await session.prompt(message, {
            onToken: async (tokens) => {
                const token = model.detokenize(tokens)
                buffer += token
                fullText += token

                // Détecter une phrase complète
                const sentenceMatch = buffer.match(/^(.*[.!?])\s*([\s\S]*)$/)
                if (sentenceMatch) {
                    const sentence = sentenceMatch[1].trim()
                    buffer = sentenceMatch[2]
                    if (sentence.length > 2) {
                        console.log(`==> [Qwen Stream] Sentence ready: "${sentence}"`)
                        await onSentence(sentence)
                    }
                }
            }
        })

        // Flush du reste
        const remaining = buffer.trim()
        if (remaining.length > 2) {
            await onSentence(remaining)
        }

        return fullText.trim()
    } finally {
        if (sequence) sequence.dispose()
    }
}

async function modelTest(req, res) {
    console.log(" > Session started !")
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Méthode non autorisée. Utilisez POST." })
    }

    const { message, history, isOnline, sessionContext = {} } = req.body
    if (!message) {
        return res.status(400).json({ error: "Le champ 'message' est obligatoire." })
    }

    // Enrichissement du contexte avec les données utilisateur (depuis le token JWT)
    const enrichedContext = {
        ...sessionContext,
        userName: sessionContext.userName || req.user?.nom || null,
        userDescription: sessionContext.userDescription || null
    }

    const ttsRate = LEVEL_TO_RATE[enrichedContext.niveau] || "+0%"
    const isEnglish = (enrichedContext.langue === "Anglais" || enrichedContext.langue === "en" || enrichedContext.langue === "English")
    const ttsVoice = isEnglish ? 'en-US-AvaNeural' : 'fr-FR-EloiseNeural'
    const ttsLang = isEnglish ? 'en-US' : 'fr-FR'
    const systemPrompt = buildSystemPrompt(enrichedContext)

    console.log(`==> Mode: ${isOnline ? "Online (Groq)" : "Offline (Qwen)"}, Subject: "${enrichedContext.subject}", Langue: ${enrichedContext.langue || "Français"}, Level: ${enrichedContext.niveau}, Voice: ${ttsVoice}, Rate: ${ttsRate}`)
    console.log("==> System prompt built for user:", enrichedContext.userName)

    try {
        // 1. Générer la réponse complète. La synthèse d'un seul bloc donne
        // une prosodie plus naturelle qu'un assemblage de phrases séparées.
        const reply = await generateReply(systemPrompt, message, history, isOnline)
        if (!reply || !reply.trim()) {
            throw new Error("Le modèle a renvoyé une réponse vide.")
        }
        const cleanReply = reply.trim()
        console.log(`[Message✅]: Assistant reply generated (${cleanReply.length} chars)`)

        // 2. Synthétiser la réponse avec Edge-TTS (voix naturelle).
        const audioBuffer = await synthesizeSpeech(cleanReply, ttsVoice, ttsRate, ttsLang)

        if (!audioBuffer || audioBuffer.length === 0) {
            // Secours : le client lira le texte avec la voix du navigateur.
            console.warn("[Warning⚠️]: Edge-TTS indisponible, renvoi du texte au client.")
            return res.json({ reply: cleanReply, tts: false, code: "TTS_FALLBACK" })
        }

        console.log(`[Message✅]: Edge-TTS audio generated (${audioBuffer.length} bytes)`)
        res.setHeader("Content-Type", "audio/mpeg")
        res.setHeader("Content-Length", audioBuffer.length)
        res.setHeader("X-JeTalk-TTS", "edge")
        return res.send(audioBuffer)
    } catch (error) {
        console.error("[Error🚨]: on model Controller", error)
        const publicError = getPublicError(error)
        return res.status(publicError.status).json(publicError.body)
    }
}

async function generateReply(systemPrompt, message, history = [], isOnline) {
    if (isOnline !== false) {
        if (!process.env.GROQ_API) {
            if (isLocalModelAvailable()) {
                console.log("==> GROQ_API absente, utilisation du modèle local")
                return generateWithQwenStreaming(systemPrompt, message, history, async () => {})
            }
            const error = new Error("La clé GROQ_API n'est pas configurée sur le serveur.")
            error.code = "GROQ_NOT_CONFIGURED"
            throw error
        }

        try {
            return await generateWithGroq(systemPrompt, message, history)
        } catch (groqError) {
            console.warn("[Warning⚠️]: Groq text failed:", groqError.message)
            if (isLocalModelAvailable()) {
                console.log("==> Groq indisponible, utilisation du modèle local")
                return generateWithQwenStreaming(systemPrompt, message, history, async () => {})
            }
            const error = new Error("Groq est indisponible et le modèle local n'est pas installé.")
            error.code = "GROQ_UNAVAILABLE"
            error.detail = groqError.message
            throw error
        }
    }

    console.log("==> Running offline with local Qwen model")
    if (!isLocalModelAvailable()) {
        const error = new Error("Le modèle local n'est pas installé sur ce serveur.")
        error.code = "LOCAL_MODEL_UNAVAILABLE"
        throw error
    }
    return generateWithQwenStreaming(systemPrompt, message, history, async () => {})
}

function getPublicError(error) {
    const detail = String(error?.detail || error?.message || "").slice(0, 500)
    switch (error?.code) {
        case "GROQ_NOT_CONFIGURED":
            return {
                status: 503,
                body: {
                    code: error.code,
                    error: "Le service de conversation n'est pas encore configuré. Contactez l'administrateur.",
                    detail
                }
            }
        case "GROQ_UNAVAILABLE":
            return {
                status: 503,
                body: {
                    code: error.code,
                    error: "Le service de conversation est momentanément indisponible. Réessayez dans quelques instants.",
                    detail
                }
            }
        case "LOCAL_MODEL_UNAVAILABLE":
            return {
                status: 503,
                body: {
                    code: error.code,
                    error: "Le service de conversation est momentanément indisponible. Réessayez plus tard.",
                    detail
                }
            }
        default:
            return {
                status: 500,
                body: {
                    code: "AI_ERROR",
                    error: "Une erreur est survenue lors de la génération.",
                    detail
                }
            }
    }
}

/**
 * Réponse texte de l'assistant, sans synthèse vocale.
 * Utile pour les clients qui préfèrent lire la réponse ou pour un diagnostic.
 */
export async function modelText(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Méthode non autorisée. Utilisez POST." })
    }

    const { message, history = [], isOnline, sessionContext = {} } = req.body
    if (!message || !String(message).trim()) {
        return res.status(400).json({ error: "Le champ 'message' est obligatoire." })
    }

    const enrichedContext = {
        ...sessionContext,
        userName: sessionContext.userName || req.user?.nom || null,
        userDescription: sessionContext.userDescription || null
    }
    const systemPrompt = buildSystemPrompt(enrichedContext)

    console.log(`==> [Text] Mode: ${isOnline === false ? "Offline (Qwen)" : "Online (Groq)"}, Langue: ${enrichedContext.langue || "Français"}, Niveau: ${enrichedContext.niveau || "Amateur"}`)

    try {
        const reply = await generateReply(systemPrompt, String(message).trim(), history, isOnline)
        if (!reply || !reply.trim()) {
            throw new Error("Le modèle a renvoyé une réponse vide.")
        }
        return res.json({ reply: reply.trim() })
    } catch (error) {
        console.error("[Error🚨]: on modelText Controller", error)
        const publicError = getPublicError(error)
        return res.status(publicError.status).json(publicError.body)
    }
}

export default modelTest
