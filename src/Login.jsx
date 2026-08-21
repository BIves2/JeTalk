import { useState } from "react"
import Footer from "./Footer"
import NavBar from "./NavBar"
import {Eye, EyeOff} from "lucide-react"
import { Link } from "react-router-dom"

/**
 * Page to log into JeTalk platform
 * @returns login page
 */
function Login(){
    const [passwordVisible, setPasswordVisible] = useState(false)
    return (
        <div className="pt-20 flex flex-col">
            <NavBar />
            <div className="md:w-1/2 self-center rounded-3xl flex flex-col h-full shadow-2xl p-5 mb-10 mt-10">
                <h1 className="font-bold text-4xl pb-10">Connectez-vous a JeTalk</h1>
                <form className="self-center w-full flex flex-col">
                    <label htmlFor="">Adresse email</label>
                    <input type="email" name="" id="" className="border mb-5 p-2 rounded-xl"/>
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
                    <div className="flex flex-row">
                        <input type="submit" value="Se connecter" className="p-5 rounded-4xl m-5 w-1/2 bg-green-400 md:bg-green-200 hover:bg-green-400 hover:text-white"/>
                        <input type="reset" value="Reinitialiser" className="p-5 rounded-4xl m-5 w-1/2 bg-red-400 md:bg-red-200 hover:bg-red-400 hover:text-white"/>
                    </div>
                    <p className="text-center">Vous n'avez pas encore de compte ? <Link to="/signup" className="text-blue-800 underline">Inscrivez-vous</Link></p>
                </form>
            </div>
            <Footer />
        </div>
    )
}
export default Login