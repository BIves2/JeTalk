import draw from "../src/assets/JeTalkDraw.png"
import word from "../src/assets/JeTalkWords.png"
import logo from "../src/assets/JeTalkLogo.png"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import TranslationButton from "./TranslationButton"

/**
 * Navigation bar item
 * @returns navigation bar item
 */
function NavBar({children}){
    const [isOpen, setIsOpen] = useState(false)
    const navigator = useNavigate()
    return(
        <div className="fixed w-full flex flex-row shadow-xl shadow-gray-500/30 top-0 z-20 bg-white">

            <div className="w-1/3 h-20 [clip-path:polygon(0%_0%,80%_0%,100%_100%,0%_100%)] overflow-hidden md:flex flex-row items-center content-center hidden">
                <img src={draw} alt="" height={50} width={80}/>
                <img src={word} alt="" height={20} width={200}/>
            </div>
            <div className="w-1/4 h-20 [clip-path:polygon(0%_0%,80%_0%,100%_100%,0%_100%)] overflow-hidden md:hidden flex-row items-center content-center flex">
                <img src={logo} alt="" className="size-18"/>
            </div>
            <div className="flex-1 h-20 bg-blue-200 [clip-path:polygon(5%_0%,100%_0%,100%_100%,0%_100%)] pl-[15%] md:flex flex-row items-center content-center hidden">
                <button className="mr-20 font-bold cursor-pointer text-blue-400">
                    Accueil
                </button>
                <button className="mr-20 font-bold cursor-pointer">
                    Fonctionnalites
                </button>
                <button className="mr-20 font-bold cursor-pointer">
                    Plan
                </button>
                <button className="mr-20 font-bold cursor-pointer text-red-700">
                    Se Connecter
                </button>
                <TranslationButton />
            </div>

            <div className="flex-1 h-20 bg-blue-200 [clip-path:polygon(5%_0%,100%_0%,100%_100%,0%_100%)] pl-[5%] flex flex-row items-center content-center md:hidden">
                <TranslationButton />
                <button className="ml-auto font-bold text-4xl border-2 border-gray-50/30 size-10 bg-white transition-all items-center justify-center text-blue-900 rounded-lg shadow-sm" onClick={()=>setIsOpen(!isOpen)}>
                    {isOpen ? "x" : "≡"}
                </button>
            </div>

            {/** Hamburger for mobile */}

            {isOpen && <div className="md:hidden absolute top-full left-0 w-full bg-blue-200 px-6 py-6 space-y-4 shadow-2xl">
                <button className="block py-1 border-b w-full text-left text-blue-400 font-bold border-black"
                    onClick={()=>{
                        setIsOpen(!isOpen)
                        navigator("/")
                    }}
                >
                    Accueil
                </button>
                <button className="block py-1 border-b w-full text-left font-bold">
                    Fonctionnalites
                </button>
                <button className="block py-1 border-b w-full text-left font-bold">
                    Plan
                </button>
                <button className="block py-1 border-b w-full text-left text-red-700 font-bold border-black">
                    Se Connecter
                </button>
            </div>}

        </div>
    )
}
export default NavBar