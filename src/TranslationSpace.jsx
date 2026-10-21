import Footer from "./Footer"
import UserNavBar from "./UserNavBar"
import UserHeader from "./UserHeader"
import { useTranslation } from "react-i18next"
import { 
    ArrowLeftRight, 
    Loader2, 
    Copy, 
    Check, 
    Volume2, 
    Trash2, 
    Sparkles, 
    Wifi, 
    WifiOff, 
    Languages, 
    Cpu, 
    Globe,
    AlertCircle
} from "lucide-react"
import { useState, useEffect } from "react"
import translate from "./scripts/translation"

function TranslationSpace() {
    const { t } = useTranslation()
    const [fromLang, setFromLang] = useState("Francais")
    const [toLang, setToLang] = useState("Anglais")
    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")
    const [onTranslation, setOnTranslation] = useState(false)
    const [providerUsed, setProviderUsed] = useState(null)
    const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true)
    const [copied, setCopied] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Listen to network status changes
    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener("online", handleOnline)
        window.addEventListener("offline", handleOffline)

        return () => {
            window.removeEventListener("online", handleOnline)
            window.removeEventListener("offline", handleOffline)
        }
    }, [])

    // Swap languages
    const handleSwapLanguages = () => {
        const tempLang = fromLang
        setFromLang(toLang)
        setToLang(tempLang)

        // Swap contents if there is already a translation
        if (output) {
            setInput(output)
            setOutput(input)
        }
        setErrorMessage("")
    }

    // Trigger translation
    const handleTranslate = async (e) => {
        if (e) e.preventDefault()
        if (!input.trim() || onTranslation) return

        setOnTranslation(true)
        setErrorMessage("")
        setCopied(false)

        try {
            const result = await translate(input, toLang, isOnline)
            if (result.success) {
                setOutput(result.translation)
                setProviderUsed(result.provider || (isOnline ? "Groq (En ligne)" : "Qwen (Hors-ligne)"))
            } else {
                setErrorMessage(result.msg || "Erreur de traduction.")
            }
        } catch (err) {
            setErrorMessage("Impossible d'effectuer la traduction. Vérifiez que le serveur est bien lancé.")
        } finally {
            setOnTranslation(false)
        }
    }

    // Copy translation to clipboard
    const handleCopy = () => {
        if (!output) return
        navigator.clipboard.writeText(output)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // Text to Speech
    const handleSpeak = (text, langName) => {
        if (!text || typeof window === "undefined" || !window.speechSynthesis) return
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = langName === "Anglais" ? "en-US" : "fr-FR"
        window.speechSynthesis.speak(utterance)
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
            <UserHeader onMenuClick={() => setIsMenuOpen(!isMenuOpen)} isMenuOpen={isMenuOpen} />
            
            <div className="flex flex-1 pt-20 flex-row">
                <UserNavBar />

                <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full flex flex-col justify-between">
                    
                    {/** En-tête de la page */}
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="p-2 bg-blue-100 text-blue-700 rounded-xl inline-flex">
                                        <Languages className="w-5 h-5" />
                                    </span>
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                        {t("translationSpace.title")}
                                    </h1>
                                </div>
                                <p className="text-sm text-slate-600">
                                    {t("translationSpace.concept")}
                                </p>
                            </div>

                            {/** Badge d'état réseau et moteur */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                                    isOnline 
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}>
                                    {isOnline ? (
                                        <>
                                            <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                                            <span>En ligne (Priorité Groq)</span>
                                        </>
                                    ) : (
                                        <>
                                            <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                                            <span>Hors-ligne (Local Qwen)</span>
                                        </>
                                    )}
                                </div>

                                {providerUsed && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                        <Cpu className="w-3.5 h-3.5" />
                                        <span>{providerUsed}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/** Bannière d'erreur si échec */}
                        {errorMessage && (
                            <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                                <div className="flex-1">
                                    <p className="font-semibold">Attention</p>
                                    <p>{errorMessage}</p>
                                </div>
                            </div>
                        )}

                        {/** Barre de sélection et bascule des langues */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 mb-6 flex items-center justify-between gap-2 sm:gap-4">
                            {/** Langue source */}
                            <div className="flex-1 flex items-center justify-center sm:justify-start gap-2 px-3 py-2 bg-slate-50 rounded-xl font-bold text-slate-800 text-sm sm:text-base">
                                <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                                <span>{fromLang === "Francais" ? "🇫🇷 Français" : "🇬🇧 English"}</span>
                            </div>

                            {/** Bouton d'inversion des langues */}
                            <button
                                type="button"
                                onClick={handleSwapLanguages}
                                title={t("translationSpace.swapLanguages")}
                                className="p-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center shrink-0"
                            >
                                <ArrowLeftRight className="w-5 h-5" />
                            </button>

                            {/** Langue cible */}
                            <div className="flex-1 flex items-center justify-center sm:justify-start gap-2 px-3 py-2 bg-slate-50 rounded-xl font-bold text-slate-800 text-sm sm:text-base">
                                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                                <span>{toLang === "Anglais" ? "🇬🇧 English" : "🇫🇷 Français"}</span>
                            </div>
                        </div>

                        {/** Zone des blocs de traduction */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            
                            {/** Bloc Source */}
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-80 sm:h-96 overflow-hidden">
                                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                        {fromLang} ({t("translationSpace.sourceLabel")})
                                    </span>
                                    {input && (
                                        <button
                                            type="button"
                                            onClick={() => { setInput(""); setOutput(""); setErrorMessage(""); }}
                                            className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>{t("translationSpace.clear")}</span>
                                        </button>
                                    )}
                                </div>

                                <textarea
                                    name="toTrans"
                                    placeholder={t("translationSpace.inputPlaceholder")}
                                    className="flex-1 p-5 text-base sm:text-lg text-slate-800 placeholder-slate-400 outline-none resize-none bg-transparent leading-relaxed"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                            handleTranslate(e)
                                        }
                                    }}
                                />

                                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 bg-white">
                                    <div className="flex items-center gap-2">
                                        {input && (
                                            <button
                                                type="button"
                                                onClick={() => handleSpeak(input, fromLang)}
                                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                                                title={t("translationSpace.listen")}
                                            >
                                                <Volume2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <span>{input.length} {t("translationSpace.charsCount")}</span>
                                </div>
                            </div>

                            {/** Bloc Traduction */}
                            <div className="bg-gradient-to-br from-white to-blue-50/40 rounded-3xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-80 sm:h-96 overflow-hidden relative">
                                <div className="px-5 py-3.5 border-b border-blue-100 flex items-center justify-between bg-blue-50/50">
                                    <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                                        {toLang} ({t("translationSpace.targetLabel")})
                                    </span>
                                    {output && (
                                        <button
                                            type="button"
                                            onClick={handleCopy}
                                            className="text-xs text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-blue-200 hover:bg-blue-50 transition-all cursor-pointer"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span className="text-emerald-700">{t("translationSpace.copied")}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5" />
                                                    <span>{t("translationSpace.copy")}</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>

                                <div className="flex-1 p-5 overflow-auto text-base sm:text-lg text-slate-800 leading-relaxed">
                                    {onTranslation ? (
                                        <div className="flex flex-col items-center justify-center h-full gap-3 text-blue-600">
                                            <Loader2 className="w-8 h-8 animate-spin" />
                                            <p className="text-sm font-medium text-slate-500 animate-pulse">
                                                {t("translationSpace.translating")}
                                            </p>
                                        </div>
                                    ) : output ? (
                                        <p className="whitespace-pre-wrap select-text">{output}</p>
                                    ) : (
                                        <p className="text-slate-400 italic text-sm sm:text-base">
                                            {t("translationSpace.outputPlaceholder")}
                                        </p>
                                    )}
                                </div>

                                <div className="px-5 py-3 border-t border-blue-100 flex items-center justify-between text-xs text-slate-500 bg-white/70">
                                    <div className="flex items-center gap-2">
                                        {output && (
                                            <button
                                                type="button"
                                                onClick={() => handleSpeak(output, toLang)}
                                                className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-700 hover:text-blue-900 transition-colors cursor-pointer"
                                                title={t("translationSpace.listen")}
                                            >
                                                <Volume2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    {output && <span>{output.length} {t("translationSpace.charsCount")}</span>}
                                </div>
                            </div>

                        </div>

                        {/** Bouton principal Traduire */}
                        <div className="flex flex-col items-center justify-center gap-2 mb-8">
                            <button
                                type="button"
                                disabled={onTranslation || !input.trim()}
                                onClick={handleTranslate}
                                className="w-full sm:w-auto min-w-[240px] px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {onTranslation ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>{t("translationSpace.translating")}</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        <span>{t("translationSpace.translateButton")}</span>
                                    </>
                                )}
                            </button>
                            <span className="text-xs text-slate-500 hidden sm:inline">
                                Astuce : Utilisez Ctrl + Entrée pour traduire plus rapidement
                            </span>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 text-center text-xs text-slate-400">
                        JeTalk Translation Engine • Traduction optimisée IA bilingue anglais-français
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    )
}

export default TranslationSpace