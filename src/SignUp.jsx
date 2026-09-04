import { Link } from "react-router-dom"
import Footer from "./Footer"
import NavBar from "./NavBar"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Navigate } from "react-router-dom"

/**Scripts for API communication */
import { verifyInfos, signup } from "./scripts/auth.js"

/**
 * Page for signing up
 * @returns signing up page
 */
function SignUp(){

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
            setMessage("Le mot de passe doit contenir au moins 8 caracteres")
        } else if(!(/[a-z]/.test(password))){
            setMessage("Minuscule manquante !")
        } else if(!(/[A-Z]/.test(password))){
            setMessage("Majuscule manquante dans le mot de passe !")
        } else if(!(/[!~`@#$%&%^&*()_\-+={}\[\];':"<>.,\?\\]/.test(password))){
            setMessage("Caractere special manquant dans le mot de passe !")
        } else if(!(/[0-9]/.test(password))){
            setMessage("Chiffre manquant dans le mot de passe")
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
                        <h1 className="text-3xl font-bold mb-10">Creez votre compte JeTalk</h1>

                        <label htmlFor="name">Nom complet</label>
                        <input type="text" className="border mb-5 p-2 rounded-xl" name="name"
                            onChange={(e)=>{
                                setName(e.target.value)
                                value = {name}
                            }}
                        />

                        <label htmlFor="email">Adresse e-mail</label>
                        <input type="email" className="border mb-5 p-2 rounded-xl" name="email"
                            onChange={(e)=>{
                                setEmail(e.target.value)
                                value = {email}
                            }}
                        />

                        <div className="flex flex-col relative">
                            <label htmlFor="password">Mot de passe</label>
                            <input type={passwordVisible ? "text" : "password"} name="password" className="border mb-5 p-2 rounded-xl"
                                onChange={(e)=>{
                                    setPassword(e.target.value)
                                    value = {password}
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
                            <label htmlFor="confirm">Confirmez le mot de passe</label>
                            <input type={confirmVisible ? "text" : "password"} name="confirm" className="border mb-5 p-2 rounded-xl"
                                onChange={(e)=>{
                                setConfirmPassword(e.target.value)
                                value = {confirmPassword}
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

                        <label htmlFor="lang">Langue a apprendre</label>
                        <select name="lang" className="mb-5 border p-2 rounded-xl" onChange={(e)=>{setLang(e.target.value)}}>
                            <option value="en">Anglais</option>
                            <option value="fr">Francais</option>
                        </select>
                        <label htmlFor="">Niveau actuel</label>
                        <div className="grid grid-cols-2 gap-3 w-1/2">
                            <label htmlFor="level">
                                <input type="radio" name="level" onClick={()=>setLevel("Amateur")} defaultChecked/>
                                <strong>Amateur</strong>
                            </label>
                            <label htmlFor="level">
                                <input type="radio" name="level" onClick={()=>setLevel("Intermediaire")}/>
                                <strong>Intermediaire</strong>
                            </label>
                            <label htmlFor="level">
                                <input type="radio" name="level" onClick={()=>setLevel("Avance")}/>
                                <strong>Avance</strong>
                            </label>
                            <label htmlFor="level">
                                <input type="radio" name="level" onClick={()=>setLevel("Expert")}/>
                                <strong>Expert</strong>
                            </label>
                        </div>
                        <strong className="text-center m-5 text-red-500">{message}</strong>
                        <div className="flex flex-row">
                            <input type="submit" value="S'inscrire" className="p-5 rounded-4xl m-5 w-1/2 bg-green-400 md:bg-green-200 hover:bg-green-400 hover:text-white"
                               onClick={async (e)=>{
                                e.preventDefault()
                                if(!email.trim() || !password.trim() || !confirmPassword.trim() || !name.trim() || !lang.trim() || !level.trim()){
                                    setMessage("Veuillez remplir tous les champs avant de soumettre le formulaire !")
                                }else{
                                    setMessage("")
                                    const response = await verifyInfos(email, password)
                                    if(response.status !== 200) {
                                        setMessage(response.data.msg)
                                    }else{
                                        if(password != confirmPassword){
                                            setMessage("La confirmation du mot de passe et le mot de passe ne sont pas similaires")
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
                            <input type="reset" value="Reinitialiser" className="p-5 rounded-4xl m-5 w-1/2 bg-red-400 md:bg-red-200 hover:bg-red-400 hover:text-white"/>
                        </div>
                        <label htmlFor=""className="flex flex-row">
                            <input type="checkbox" name="" id="" className="size-15 md:size-5"/>
                            <span className="m-1 mb-10">Je confirme mon niveau de langue et j'accepte les conditions d'utilisation et la politique de confidentialite</span>
                        </label>
                        <p>Vous avez deja un compte ? <Link to="/login" className="text-blue-800 [text-decoration:underline]">Connectez-vous</Link></p>
                    </fieldset>

                </form>
                {/**Right section of the signup page */}
                <div className="w-full md:w-1/2 bg-blue-200 md:flex hidden flex-col p-5">
                    <h1 className="text-4xl text-center font-bold pb-5">Inscrivez vous sur JeTalk</h1>
                    <p>Inscrivez vous sur la plateforme JeTalk pour beneficier de toutes fonctionnalites que peut vous offir notre solution. 
                        <br />Votre inscription doit respecter les consignes suivantes : 
                        <ul className="list-disc p-5">
                            <li>Tous les champs de ce formulaires sont <strong>obligatoires</strong></li>
                            <li>Le mot de passe doit contenir au moins 8 caracteres (avec des majuscules, des minuscules et des caracteres speciaux);</li>
                            <li>Un email ne peut creer qu'un seul compte;</li>
                            <li>Votre nom d'utilisateur doit avoir minimum 3 lettres;</li>
                            <li>La confimation du mot de passe doit correspondre au mot de passe inscrit dans le champ mot de pass</li>
                            <li>Entrez votre niveau exacte d'anglais pour permettre un suivi de qualite. Si vous ne maitrisez pas votre niveau, inscrivez Amateur, vous pourrez passer un test pour determiner plus precisement votre niveau</li>
                            <li>Si vous possedez deja un compte, vous pouvez cliquer sur le lien de connexion en bas du formulaire</li>
                        </ul>
                        Tout en vous remerciant de votre inscription et de la confiance que vous accordez a JeTalk, nous vous souhaitons un heureux sejour sur la plateforme JeTalk
                    </p>
                </div>

            </div>
            <Footer />
        </div>
    )
}
export default SignUp