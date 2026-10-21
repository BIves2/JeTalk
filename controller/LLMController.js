import { getModel } from "../config/modelInitialisation.js"
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
 * Découpe un texte en phrases complètes pour le streaming TTS
 * Retourne un tableau de phrases non vides
 */
function splitIntoSentences(text) {
    const raw = text.split(/(?<=[.!?])\s+/)
    return raw.map(s => s.trim()).filter(s => s.length > 2)
}

/**
 * Synthèse TTS d'une phrase vers un buffer MP3 via EdgeTTS
 */
async function synthesizeSentence(text, voice = 'fr-FR-EloiseNeural', rate = '+0%', lang = 'fr-FR') {
    const ttsEdge = new EdgeTTS({
        voice,
        lang,
        outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
        rate
    })
    const tempFile = path.join(os.tmpdir(), `tts_${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`)
    try {
        await ttsEdge.ttsPromise(text, tempFile)
        if (fs.existsSync(tempFile)) {
            return fs.readFileSync(tempFile)
        }
    } catch (err) {
        console.error("[Error🚨 Edge-TTS sentence]:", err.message)
    } finally {
        if (fs.existsSync(tempFile)) {
            try { fs.unlinkSync(tempFile) } catch (e) {}
        }
    }
    return null
}

/**
 * Génération de texte via l'API Groq (en ligne) — mode streaming
 * Retourne le texte complet phrase par phrase via onSentence callback
 */
async function generateWithGroqStreaming(systemPrompt, message, history = [], onSentence) {
    const apiKey = process.env.GROQ_API
    if (!apiKey) throw new Error("GROQ_API key is not configured in .env")

    console.log("==> [Groq] Calling Groq API with streaming...")
    const messages = [
        { role: "system", content: systemPrompt },
        ...history.map(h => ({
            role: h.role === "assistant" ? "assistant" : "user",
            content: h.content
        })),
        { role: "user", content: message }
    ]

    const groqCandidateModels = ["qwen/qwen3.8-27b", "openai/gpt-oss-20b", "openai/gpt-oss-120b"]

    for (const modelId of groqCandidateModels) {
        try {
            console.log(`==> [Groq] Trying model: ${modelId} (streaming)...`)

            const response = await axios.post(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    model: modelId,
                    messages,
                    temperature: 0.7,
                    max_tokens: 300,
                    stream: true
                },
                {
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                        "Accept": "text/event-stream"
                    },
                    responseType: "stream",
                    timeout: 30000
                }
            )

            let buffer = ""
            let fullText = ""

            return await new Promise((resolve, reject) => {
                response.data.on("data", async (chunk) => {
                    const lines = chunk.toString().split("\n")
                    for (const line of lines) {
                        if (!line.startsWith("data: ")) continue
                        const data = line.slice(6).trim()
                        if (data === "[DONE]") continue
                        try {
                            const parsed = JSON.parse(data)
                            const token = parsed.choices?.[0]?.delta?.content || ""
                            buffer += token
                            fullText += token

                            // Dès qu'on a une phrase complète, on la synthétise
                            const sentenceMatch = buffer.match(/^(.*[.!?])\s*([\s\S]*)$/)
                            if (sentenceMatch) {
                                const sentence = sentenceMatch[1].trim()
                                buffer = sentenceMatch[2]
                                if (sentence.length > 2) {
                                    console.log(`==> [Stream] Sentence ready: "${sentence}"`)
                                    await onSentence(sentence)
                                }
                            }
                        } catch (e) {
                            // Chunk JSON incomplet, on ignore
                        }
                    }
                })

                response.data.on("end", async () => {
                    // Synthétiser le reste du buffer si non vide
                    const remaining = buffer.trim()
                    if (remaining.length > 2) {
                        console.log(`==> [Stream] Remaining buffer: "${remaining}"`)
                        await onSentence(remaining)
                    }
                    console.log(`[Message✅]: Groq streaming done with ${modelId}`)
                    resolve(fullText)
                })

                response.data.on("error", (err) => {
                    reject(err)
                })
            })

        } catch (apiError) {
            console.warn(`[Warning⚠️ Groq Model ${modelId} failed]:`, apiError.response?.data?.error?.message || apiError.message)
        }
    }

    throw new Error("Aucun modèle Groq n'a pu répondre.")
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
    const userId = req.user?.id
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

    // Header audio uniquement — le CORS est géré par le middleware Express
    res.setHeader('Content-Type', 'audio/mpeg')

    /**
     * Callback appelé pour chaque phrase générée :
     * synthétise et envoie le chunk audio immédiatement au client
     */
    const onSentence = async (sentence) => {
        const audioBuffer = await synthesizeSentence(sentence, ttsVoice, ttsRate, ttsLang)
        if (audioBuffer && audioBuffer.length > 0) {
            console.log(`==> [TTS] Streaming ${audioBuffer.length} bytes for: "${sentence}"`)
            res.write(audioBuffer)
        }
    }

    try {
        if (isOnline !== false && process.env.GROQ_API) {
            try {
                await generateWithGroqStreaming(systemPrompt, message, history, onSentence)
            } catch (groqErr) {
                console.warn("[Warning⚠️]: Groq streaming failed, falling back to Qwen:", groqErr.message)
                await generateWithQwenStreaming(systemPrompt, message, history, onSentence)
            }
        } else {
            console.log("==> Running offline with local Qwen model")
            await generateWithQwenStreaming(systemPrompt, message, history, onSentence)
        }

        console.log("[Message✅]: Treat ended (streaming complete)")
    } catch (error) {
        console.error("[Error🚨]: on model Controller", error)
        if (!res.headersSent) {
            const localModelMissing = /Modèle local indisponible/.test(error.message || "")
            res.status(localModelMissing ? 503 : 500).json({
                error: localModelMissing
                    ? "Le service de conversation est momentanément indisponible. Réessayez plus tard."
                    : "Une erreur est survenue lors de la génération."
            })
        }
    } finally {
        res.end()
    }
}

export default modelTest
