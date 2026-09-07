import { useState } from "react"
import Footer from "./Footer"
import NavBar from "./NavBar"
import {Eye, EyeOff} from "lucide-react"
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
    const {login} = useAuth() 
    const navigator = useNavigate()
    const {t} = useTranslation()
    return (
        <div className="pt-20 flex flex-col">
            <NavBar />
            <div className="md:w-1/2 self-center rounded-3xl flex flex-col h-full shadow-2xl p-5 mb-10 mt-10">
                <h1 className="font-bold text-4xl pb-10">{t("loginPage.title")}</h1>
                <form className="self-center w-full flex flex-col">
                    <label htmlFor="email">{t("loginPage.emailLabel")}</label>
                    <input type="email" name="email" className="border mb-5 p-2 rounded-xl"
                        onChange={(e)=>{
                            setEmail(e.target.value)
                        }}
                        value={email}
                    />
                    <div className="flex flex-col relative">
                        <label htmlFor="password">{t("loginPage.passwordLabel")}</label>
                        <input type={passwordVisible ? "text" : "password"} name="password" className="border mb-5 p-2 rounded-xl"
                            onChange={(e)=>{
                                setPassword(e.target.value)
                            }}
                            value={password}
                        />
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                setPasswordVisible(!passwordVisible)
                            }}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                            {passwordVisible?<EyeOff className="w-5 h-5"/>:<Eye className="w-5 h-5"/>}
                        </button>
                    </div>
                    <div className="flex flex-row">
                        <input type="submit" value={t("loginPage.buttons.submit")} className="p-5 rounded-4xl m-5 w-1/2 bg-green-400 md:bg-green-200 hover:bg-green-400 hover:text-white"
                            onClick={async (e)=>{
                                e.preventDefault()
                                await login({email: email, password: password})
                                navigator('/dashboard', {replace: true})
                            }}
                        />
                        <input type="reset" value={t("loginPage.buttons.reset")} className="p-5 rounded-4xl m-5 w-1/2 bg-red-400 md:bg-red-200 hover:bg-red-400 hover:text-white"/>
                    </div>
                    <p className="text-center">{t("loginPage.noAccountPrompt")} <Link to="/signup" className="text-blue-800 underline">{t("loginPage.signupLink")}</Link></p>
                </form>
            </div>
            <Footer />
        </div>
    )
}
export default Login