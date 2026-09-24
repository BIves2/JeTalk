import { model } from "../config/modelInitialisation.js"
import { EdgeTTS } from "node-edge-tts"
import { LlamaChatSession } from "node-llama-cpp"
import fs from "node:fs"
import path from "node:path"
import os from "node:os"
import axios from "axios"

const SYSTEM_PROMPT = `Tu es un assistant vocal d'apprentissage du francais.
Tu dois respecter les consignes suivantes :
-> Tu ne dois pas generer des phrases trop longues, le plus simple c'est le plus efficace
-> Tu ne dois pas generer plus de trois phrases, et tu dois avoir une restriction de 20 mots par phrase maximum
-> Tu dois etre polie, bienveillant et amusant
-> Ne mets pas de signes particuliers dans ta production (pas de *, # sauf si indispensable dans le contexte) mais mets quand meme des ponctuations
-> Tu dois constamment demander a l'utiliteur si il a bien compris en lui proposant d'expliquer des mots difficiles par exemple
-> Ce que l'utilisateur va t'envoyer peut contenir des fautes (a cause du micro), donc essaie de comprendre le sens et non exactement les ecrite
-> Tu es restreint a maximum 5 phrases
`

/**
 * Génération de texte via l'API Groq (en ligne)
 */
async function generateWithGroq(message, history = []) {
    const apiKey = process.env.GROQ_API
    if (!apiKey) {
        throw new Error("GROQ_API key is not configured in .env")
    }

    console.log("==> [Groq] Calling Groq API (llama-3.1-8b-instant)...")
    const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.map(h => ({
            role: h.role === "assistant" ? "assistant" : "user",
            content: h.content
        })),
        { role: "user", content: message }
    ]

    const groqCandidateModels = ["qwen/qwen3.8-27b", "openai/gpt-oss-20b", "openai/gpt-oss-120b"]

    for (const modelId of groqCandidateModels) {
        try {
            console.log(`==> [Groq] Trying model: ${modelId}...`)
            const response = await axios.post(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    model: modelId,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 300
                },
                {
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    },
                    timeout: 15000
                }
            )

            const reply = response.data?.choices?.[0]?.message?.content || ""
            console.log(`[Message✅]: Groq response received with model ${modelId}:`, reply)
            return reply
        } catch (apiError) {
            console.warn(`[Warning⚠️ Groq Model ${modelId} failed]:`, apiError.response?.data?.error?.message || apiError.message)
        }
    }

    throw new Error("Aucun modèle Groq n'a pu répondre.")
}

/**
 * Génération de texte via le modèle local Qwen (hors ligne)
 */
async function generateWithQwen(message, history = []) {
    console.log("==> [Qwen Local] Starting local inference...")
    let context = null
    let sequence = null

    try {
        context = await model.createContext({
            contextSize: 1024,
            threads: 4
        })
        sequence = context.getSequence()

        const session = new LlamaChatSession({
            contextSequence: sequence,
            chatHistory: history || [],
            systemPrompt: SYSTEM_PROMPT
        })

        let fullTextBuffer = ""
        await session.prompt(message, {
            onToken: (tokens) => {
                fullTextBuffer += model.detokenize(tokens)
            }
        })

        return fullTextBuffer.trim()
    } finally {
        if (sequence) sequence.dispose()
    }
}

async function modelTest(req, res) {
    console.log(" > Session started !")
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Méthode non autorisée. Utilisez POST." })
    }

    const { message, history, isOnline } = req.body
    if (!message) {
        return res.status(400).json({ error: "Le champ 'message' est obligatoire." })
    }

    try {
        console.log("==> Treat Start...")
        console.log(`==> Mode requested: ${isOnline ? "Online (Groq)" : "Offline (Qwen)"}`)

        let textToProcess = ""

        // Si l'utilisateur est en ligne et que la clé Groq est fournie, on utilise Groq
        if (isOnline !== false && process.env.GROQ_API) {
            try {
                textToProcess = await generateWithGroq(message, history)
            } catch (groqErr) {
                console.warn("[Warning⚠️ ]: Groq generation failed or unreachable, falling back to local Qwen:", groqErr.message)
                textToProcess = await generateWithQwen(message, history)
            }
        } else {
            // Hors-ligne ou sans clé Groq : utilisation directe de Qwen local
            console.log("==> Running offline with local Qwen model")
            textToProcess = await generateWithQwen(message, history)
        }

        console.log("==> Full LLM Text generated:", textToProcess)

        res.setHeader('Content-Type', 'audio/mpeg')
        res.setHeader('Transfer-Encoding', 'chunked')
        res.setHeader('Access-Control-Allow-Origin', '*')

        // Synthèse vocale TTS : Envoi direct de tout le texte généré
        const ttsEdge = new EdgeTTS({
            voice: 'fr-FR-EloiseNeural',
            lang: 'fr-FR',
            outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
        })

        const synthesizeFullTextWithEdgeTTS = async (text) => {
            const tempFile = path.join(os.tmpdir(), `tts_${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`)
            try {
                console.log("==> [Edge-TTS] Synthesizing full text directly:", text)
                await ttsEdge.ttsPromise(text, tempFile)
                if (fs.existsSync(tempFile)) {
                    return fs.readFileSync(tempFile)
                }
            } catch (err) {
                console.error("[Error🚨 Edge-TTS]:", err)
            } finally {
                if (fs.existsSync(tempFile)) {
                    try { fs.unlinkSync(tempFile) } catch(e) {}
                }
            }
            return null
        }

        if (textToProcess) {
            console.log("==> Sending full text directly to speech synthesis...")
            const audioBuffer = await synthesizeFullTextWithEdgeTTS(textToProcess)
            if (audioBuffer && audioBuffer.length > 0) {
                console.log(`==> Audio MP3 generated directly: ${audioBuffer.length} bytes`)
                res.write(audioBuffer)
            }
        }

        console.log("[Message✅]: Treat ended")
    } catch (error) {
        console.error("[Error🚨]: on model Controller" , error)
        if (!res.headersSent) {
            res.status(500).json({ error: "Une erreur est survenue lors de la génération." })
        }
    } finally {
        res.end()
    }
}

export default modelTest
