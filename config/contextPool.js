import { getModel } from "./modelInitialisation.js"

// P1: Shared context — allocated once, reused across requests.
// Context creation is the expensive part (KV cache allocation).
// Sequences are cheap and created per-request.
let sharedContext = null

/**
 * Returns a shared LLM context, creating it lazily on first call.
 * Callers should create their own sequence via context.getSequence()
 * and dispose it when done.
 */
export async function acquireContext(contextSize = 1024) {
    if (!sharedContext) {
        console.log("==> Creating shared LLM context...")
        const model = await getModel()
        sharedContext = await model.createContext({
            contextSize,
            threads: 4
        })
        console.log("[Message✅]: Shared context ready")
    }
    return sharedContext
}
