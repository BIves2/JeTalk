import { Link } from "react-router-dom"
import Footer from "./Footer"
import NavBar from "./NavBar"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Navigate } from "react-router-dom"

/**Scripts for API communication */
import { verifyInfos, signup } from "./scripts/auth.js"
import { Trans, useTranslation } from "react-i18next"

/**
 * Page for signing up
 * @returns signing up page
 */
function SignUp(){

    const {t} = useTranslation()
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmVisible, setConfirmVisible] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [lang, setLang] = useState("en")
    const [level, setLevel] = useState("Amateur")
    const [message, setMessage] = useState("")

    const verifyPassword = (password)=>{
        if(password.length < 8){
            setMessage(t("signUpPage.errors.passwordMinLength"))
        } else if(!(/[a-z]/.test(password))){
            setMessage(t("signUpPage.errors.passwordLowercase"))
        } else if(!(/[A-Z]/.test(password))){
            setMessage(t("signUpPage.errors.passwordUppercase"))
        } else if(!(/[!~`@#$%&%^&*()_\-+={}\[\];':"<>.,\?\\]/.test(password))){
            setMessage(t("signUpPage.errors.passwordSpecialChar"))
        } else if(!(/[0-9]/.test(password))){
            setMessage(t("signUpPage.errors.passwordDigit"))
        } else {
            setMessage("")
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <div className="pt-20 flex flex-col md:flex-row flex-1">
                {/**Left Section of signup page*/}
                <form className="w-full md:w-1/2 p-5">

                    <fieldset className="flex flex-col p-5 rounded-2xl shadow-2xl">
                        <h1 className="text-3xl font-bold mb-10">{t('signUpPage.title')}</h1>

                        <label htmlFor="name">{t('signUpPage.form.fullNameLabel')}</label>
                        <input type="text" className="border mb-5 p-2 rounded-xl" name="name"
                            onChange={(e)=>{
                                setName(e.target.value)
                            }}
                        />

                        <label htmlFor="email">{t('signUpPage.form.emailLabel')}</label>
                        <input type="email" className="border mb-5 p-2 rounded-xl" name="email"
                            onChange={(e)=>{
                                setEmail(e.target.value)
                            }}
                        />

                        <div className="flex flex-col relative">
                            <label htmlFor="password">{t('signUpPage.form.passwordLabel')}</label>
                            <input type={passwordVisible ? "text" : "password"} name="password" className="border mb-5 p-2 rounded-xl"
                                onChange={(e)=>{
                                    setPassword(e.target.value)
                                }}
                            />
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    setPasswordVisible(!passwordVisible)
                                }}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 "
                            >
                                {passwordVisible?<EyeOff className="w-5 h-5"/>:<Eye className="w-5 h-5"/>}
                            </button>
                        </div>

                        <div className="flex flex-col relative">
                            <label htmlFor="confirm">{t('signUpPage.form.confirmPasswordLabel')}</label>
                            <input type={confirmVisible ? "text" : "password"} name="confirm" className="border mb-5 p-2 rounded-xl"
                                onChange={(e)=>{
                                setConfirmPassword(e.target.value)
                            }}
                            />
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    setConfirmVisible(!confirmVisible)
                                }}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 "
                            >
                                {confirmVisible?<EyeOff className="w-5 h-5"/>:<Eye className="w-5 h-5"/>}
                            </button>
                        </div>

                        <label htmlFor="lang">{t('signUpPage.form.langLabel')}</label>
                        <select name="lang" className="mb-5 border p-2 rounded-xl" onChange={(e)=>{setLang(e.target.value)}}>
                            <option value="en">{t('signUpPage.form.langEnglish')}</option>
                            <option value="fr">{t('signUpPage.form.langFrench')}</option>
                        </select>
                        <label htmlFor="">{t('signUpPage.form.levelLabel')}</label>
                        <div className="grid grid-cols-2 gap-3 w-1/2">
                            <label htmlFor="level">
                                <input type="radio" name="level" onClick={()=>setLevel("Amateur")} defaultChecked/>
                                <strong>{t('signUpPage.levels.amateur')}</strong>
                            </label>
                            <label htmlFor="level">
                                <input type="radio" name="level" onClick={()=>setLevel("Intermediaire")}/>
                                <strong>{t('signUpPage.levels.intermediate')}</strong>
                            </label>
                            <label htmlFor="level">
                                <input type="radio" name="level" onClick={()=>setLevel("Avance")}/>
                                <strong>{t('signUpPage.levels.advanced')}</strong>
                            </label>
                            <label htmlFor="level">
                                <input type="radio" name="level" onClick={()=>setLevel("Expert")}/>
                                <strong>{t('signUpPage.levels.expert')}</strong>
                            </label>
                        </div>
                        <strong className="text-center m-5 text-red-500">{message}</strong>
                        <div className="flex flex-row">
                            <input type="submit" value={t('signUpPage.buttons.submit')} className="p-5 rounded-4xl m-5 w-1/2 bg-green-400 md:bg-green-200 hover:bg-green-400 hover:text-white"
                               onClick={async (e)=>{
                                e.preventDefault()
                                if(!email.trim() || !password.trim() || !confirmPassword.trim() || !name.trim() || !lang.trim() || !level.trim()){
                                    setMessage(t("signUpPage.errors.fillAllFields"))
                                }else{
                                    setMessage("")
                                    const response = await verifyInfos(email, password)
                                    if(response.status !== 200) {
                                        setMessage(response.data.msg)
                                    }else{
                                        if(password != confirmPassword){
                                            setMessage(t("signUpPage.errors.passwordMismatch"))
                                        } else {
                                            const response = await signup(name, email, lang, level, password)
                                            if(response.status !== 200 && response.status !== 201){
                                                setMessage(response.data.msg)
                                            } else {
                                                {<Navigate to="/dashboard"/>}
                                            }
                                        }
                                    }
                                }
                               }}
                            />
                            <input type="reset" value={t('signUpPage.buttons.reset')} className="p-5 rounded-4xl m-5 w-1/2 bg-red-400 md:bg-red-200 hover:bg-red-400 hover:text-white"/>
                        </div>
                        <label htmlFor=""className="flex flex-row">
                            <input type="checkbox" name="" id="" className="size-15 md:size-5"/>
                            <span className="m-1 mb-10">{t('signUpPage.form.termsAgreement')}</span>
                        </label>
                        <p>{t('signUpPage.alreadyHaveAccount')} <Link to="/login" className="text-blue-800 [text-decoration:underline]">{t('signUpPage.loginLink')}</Link></p>
                    </fieldset>

                </form>
                {/**Right section of the signup page */}
                <div className="w-full md:w-1/2 bg-blue-200 md:flex hidden flex-col p-5">
                    <h1 className="text-4xl text-center font-bold pb-5">{t('signUpPage.info.title')}</h1>
                    <div>
                        <p>{t('signUpPage.info.intro')}</p>
                        <ul className="list-disc p-5">
                            <li>
                                <Trans
                                    i18nKey="signUpPage.info.rules.allFieldsRequired"
                                    components={{1: <strong />}}
                                />
                            </li>
                            <li>{t('signUpPage.info.rules.passwordRequirements')}</li>
                            <li>{t('signUpPage.info.rules.oneAccountPerEmail')}</li>
                            <li>{t('signUpPage.info.rules.usernameMinLength')}</li>
                            <li>{t('signUpPage.info.rules.confirmPasswordMatch')}</li>
                            <li>{t('signUpPage.info.rules.languageLevelAdvice')}</li>
                            <li>{t('signUpPage.info.rules.loginLinkAdvice')}</li>
                        </ul>
                        <p>{t('signUpPage.info.thankYou')}</p>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}
export default SignUp