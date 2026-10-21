import { Link, useNavigate } from "react-router-dom"
import Footer from "./Footer"
import NavBar from "./NavBar"
import { useState } from "react"
import { Eye, EyeOff, User, Mail, Lock, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, BookOpen, AlertCircle, Loader2 } from "lucide-react"

/** Scripts for API communication */
import { verifyInfos, signup } from "./scripts/auth.js"
import { Trans, useTranslation } from "react-i18next"
import { useAuth } from "./context/AuthContext"

/**
 * Page for signing up with polished JeTalk design
 * @returns signing up page
 */
function SignUp() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { login } = useAuth()

    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmVisible, setConfirmVisible] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [lang, setLang] = useState("en")
    const [level, setLevel] = useState("Amateur")
    const [agreed, setAgreed] = useState(false)
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Password validation rules
    const passwordChecks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        digit: /[0-9]/.test(password),
        special: /[!~`@#$%&%^&*()_\-+={}\[\];':"<>.,\?\\]/.test(password)
    }

    const levels = [
        { id: "Amateur", label: t('signUpPage.levels.amateur'), desc: "Débutant complet" },
        { id: "Intermediaire", label: t('signUpPage.levels.intermediate'), desc: "Bases solides" },
        { id: "Avance", label: t('signUpPage.levels.advanced'), desc: "Bonne aisance" },
        { id: "Expert", label: t('signUpPage.levels.expert'), desc: "Bilingue ou fluide" }
    ]

    const handleReset = () => {
        setName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setLang("en")
        setLevel("Amateur")
        setAgreed(false)
        setMessage("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage("")

        if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setMessage(t("signUpPage.errors.fillAllFields"))
            return
        }

        if (name.trim().length < 3) {
            setMessage("Votre nom d'utilisateur doit contenir au moins 3 caractères.")
            return
        }

        if (password !== confirmPassword) {
            setMessage(t("signUpPage.errors.passwordMismatch"))
            return
        }

        if (!passwordChecks.length || !passwordChecks.lowercase || !passwordChecks.uppercase || !passwordChecks.digit || !passwordChecks.special) {
            setMessage("Le mot de passe ne respecte pas tous les critères de sécurité.")
            return
        }

        if (!agreed) {
            setMessage("Veuillez accepter les conditions d'utilisation pour continuer.")
            return
        }

        setIsLoading(true)
        try {
            const verifyRes = await verifyInfos(email, password)
            if (verifyRes.status !== 200) {
                setMessage(verifyRes.data?.msg || "Erreur lors de la vérification des informations.")
                setIsLoading(false)
                return
            }

            const signupRes = await signup(name, email, lang, level, password)
            if (signupRes.status !== 200 && signupRes.status !== 201) {
                setMessage(signupRes.data?.msg || "Une erreur est survenue lors de la création de votre compte.")
                setIsLoading(false)
                return
            }

            // Auto-connexion optionnelle puis redirection vers le dashboard
            try {
                await login({ email, password })
                navigate('/dashboard', { replace: true })
            } catch (err) {
                navigate('/login', { replace: true })
            }
        } catch (error) {
            setMessage("Erreur réseau ou serveur inaccessible. Veuillez réessayer.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
            <NavBar />
            
            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex-1 flex items-center justify-center">
                <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden flex flex-col lg:flex-row">
                    
                    {/** Colonne Formulaire (Gauche) */}
                    <div className="w-full lg:w-7/12 p-6 sm:p-10 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="inline-flex items-center justify-center p-2 bg-blue-100 text-blue-700 rounded-xl">
                                    <Sparkles className="w-5 h-5" />
                                </span>
                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                                    Rejoindre JeTalk
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                                {t('signUpPage.title')}
                            </h1>
                            <p className="text-slate-600 text-sm sm:text-base mb-8">
                                Perfectionnez vos compétences bilingues français & anglais avec l'intelligence artificielle.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/** Message d'erreur */}
                                {message && (
                                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm animate-shake">
                                        <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                                        <span>{message}</span>
                                    </div>
                                )}

                                {/** Nom complet */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="name">
                                        {t('signUpPage.form.fullNameLabel')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="Ex: Christian Mballa"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-11 pr-4 py-2.5 text-sm sm:text-base bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xs"
                                        />
                                    </div>
                                </div>

                                {/** Email */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="email">
                                        {t('signUpPage.form.emailLabel')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="nom@exemple.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-11 pr-4 py-2.5 text-sm sm:text-base bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xs"
                                        />
                                    </div>
                                </div>

                                {/** Mots de passe côte-à-côte */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="password">
                                            {t('signUpPage.form.passwordLabel')}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <input
                                                id="password"
                                                type={passwordVisible ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-11 pr-11 py-2.5 text-sm sm:text-base bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xs"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setPasswordVisible(!passwordVisible)}
                                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                                aria-label="Afficher le mot de passe"
                                            >
                                                {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="confirm">
                                            {t('signUpPage.form.confirmPasswordLabel')}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <input
                                                id="confirm"
                                                type={confirmVisible ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full pl-11 pr-11 py-2.5 text-sm sm:text-base bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xs"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setConfirmVisible(!confirmVisible)}
                                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                                aria-label="Afficher la confirmation du mot de passe"
                                            >
                                                {confirmVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/** Indicateurs de robustesse mot de passe */}
                                {password.length > 0 && (
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                                        <p className="text-xs font-semibold text-slate-600 mb-2">Exigences de sécurité :</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                                            <span className={`flex items-center gap-1.5 ${passwordChecks.length ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                                                <CheckCircle2 className="w-3.5 h-3.5" /> 8+ caractères
                                            </span>
                                            <span className={`flex items-center gap-1.5 ${passwordChecks.uppercase ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                                                <CheckCircle2 className="w-3.5 h-3.5" /> 1 majuscule
                                            </span>
                                            <span className={`flex items-center gap-1.5 ${passwordChecks.lowercase ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                                                <CheckCircle2 className="w-3.5 h-3.5" /> 1 minuscule
                                            </span>
                                            <span className={`flex items-center gap-1.5 ${passwordChecks.digit ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                                                <CheckCircle2 className="w-3.5 h-3.5" /> 1 chiffre
                                            </span>
                                            <span className={`flex items-center gap-1.5 ${passwordChecks.special ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Caractère spécial
                                            </span>
                                            {confirmPassword && (
                                                <span className={`flex items-center gap-1.5 ${password === confirmPassword ? "text-emerald-600 font-medium" : "text-red-500"}`}>
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Correspondance
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/** Langue à apprendre */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="lang">
                                        {t('signUpPage.form.langLabel')}
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="lang"
                                            value={lang}
                                            onChange={(e) => setLang(e.target.value)}
                                            className="w-full px-4 py-2.5 text-sm sm:text-base bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xs cursor-pointer"
                                        >
                                            <option value="en">🇬🇧 {t('signUpPage.form.langEnglish')}</option>
                                            <option value="fr">🇫🇷 {t('signUpPage.form.langFrench')}</option>
                                        </select>
                                    </div>
                                </div>

                                {/** Niveau de départ */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                                        {t('signUpPage.form.levelLabel')}
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                        {levels.map((lvl) => {
                                            const isSelected = level === lvl.id
                                            return (
                                                <button
                                                    key={lvl.id}
                                                    type="button"
                                                    onClick={() => setLevel(lvl.id)}
                                                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                                        isSelected
                                                            ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 text-blue-900 shadow-xs"
                                                            : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50"
                                                    }`}
                                                >
                                                    <span className="font-bold text-sm">{lvl.label}</span>
                                                    <span className="text-[11px] text-slate-500 mt-1">{lvl.desc}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/** Conditions d'utilisation */}
                                <label className="flex items-start gap-3 cursor-pointer pt-2 select-none">
                                    <input
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        className="mt-1 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <span className="text-xs text-slate-600 leading-relaxed">
                                        {t('signUpPage.form.termsAgreement')}
                                    </span>
                                </label>

                                {/** Boutons d'action */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm sm:text-base hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Création du compte...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>{t('signUpPage.buttons.submit')}</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
                                    >
                                        {t('signUpPage.buttons.reset')}
                                    </button>
                                </div>

                                {/** Lien de connexion */}
                                <p className="text-center text-sm text-slate-600 pt-2">
                                    {t('signUpPage.alreadyHaveAccount')}{" "}
                                    <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800 hover:underline">
                                        {t('signUpPage.loginLink')}
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>

                    {/** Colonne Information & Avantages (Droite) */}
                    <div className="w-full lg:w-5/12 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
                        {/** Décorations de fond */}
                        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -left-20 -top-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-blue-200">
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Guide d'inscription</span>
                            </div>

                            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                                {t('signUpPage.info.title')}
                            </h2>

                            <p className="text-blue-100 text-sm leading-relaxed">
                                {t('signUpPage.info.intro')}
                            </p>

                            <div className="space-y-4 pt-2">
                                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                                    <p className="text-xs text-blue-50 leading-relaxed">
                                        <Trans
                                            i18nKey="signUpPage.info.rules.allFieldsRequired"
                                            components={{ 1: <strong className="text-white font-bold" /> }}
                                        />
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                                    <ShieldCheck className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" />
                                    <p className="text-xs text-blue-50 leading-relaxed">
                                        {t('signUpPage.info.rules.passwordRequirements')}
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                                    <User className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
                                    <p className="text-xs text-blue-50 leading-relaxed">
                                        {t('signUpPage.info.rules.oneAccountPerEmail')}
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
                                    <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                                    <p className="text-xs text-blue-50 leading-relaxed">
                                        {t('signUpPage.info.rules.languageLevelAdvice')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 pt-8 mt-8 border-t border-white/15">
                            <p className="text-xs text-blue-200/90 italic leading-relaxed">
                                "{t('signUpPage.info.thankYou')}"
                            </p>
                            <p className="text-xs font-semibold text-white mt-3">
                                — L'équipe JeTalk Cameroun
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    )
}

export default SignUp