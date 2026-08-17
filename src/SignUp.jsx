import { Link } from "react-router-dom"
import Footer from "./Footer"
import NavBar from "./NavBar"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

/**
 * 
 * @returns 
 */
function SignUp(){
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmVisible, setConfirmVisible] = useState(false)
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <div className="pt-20 flex flex-col md:flex-row flex-1">
                <form className="w-full md:w-1/2 p-5">

                    <fieldset className="flex flex-col p-5 rounded-2xl shadow-2xl">
                        <h1 className="text-3xl font-bold mb-10">Creez votre compte JeTalk</h1>

                        <label htmlFor="">Nom complet</label>
                        <input type="text" className="border mb-5 p-2 rounded-xl"/>
                        <label htmlFor="">Adresse e-mail</label>
                        <input type="email" className="border mb-5 p-2 rounded-xl"/>

                        <div className="flex flex-col relative">
                            <label htmlFor="">Mot de passe</label>
                            <input type={passwordVisible ? "text" : "password"} name="" id="" className="border mb-5 p-2 rounded-xl"/>
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
                            <label htmlFor="">Confirmez le mot de passe</label>
                            <input type={confirmVisible ? "text" : "password"} name="" id="" className="border mb-5 p-2 rounded-xl"/>
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

                        <label htmlFor="">Langue a apprendre</label>
                        <select name="" id="" className="mb-5 border p-2 rounded-xl">
                            <option value="anglais">Anglais</option>
                            <option value="francais">Francais</option>
                        </select>
                        <label htmlFor="">Niveau actuel</label>
                        <div className="grid grid-cols-2 gap-3 w-1/2">
                            <label htmlFor="">
                                <input type="radio" name="level" id="" defaultChecked/>
                                <strong>Amateur</strong>
                            </label>
                            <label htmlFor="">
                                <input type="radio" name="level" id=""/>
                                <strong>Intermediaire</strong>
                            </label>
                            <label htmlFor="">
                                <input type="radio" name="level" id=""/>
                                <strong>Avance</strong>
                            </label>
                            <label htmlFor="">
                                <input type="radio" name="level" id="" />
                                <strong>Expert</strong>
                            </label>
                        </div>
                        <div className="flex flex-row">
                            <input type="submit" value="S'inscrire" className="p-5 rounded-4xl m-5 w-1/2 bg-green-400 md:bg-green-200 hover:bg-green-400 hover:text-white"/>
                            <input type="reset" value="Reinitialiser" className="p-5 rounded-4xl m-5 w-1/2 bg-red-400 md:bg-red-200 hover:bg-red-400 hover:text-white"/>
                        </div>
                        <label htmlFor=""className="flex flex-row">
                            <input type="checkbox" name="" id="" className="size-15 md:size-5"/>
                            <span className="m-1 mb-10">Je confirme mon niveau de langue et j'accepte les conditions d'utilisation et la politique de confidentialite</span>
                        </label>
                        <p>Vous avez deja un compte ? <Link to="/login" className="text-blue-800 [text-decoration:underline]">Connectez-vous</Link></p>
                    </fieldset>

                </form>
                <div className="w-full md:w-1/2 bg-blue-200 md:flex hidden">
                    <h1 className="text-4xl text-center font-bold">Inscrivez vous sur JeTalk</h1>
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default SignUp