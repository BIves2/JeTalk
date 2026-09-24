import { getLlama, Llama, LlamaChatSession } from "node-llama-cpp";
import path from "path"
import { fileURLToPath } from "url";

console.log("==> Model initialisation on process")
// Forcer l'utilisation du CPU (gpu: false) pour éviter d'allouer de la VRAM inexistante ou insuffisante
const llama = await getLlama({
    gpu: false
})
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const model = await llama.loadModel({
    modelPath: path.join(__dirname, "/../public/res", "Qwen2.5-1.5B-Instruct-Q4_K_M.gguf")
})
console.log("[Message✅]: Model successfully initialised on CPU !")
export {llama, model}