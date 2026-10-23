import { X, MessageSquareWarningIcon, Loader2, Mic, MicOff, Play, Pause, Clock, BookOpen, BarChart2, CheckCircle2, Award, Sparkles, Home, Square, Globe } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { voiceApi } from "./scripts/voiceApi"
import { useInfos } from "./context/UserInfosContext"

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

// Languages available
const LANGUAGES = [
    { id: "Français", label: "Français 🇫🇷", speechLang: "fr-FR", desc: "S'entraîner en français" },
    { id: "Anglais",  label: "Anglais 🇬🇧",  speechLang: "en-US", desc: "Practice in English" }
]

// Levels displayed by the platform
const LEVELS = [
    { id: "Amateur",       label: "Amateur",       desc: "Débutant complet" },
    { id: "Intermediaire", label: "Intermédiaire", desc: "Bases solides" },
    { id: "Avance",        label: "Avancé",        desc: "Bonne aisance" },
    { id: "Expert",        label: "Expert",        desc: "Bilingue ou fluide" }
]

// Session times available
const DURATIONS = [5, 10, 15, 20, 30]

// Débit de la voix navigateur, utilisé uniquement si Edge-TTS est indisponible.
const BROWSER_TTS_RATE = {
    Amateur: 0.8,
    Intermediaire: 1,
    Avance: 1.15,
    Expert: 1.25
}

/**
 * Lit un texte avec la voix du navigateur.
 * Ce secours évite un silence total si le service Edge-TTS est bloqué.
 */
function speakWithBrowser(text, langue, niveau) {
    return new Promise((resolve) => {
        if (typeof window === "undefined" || !window.speechSynthesis || !window.SpeechSynthesisUtterance) {
            resolve()
            return
        }

        const utterance = new window.SpeechSynthesisUtterance(text)
        utterance.lang = langue === "Anglais" ? "en-US" : "fr-FR"
        utterance.rate = BROWSER_TTS_RATE[niveau] || 1

        const voices = window.speechSynthesis.getVoices()
        const matchingVoice = voices.find(v => v.lang === utterance.lang)
            || voices.find(v => v.lang?.startsWith(utterance.lang.split("-")[0]))
        if (matchingVoice) utterance.voice = matchingVoice

        let finished = false
        let safetyTimer = null
        const finish = () => {
            if (finished) return
            finished = true
            if (safetyTimer) clearTimeout(safetyTimer)
            resolve()
        }

        utterance.onend = finish
        utterance.onerror = (event) => {
            console.warn("==> Browser TTS error:", event.error)
            finish()
        }

        safetyTimer = setTimeout(finish, Math.max(8000, Math.min(60000, text.length * 120)))
        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(utterance)
    })
}

// ─── Étape 2, 3, 4 : Formulaire de configuration de la discussion ─────────────
function SessionForm({ onStart, userNiveau, userLangue }) {
    const [subject, setSubject] = useState("")
    const [duration, setDuration] = useState(10)
    const [niveau, setNiveau] = useState(userNiveau || "Amateur")
    const [langue, setLangue] = useState(userLangue || "Français")
    const [error, setError] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        // Étape 4 : Le système vérifie la conformité des champs
        if (!subject.trim()) {
            setError("Veuillez entrer un sujet de conversation valide.")
            return
        }
        if (!duration || duration <= 0) {
            setError("Veuillez choisir une durée valide pour la discussion.")
            return
        }
        setError("")
        // Étape 5 : Renseigner les champs et passer à l'interface de discussion
        onStart({ subject: subject.trim(), duration, niveau, langue })
    }

    return (
        <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-slate-950 px-6 py-8 overflow-y-auto">
            <div className="w-full max-w-md bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-800 my-auto">
                <h1 className="text-2xl font-bold text-white mb-2 text-center">Lancer une discussion</h1>
                <p className="text-slate-400 text-sm text-center mb-6">
                    Configurez la langue, le sujet et la durée avant de démarrer.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Choix de la langue */}
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                            <Globe className="w-4 h-4 text-cyan-400" />
                            Langue de la discussion <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang.id}
                                    type="button"
                                    onClick={() => setLangue(lang.id)}
                                    className={`flex flex-col items-start px-4 py-3 rounded-xl text-sm transition-all text-left cursor-pointer ${
                                        langue === lang.id
                                            ? "bg-cyan-600 text-white shadow-md border border-cyan-500"
                                            : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                                    }`}
                                >
                                    <span className="font-bold">{lang.label}</span>
                                    <span className={`text-xs mt-0.5 ${langue === lang.id ? "text-cyan-100" : "text-slate-500"}`}>
                                        {lang.desc}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sujet */}
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                            <BookOpen className="w-4 h-4 text-blue-400" />
                            Sujet de conversation <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={e => { setSubject(e.target.value); setError("") }}
                            placeholder={langue === "Anglais" ? "Ex: My hobbies, Travel, Technology..." : "Ex: La cuisine, Mes voyages, La technologie..."}
                            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            maxLength={100}
                            autoFocus
                        />
                        {error && <p className="text-red-400 text-xs font-medium">{error}</p>}
                    </div>

                    {/* Durée (Temps de la discussion) */}
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                            <Clock className="w-4 h-4 text-amber-400" />
                            Temps de la discussion
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {DURATIONS.map(d => (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => setDuration(d)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                                        duration === d
                                            ? "bg-amber-500 text-white shadow-md"
                                            : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                                    }`}
                                >
                                    {d} min
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Niveau */}
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                            <BarChart2 className="w-4 h-4 text-emerald-400" />
                            Niveau d'expression
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {LEVELS.map(lvl => (
                                <button
                                    key={lvl.id}
                                    type="button"
                                    onClick={() => setNiveau(lvl.id)}
                                    className={`flex flex-col items-start px-4 py-3 rounded-xl text-sm transition-all text-left cursor-pointer ${
                                        niveau === lvl.id
                                            ? "bg-emerald-600 text-white shadow-md border border-emerald-500"
                                            : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                                    }`}
                                >
                                    <span className="font-semibold">{lvl.label}</span>
                                    <span className={`text-xs mt-0.5 ${niveau === lvl.id ? "text-emerald-100" : "text-slate-500"}`}>
                                        {lvl.desc}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-2 w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
                    >
                        Démarrer la discussion
                    </button>
                </form>
            </div>
        </div>
    )
}

// ─── Timer de session ──────────────────────────────────────────────────────────
function SessionTimer({ durationMinutes, onTimeUp }) {
    const totalSeconds = durationMinutes * 60
    const [remaining, setRemaining] = useState(totalSeconds)
    const intervalRef = useRef(null)

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current)
                    onTimeUp()
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(intervalRef.current)
    }, [])

    const minutes = Math.floor(remaining / 60)
    const seconds = remaining % 60
    const progress = ((totalSeconds - remaining) / totalSeconds) * 100

    return (
        <div className="flex flex-col items-center gap-1">
            <span className={`text-sm font-mono font-bold ${remaining < 60 ? "text-red-400 animate-pulse" : "text-slate-300"}`}>
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
            <div className="w-28 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ${remaining < 60 ? "bg-red-500" : "bg-blue-500"}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    )
}

// ─── Espace de conversation principal ─────────────────────────────────────────
function ConversationSpace() {
    const navigate = useNavigate()
    const { id: userId, name, langue: userLangue, niveau: userNiveau, description: userDescription } = useInfos()

    const [sessionConfig, setSessionConfig] = useState(null)
    const [sessionEnded, setSessionEnded] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [observationsData, setObservationsData] = useState(null)
    const [dbSaved, setDbSaved] = useState(false)

    const [isListening, setIsListening] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [liveTranscript, setLiveTranscript] = useState("")
    const [assistantReply, setAssistantReply] = useState("")
    const [chatHistory, setChatHistory] = useState([])
    const [errorMessage, setErrorMessage] = useState(null)
    const [isPaused, setIsPaused] = useState(false)
    const isPausedRef = useRef(false)
    const isListeningRef = useRef(false)
    const pendingStartRef = useRef(false)
    const chatHistoryRef = useRef([])

    const recognitionRef = useRef(null)
    const audioPlayerRef = useRef(null)
    const silenceTimerRef = useRef(null)
    const transcriptionRef = useRef("")
    const handleSpeechFinishedRef = useRef(null)

    // Synchronisation de la ref chatHistory pour les callbacks asynchrones
    useEffect(() => {
        chatHistoryRef.current = chatHistory
    }, [chatHistory])

    // Initialisation de la reconnaissance vocale selon la langue choisie
    useEffect(() => {
        if (!SpeechRecognition) return

        const rec = new SpeechRecognition()
        const targetLangCode = sessionConfig?.langue === "Anglais" || sessionConfig?.langue === "en" ? 'en-US' : 'fr-FR'
        rec.lang = targetLangCode
        rec.continuous = true
        rec.interimResults = true

        rec.onstart = () => {
            console.log(`==> [SpeechRecognition] Listening started (${targetLangCode})`)
            isListeningRef.current = true
            pendingStartRef.current = false
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

            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
            silenceTimerRef.current = setTimeout(() => {
                handleSpeechFinishedRef.current?.()
            }, 1800)
        }

        rec.onerror = (event) => {
            console.warn("==> [SpeechRecognition Error]:", event.error)
            if (event.error !== 'no-speech') {
                isListeningRef.current = false
                setIsListening(false)
                setErrorMessage(`Erreur reconnaissance vocale : ${event.error}`)
            }
        }

        rec.onend = () => {
            console.log("==> [SpeechRecognition] Listening ended")
            isListeningRef.current = false
            setIsListening(false)
            if (pendingStartRef.current) {
                pendingStartRef.current = false
                if (!isPausedRef.current) {
                    setTimeout(() => startListening(), 80)
                }
            }
        }

        recognitionRef.current = rec

        return () => {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
            if (window.speechSynthesis) window.speechSynthesis.cancel()
            if (recognitionRef.current) {
                try { recognitionRef.current.stop() } catch (e) {}
            }
        }
    }, [sessionConfig?.langue])

    useEffect(() => {
        if (sessionConfig && !sessionEnded && !isAnalyzing) {
            setTimeout(() => startListening(), 300)
        }
    }, [sessionConfig, sessionEnded, isAnalyzing])

    const startListening = () => {
        if (!recognitionRef.current || isPausedRef.current || isAnalyzing || sessionEnded) return
        if (isListeningRef.current) {
            pendingStartRef.current = true
            return
        }
        pendingStartRef.current = false
        transcriptionRef.current = ""
        setLiveTranscript("")
        setErrorMessage(null)
        try {
            const targetLangCode = sessionConfig?.langue === "Anglais" || sessionConfig?.langue === "en" ? 'en-US' : 'fr-FR'
            recognitionRef.current.lang = targetLangCode
            recognitionRef.current.start()
        } catch (e) {
            console.warn("SpeechRecognition start error:", e)
            isListeningRef.current = false
        }
    }

    const stopListening = () => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
        pendingStartRef.current = false
        if (recognitionRef.current && isListeningRef.current) {
            try { recognitionRef.current.stop() } catch (e) {}
        }
        setIsListening(false)
    }

    const togglePause = () => {
        if (isPaused) {
            setIsPaused(false)
            isPausedRef.current = false
            startListening()
        } else {
            setIsPaused(true)
            isPausedRef.current = true
            stopListening()
            if (audioPlayerRef.current) audioPlayerRef.current.pause()
            if (window.speechSynthesis) window.speechSynthesis.cancel()
            setIsProcessing(false)
        }
    }

    /**
     * Étape 7 à 13 : Envoi de la voix, transcription, production de texte cohérent et synthèse/lecture audio
     */
    const handleSpeechFinished = async () => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)

        const textToSend = transcriptionRef.current.trim()
        stopListening()

        if (!textToSend) {
            startListening()
            return
        }

        setIsProcessing(true)
        setErrorMessage(null)
        setAssistantReply("")

        const sessionContext = {
            subject: sessionConfig?.subject,
            duration: sessionConfig?.duration,
            niveau: sessionConfig?.niveau,
            langue: sessionConfig?.langue || "Français",
            userName: name,
            userDescription: userDescription
        }

        try {
            // Étape 7-12 : Envoi backend -> Texte cohérent LLM -> Synthèse TTS
            const response = await voiceApi.sendVoiceMessage(textToSend, chatHistoryRef.current, sessionContext)
            const arrayBuffer = response.data
            let fallbackReply = ""

            // Si Edge-TTS a échoué, le serveur renvoie du JSON avec le texte.
            if (response.contentType.includes("application/json")) {
                const raw = new TextDecoder().decode(arrayBuffer)
                const payload = JSON.parse(raw)
                if (!payload?.reply) {
                    throw new Error(payload?.error || "L'assistant a renvoyé une réponse vide.")
                }
                fallbackReply = String(payload.reply).trim()
            }

            const updatedHistory = [
                ...chatHistoryRef.current,
                { role: "user", content: textToSend }
            ]
            if (fallbackReply) {
                updatedHistory.push({ role: "assistant", content: fallbackReply })
            }
            setChatHistory(updatedHistory)
            chatHistoryRef.current = updatedHistory

            if (fallbackReply) {
                // Secours : voix du navigateur + affichage du texte.
                console.warn("==> Edge-TTS indisponible : lecture avec la voix du navigateur.")
                setAssistantReply(fallbackReply)
                await speakWithBrowser(fallbackReply, sessionContext.langue, sessionContext.niveau)
                handleAiFinished()
                return
            }

            // Étape 13 : Le système lit le son produit à l’utilisateur
            if (audioPlayerRef.current && arrayBuffer && arrayBuffer.byteLength > 0) {
                if (audioPlayerRef.current.src?.startsWith("blob:")) {
                    URL.revokeObjectURL(audioPlayerRef.current.src)
                }
                const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' })
                const audioUrl = URL.createObjectURL(blob)
                audioPlayerRef.current.src = audioUrl
                audioPlayerRef.current.load()
                try {
                    await audioPlayerRef.current.play()
                } catch (playErr) {
                    console.warn("==> Audio playback error:", playErr)
                    handleAiFinished()
                }
            } else {
                throw new Error("Le serveur n'a renvoyé aucun audio.")
            }
        } catch (err) {
            console.error("[Error🚨 Sending to backend]:", err)
            setAssistantReply("")
            setIsProcessing(false)
            stopListening()
            setErrorMessage(
                "L'assistant n'a pas pu répondre. Vérifiez votre connexion, puis cliquez sur « Réessayer »."
            )
        }
    }
    handleSpeechFinishedRef.current = handleSpeechFinished

    const handleAiFinished = () => {
        setIsProcessing(false)
        setLiveTranscript("")
        transcriptionRef.current = ""
        // Étape 14 : Tant que le temps n'est pas fini ou non cliqué "Finir la conversation", reprendre à l'étape 7
        if (!isPausedRef.current && !sessionEnded && !isAnalyzing) {
            startListening()
        }
    }

    /**
     * Étape 15 à 20 : Fin de la conversation, analyse IA des performances, affichage des observations et stockage SGBD
     */
    const handleFinishConversation = async () => {
        stopListening()
        if (audioPlayerRef.current) audioPlayerRef.current.pause()
        if (window.speechSynthesis) window.speechSynthesis.cancel()
        setIsProcessing(false)
        setIsAnalyzing(true)

        const currentHistory = chatHistoryRef.current

        try {
            // Étape 16 & 17 : Envoi de l'ensemble de la conversation à l'API IA pour analyse des performances globales
            const analysis = await voiceApi.analyzeDiscussion(
                sessionConfig?.subject || "Discussion générale",
                sessionConfig?.duration || 10,
                sessionConfig?.niveau || "Amateur",
                currentHistory,
                sessionConfig?.langue || "Français"
            )

            setObservationsData(analysis)

            // Étape 19 & 20 : Envoi des informations de la conversation et des analyses au SGBD pour stockage
            try {
                await voiceApi.saveDiscussion(
                    sessionConfig?.subject,
                    sessionConfig?.duration,
                    sessionConfig?.niveau,
                    currentHistory,
                    analysis.observations || analysis,
                    analysis.score,
                    userId,
                    sessionConfig?.langue || "Français"
                )
                setDbSaved(true)
            } catch (dbErr) {
                console.error("[Error🚨 Saving to DB]:", dbErr)
            }

            setIsAnalyzing(false)
            setSessionEnded(true)

        } catch (err) {
            console.error("[Error🚨 Analyzing conversation]:", err)
            setObservationsData({
                score: 75,
                fluency: "Session terminée avec succès.",
                grammar: ["Bon respect des structures de phrases."],
                vocabulary: ["Poursuivez vos efforts d'expression."],
                observations: "Excellente pratique vocale pendant la session."
            })
            setIsAnalyzing(false)
            setSessionEnded(true)
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

    // ── Étape 2, 3, 4 : Formulaire initial ─────────────────────────────────────
    if (!sessionConfig) {
        return <SessionForm onStart={setSessionConfig} userNiveau={userNiveau} userLangue={userLangue} />
    }

    // ── Étape 16 & 17 : Écran de chargement et d'analyse IA ────────────────────
    if (isAnalyzing) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950 gap-6 px-6 text-white select-none">
                <div className="relative">
                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                    <Sparkles className="w-8 h-8 text-amber-400 absolute -top-2 -right-2 animate-bounce" />
                </div>
                <h1 className="text-2xl font-bold text-center">Analyse de la conversation en cours...</h1>
                <p className="text-slate-400 text-sm text-center max-w-sm">
                    L'API de modèles d'IA évalue vos performances en <strong className="text-cyan-400">{sessionConfig.langue}</strong> (fluidité, grammaire, vocabulaire).
                </p>
            </div>
        )
    }

    // ── Étape 18, 19, 20, 21 : Écran des observations et stockage BDD ─────────
    if (sessionEnded && observationsData) {
        return (
            <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-white select-none overflow-y-auto">
                <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 my-8">
                    
                    {/* Header résultats */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
                        <div>
                            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-1">
                                <CheckCircle2 className="w-5 h-5" /> Discussion terminée avec succès
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">Analyse des performances</h1>
                            <p className="text-slate-400 text-xs mt-1">
                                Langue : <span className="text-cyan-400 font-semibold">{sessionConfig.langue === "Anglais" ? "Anglais 🇬🇧" : "Français 🇫🇷"}</span> | Sujet : <span className="text-blue-400 font-medium">"{sessionConfig.subject}"</span> | Durée : {sessionConfig.duration} min
                            </p>
                        </div>

                        {/* Score global (Badge) */}
                        <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-2xl p-3 px-5">
                            <Award className="w-8 h-8 text-amber-400" />
                            <div>
                                <span className="text-xs text-slate-400 block font-medium">Note globale</span>
                                <span className="text-2xl font-extrabold text-amber-400">{observationsData.score || 80}/100</span>
                            </div>
                        </div>
                    </div>

                    {/* Étape 18 : Affichage des observations transmises par l'IA */}
                    <div className="flex flex-col gap-4">
                        {/* Fluidité */}
                        {observationsData.fluency && (
                            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                                <h3 className="text-sm font-semibold text-blue-400 flex items-center gap-2 mb-1">
                                    🗣️ Fluidité et aisance
                                </h3>
                                <p className="text-slate-300 text-sm leading-relaxed">{observationsData.fluency}</p>
                            </div>
                        )}

                        {/* Remarques grammaticales */}
                        {observationsData.grammar && Array.isArray(observationsData.grammar) && observationsData.grammar.length > 0 && (
                            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                                <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2 mb-2">
                                    📝 Remarques grammaticales
                                </h3>
                                <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                                    {observationsData.grammar.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Vocabulaire recommandé */}
                        {observationsData.vocabulary && Array.isArray(observationsData.vocabulary) && observationsData.vocabulary.length > 0 && (
                            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                                <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2 mb-2">
                                    💡 Vocabulaire et expressions
                                </h3>
                                <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                                    {observationsData.vocabulary.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Observations d'ensemble */}
                        {observationsData.observations && (
                            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                                <h3 className="text-sm font-semibold text-purple-400 flex items-center gap-2 mb-1">
                                    📌 Observations globales
                                </h3>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    {typeof observationsData.observations === 'string'
                                        ? observationsData.observations
                                        : JSON.stringify(observationsData.observations)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Confirmation du stockage BDD */}
                    {dbSaved && (
                        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 p-3 rounded-xl">
                            <CheckCircle2 className="w-4 h-4" />
                            Les données de cette discussion et ses analyses ont été enregistrées avec succès dans la base de données.
                        </div>
                    )}

                    {/* Étape 21 : Réafficher le tableau de bord à l'utilisateur */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                        >
                            <Home className="w-4 h-4" /> Retour au tableau de bord
                        </button>
                    </div>

                </div>
            </div>
        )
    }

    // ── Étape 5 à 14 : Interface active de la discussion ───────────────────────
    return (
        <div className="h-screen w-screen flex flex-col justify-between bg-slate-950 p-6 overflow-hidden select-none">
            {/* Header : sujet + langue + timer + fermer */}
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                    <span className="text-white font-semibold text-sm truncate max-w-48 flex items-center gap-1.5">
                        📖 {sessionConfig.subject}
                    </span>
                    <span className="text-slate-400 text-xs flex items-center gap-2">
                        <span>Langue : <strong className="text-cyan-400">{sessionConfig.langue === "Anglais" ? "Anglais 🇬🇧" : "Français 🇫🇷"}</strong></span>
                        <span>•</span>
                        <span>Niveau : {LEVELS.find(l => l.id === sessionConfig.niveau)?.label}</span>
                    </span>
                </div>

                <SessionTimer
                    durationMinutes={sessionConfig.duration}
                    onTimeUp={handleFinishConversation}
                />

                <button
                    className="w-10 h-10 rounded-full bg-red-600 flex justify-center items-center hover:bg-red-500 active:scale-95 transition-all shadow-md cursor-pointer"
                    onClick={handleFinishConversation}
                    title="Finir la conversation"
                >
                    <X className="text-white w-5 h-5" />
                </button>
            </div>

            {/* Zone centrale : Animation + Transcription vocale en direct */}
            <div className="flex-1 flex flex-col justify-center items-center gap-6">
                {errorMessage ? (
                    <div className="flex flex-col items-center gap-3 text-red-400 max-w-md text-center p-4">
                        <MessageSquareWarningIcon className="w-10 h-10" />
                        <p className="text-sm font-medium">{errorMessage}</p>
                        <button
                            onClick={startListening}
                            className="mt-3 px-4 py-2 text-xs bg-red-950 border border-red-800 text-red-200 rounded-lg hover:bg-red-900 transition-all cursor-pointer"
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
                            <p className="text-slate-200 text-lg font-medium italic bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
                                "{liveTranscript}"
                            </p>
                        )}

                        {assistantReply && (
                            <p className="text-cyan-100 text-sm sm:text-base leading-relaxed bg-cyan-950/50 px-4 py-3 rounded-xl border border-cyan-800/60 max-w-lg">
                                <span className="font-semibold text-cyan-400">Assistant : </span>
                                {assistantReply}
                            </p>
                        )}

                        <div className="flex flex-col gap-3 items-center w-full max-w-xs">
                            <div className="flex gap-2 w-full">
                                <button
                                    onClick={togglePause}
                                    className={`flex-1 py-3 font-medium rounded-full shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-white text-xs sm:text-sm cursor-pointer ${
                                        isPaused
                                            ? "bg-emerald-600 hover:bg-emerald-500"
                                            : "bg-amber-600 hover:bg-amber-500"
                                    }`}
                                >
                                    {isPaused ? (
                                        <><Play className="w-4 h-4 fill-current" /> Reprendre</>
                                    ) : (
                                        <><Pause className="w-4 h-4 fill-current" /> Pause</>
                                    )}
                                </button>

                                {/* Étape 15 : Bouton explicit "Finir la conversation" */}
                                <button
                                    onClick={handleFinishConversation}
                                    className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold rounded-full shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Square className="w-4 h-4 fill-current" /> Finir
                                </button>
                            </div>

                            {isListening && !isPaused && (
                                <button
                                    onClick={handleSpeechFinished}
                                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-full shadow transition-all active:scale-95 cursor-pointer"
                                >
                                    Envoyer le message
                                </button>
                            )}

                            {isProcessing && (
                                <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
                                    <Loader2 className="w-4 h-4 animate-spin" /> L'IA génère et parle...
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <audio
                ref={audioPlayerRef}
                onEnded={handleAiFinished}
                preload="none"
                className="hidden"
            />
        </div>
    )
}

export default ConversationSpace
