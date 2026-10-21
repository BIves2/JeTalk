import { useState } from "react"
import Footer from "./Footer"
import NavBar from "./NavBar"
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuth } from "./context/AuthContext"
import { useNavigate } from "react-router-dom"

/**
 * Page to log into JeTalk platform
 * @returns login page
 */
function Login(){
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const {login} = useAuth()
    const navigator = useNavigate()
    const {t} = useTranslation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            await login({email: email, password: password})
            navigator('/dashboard', {replace: true})
        } catch (err) {
            const code = err?.response?.data?.code
            if (code === "WRONG_INFORMATIONS") {
                setError(t("loginPage.errors.wrongCredentials"))
            } else if (code === "USER_NOT_FOUND") {
                setError(t("loginPage.errors.userNotFound"))
            } else if (code === "UNKNOW_ERROR") {
                setError(t("loginPage.errors.unknownError"))
            } else if (err.code === "ERR_NETWORK" || !err.response) {
                setError(t("loginPage.errors.networkError"))
            } else {
                setError(t("loginPage.errors.serverError"))
            }
        }
    }

    return (
        <div className="pt-20 flex flex-col min-h-screen bg-blue-50">
            <NavBar />
            <div className="flex-1 flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 md:p-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-950 mb-6">{t("loginPage.title")}</h1>

                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
                            <AlertCircle className="size-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">{t("loginPage.emailLabel")}</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onChange={(e)=>{ setEmail(e.target.value) }}
                                    value={email}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">{t("loginPage.passwordLabel")}</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className="w-full border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onChange={(e)=>{ setPassword(e.target.value) }}
                                    value={password}
                                />
                                <button
                                    type="button"
                                    onClick={()=>{ setPasswordVisible(!passwordVisible) }}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                                >
                                    {passwordVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                            >
                                {t("loginPage.buttons.submit")}
                            </button>
                            <button
                                type="reset"
                                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                            >
                                {t("loginPage.buttons.reset")}
                            </button>
                        </div>
                        <p className="text-center text-sm text-slate-600 pt-2">
                            {t("loginPage.noAccountPrompt")}{" "}
                            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">{t("loginPage.signupLink")}</Link>
                        </p>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default Login
