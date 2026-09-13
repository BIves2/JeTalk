import path from "path"
import { fileURLToPath } from "url"
import { getLlama, LlamaChatSession } from "node-llama-cpp"

let sharedLlama = null
let sharedModel = null

async function modelTest(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Méthode non autorisée. Utilisez POST." })
    }

    const { message, history } = req.body
    if (!message) {
        return res.status(400).json({ error: "Le champ 'message' est obligatoire." })
    }

    try {
        const __dirname = path.dirname(fileURLToPath(import.meta.url))
        if (!sharedLlama) sharedLlama = await getLlama()
        if (!sharedModel) {
            sharedModel = await sharedLlama.loadModel({
                modelPath: path.join(__dirname, "/../public/res", "Qwen2.5-1.5B-Instruct-Q4_K_M.gguf")
            })
        }

        const context = await sharedModel.createContext({
            contextSize: 2048,
            threads: 4
        })

        const session = new LlamaChatSession({
            contextSequence: context.getSequence(),
            chatHistory: history || [] 
        })

        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')
        res.setHeader('Access-Control-Allow-Origin', '*') 

        await session.prompt(message, {
            onToken: (tokens) => {
                const chunk = sharedModel.detokenize(tokens)
                res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`)
            }
        })

        const updatedHistory = session.getChatHistory()
        res.write(`data: ${JSON.stringify({ done: true, history: updatedHistory })}\n\n`)

    } catch (error) {
        console.error("Erreur du modèle LLM:", error)
        res.write(`data: ${JSON.stringify({ error: "Une erreur est survenue lors de la génération." })}\n\n`)
    } finally {
        res.end()
    }
}

export default modelTest