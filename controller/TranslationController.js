import { LlamaChatSession } from "node-llama-cpp"
import { model } from "../config/modelInitialisation.js"


async function TranslationController(req, res){
    const {message, lang} = req.body
    const context = await model.createContext({
        contextSize: 1024,
        threads: 4
    })
    const sequence = context.getSequence()
    const prompt = `Traduit en ${lang} le texte suivant :\n${message}`

    const session = new LlamaChatSession({
        contextSequence: sequence,
        systemPrompt: `Tu es un traducteur automatique stricte et precis
        Tes regles de fonctionnement sont les suivantes :
        -> Reponds UNIQUEMENT et EXCLUSIVEMENT avec e texte traduit
        -> Ne rajoute AUCUNE introduction, ni politesse, ni commentaire, ni balise (HTML ou XML) dans ta reponse
        -> Corrige silencieusement les fautes d'orthographe du texte original
        -> Ta traduction doit refleter le sens exacte de la phrase de depart
        -> Ne met pas de decorations (pas de "" ou de '' ou de / ou autre)
        `
    })

    console.log(message)
    console.log("\n==> Translation on treatment ...")
    try{
        const response = await session.prompt(prompt, {
            temperature: 0.8
        })
        console.log("[Message✅]: Message translated successfully !")
        return res.json({translation: response})
    } catch (error) {
        console.log("[Error🚨] :", error)
        return res.status(500).json({code: "INTERNAL_ERROR"})
    } finally {
        if(sequence){
            sequence.dispose()
        }
    }
}

export default TranslationController