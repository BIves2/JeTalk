import { X, MessageSquareWarningIcon, Loader2, Mic, MicOff, Play, Pause } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { voiceApi } from "./scripts/voiceApi"

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

function ConversationSpace() {
    const navigate = useNavigate()
    const [isListening, setIsListening] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [liveTranscript, setLiveTranscript] = useState("")
    const [chatHistory, setChatHistory] = useState([])
    const [errorMessage, setErrorMessage] = useState(null)
    const [isPaused, setIsPaused] = useState(false)
    const isPausedRef = useRef(false)

    const recognitionRef = useRef(null)
    const audioPlayerRef = useRef(null)
    const silenceTimerRef = useRef(null)
    const transcriptionRef = useRef("")

    useEffect(() => {
        if (!SpeechRecognition) return

        const rec = new SpeechRecognition()
        rec.lang = 'fr-FR'
        rec.continuous = true
        rec.interimResults = true

        rec.onstart = () => {
            console.log("==> [Web Speech API] Listening started")
            setIsListening(true)
            setErrorMessage(null)
        }

        rec.onresult = (event) => {
            let currentText = ""
            for (let i = 0; i < event.results.length; i++) {
                currentText += event.results[i][0].transcript
            }
            transcriptionRef.current = currentText
            setLiveTranscript(currentText)
            console.log("==> [Web Speech API] Live transcript:", currentText)

            // Auto-send when user stops speaking for 1.8 seconds
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
            silenceTimerRef.current = setTimeout(() => {
                handleSpeechFinished()
            }, 1800)
        }

        rec.onerror = (event) => {
            console.warn("==> [Web Speech API Error]:", event.error)
            if (event.error !== 'no-speech') {
                setErrorMessage(`Erreur reconnaissance vocale : ${event.error}`)
            }
        }

        rec.onend = () => {
            console.log("==> [Web Speech API] Listening ended")
            setIsListening(false)
        }

        recognitionRef.current = rec

        return () => {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
            if (recognitionRef.current) {
                try { recognitionRef.current.stop() } catch (e) {}
            }
        }
    }, [])

    const startListening = () => {
        if (!recognitionRef.current || isPausedRef.current) return
        transcriptionRef.current = ""
        setLiveTranscript("")
        setErrorMessage(null)
        try {
            recognitionRef.current.start()
        } catch (e) {
            console.warn("SpeechRecognition start error:", e)
        }
    }

    const togglePause = () => {
        if (isPaused) {
            // Reprendre
            setIsPaused(false)
            isPausedRef.current = false
            startListening()
        } else {
            // Mettre en pause
            setIsPaused(true)
            isPausedRef.current = true
            stopListening()
            if (audioPlayerRef.current) {
                audioPlayerRef.current.pause()
            }
            setIsProcessing(false)
        }
    }

    const stopListening = () => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
        if (recognitionRef.current) {
            try { recognitionRef.current.stop() } catch (e) {}
        }
        setIsListening(false)
    }

    const handleSpeechFinished = async () => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)

        const textToSend = transcriptionRef.current.trim()
        console.log("==> [Web Speech API] Final text to send:", textToSend)

        stopListening()

        if (!textToSend) {
            console.log("==> No text captured, restarting listening...")
            startListening()
            return
        }

        setIsProcessing(true)
        setErrorMessage(null)

        try {
            const arrayBuffer = await voiceApi.sendVoiceMessage(textToSend, chatHistory)
            setChatHistory(prev => [
                ...prev,
                { role: "user", content: textToSend }
            ])
            if (audioPlayerRef.current && arrayBuffer) {
                if (audioPlayerRef.current.src && audioPlayerRef.current.src.startsWith("blob:")) {
                    URL.revokeObjectURL(audioPlayerRef.current.src)
                }
                const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' })
                const audioUrl = URL.createObjectURL(blob)
                audioPlayerRef.current.src = audioUrl
                try {
                    await audioPlayerRef.current.play()
                } catch (playErr) {
                    console.warn("==> Audio playback error or interrupted:", playErr)
                    handleAiFinished()
                }
            } else {
                handleAiFinished()
            }
        } catch (err) {
            console.error("[Error🚨 Sending to backend]:", err)
            handleAiFinished()
        }
    }

    const handleAiFinished = () => {
        setIsProcessing(false)
        setLiveTranscript("")
        transcriptionRef.current = ""
        // Auto-resume listening after AI audio finishes (only if not paused)
        if (!isPausedRef.current) {
            startListening()
        }
    }

    const getCercleAnimationClass = () => {
        if (isProcessing) return "animate-bounce bg-blue-600 shadow-lg shadow-blue-600/50"
        if (isListening) return "animate-pulse bg-emerald-500 shadow-lg shadow-emerald-500/50 scale-105"
        return "bg-slate-600 scale-95 opacity-80"
    }

    if (!SpeechRecognition) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-red-400 gap-2 p-4 text-center">
                <MessageSquareWarningIcon /> Votre navigateur ne supporte pas la reconnaissance vocale (Utilisez Chrome ou Edge).
            </div>
        )
    }

    return (
        <div className="h-screen w-screen flex flex-col justify-between bg-slate-950 p-6 overflow-hidden select-none">
            <button 
                className="w-10 h-10 rounded-full bg-red-600 flex justify-center items-center self-end hover:bg-red-500 active:scale-95 transition-all shadow-md"
                onClick={() => {
                    stopListening()
                    navigate(-1, { replace: true })
                }}
            >
                <X className="text-white w-5 h-5" />
            </button>

            <div className="flex-1 flex flex-col justify-center items-center gap-6">
                {errorMessage ? (
                    <div className="flex flex-col items-center gap-3 text-red-400 max-w-md text-center p-4">
                        <MessageSquareWarningIcon className="w-10 h-10" />
                        <p className="text-sm font-medium">{errorMessage}</p>
                        <button 
                            onClick={startListening}
                            className="mt-3 px-4 py-2 text-xs bg-red-950 border border-red-800 text-red-200 rounded-lg hover:bg-red-900 transition-all"
                        >
                            Réessayer
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-6 text-center max-w-lg">
                        <div 
                            onClick={isListening ? handleSpeechFinished : startListening}
                            className={`w-36 h-36 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center ${getCercleAnimationClass()}`}
                        >
                            {isListening ? (
                                <Mic className="w-12 h-12 text-white animate-pulse" />
                            ) : (
                                <MicOff className="w-12 h-12 text-slate-300" />
                            )}
                        </div>

                        {liveTranscript && (
                            <p className="text-slate-200 text-lg font-medium italic bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 animate-fade-in">
                                "{liveTranscript}"
                            </p>
                        )}

                        <div className="flex flex-col gap-3 items-center">
                            <button 
                                onClick={togglePause}
                                className={`px-6 py-3 font-medium rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2 text-white ${
                                    isPaused 
                                        ? "bg-emerald-600 hover:bg-emerald-500" 
                                        : "bg-amber-600 hover:bg-amber-500"
                                }`}
                            >
                                {isPaused ? (
                                    <>
                                        <Play className="w-5 h-5 fill-current" /> Reprendre la conversation
                                    </>
                                ) : (
                                    <>
                                        <Pause className="w-5 h-5 fill-current" /> Mettre en pause
                                    </>
                                )}
                            </button>

                            {isListening && !isPaused && (
                                <button 
                                    onClick={handleSpeechFinished}
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-full shadow transition-all active:scale-95"
                                >
                                    Envoyer le message
                                </button>
                            )}

                            {isProcessing && (
                                <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Traitement par l'IA...
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <audio 
                ref={audioPlayerRef} 
                onEnded={handleAiFinished} 
                className="hidden" 
            />
        </div>
    )
}

export default ConversationSpace
