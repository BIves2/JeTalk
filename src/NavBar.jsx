import draw from "../src/assets/JeTalkDraw.png"
import word from "../src/assets/JeTalkWords.png"
import logo from "../src/assets/JeTalkLogo.png"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import TranslationButton from "./TranslationButton"
import { useTranslation } from "react-i18next"

/**
 * Navigation bar item
 * @returns navigation bar item
 */
function NavBar({children}){
    const [isOpen, setIsOpen] = useState(false)
    const navigator = useNavigate()
    const {t} = useTranslation()
    return(
        <div className="fixed w-full flex flex-row shadow-xl shadow-gray-500/30 top-0 z-20 bg-white">

            <div className="w-1/3 h-20 [clip-path:polygon(0%_0%,80%_0%,100%_100%,0%_100%)] overflow-hidden md:flex flex-row items-center content-center hidden">
                <img src={draw} alt="HEADDRAW" height={50} width={80}/>
                <img src={word} alt="JETALK" height={20} width={200}/>
            </div>
            <div className="w-1/4 h-20 [clip-path:polygon(0%_0%,80%_0%,100%_100%,0%_100%)] overflow-hidden md:hidden flex-row items-center content-center flex">
                <img src={logo} alt="JETALKLOGO" className="size-18"/>
            </div>
            <div className="flex-1 h-20 bg-blue-200 [clip-path:polygon(5%_0%,100%_0%,100%_100%,0%_100%)] pl-[10%] md:flex flex-row items-center content-center hidden">
                <Link to="/" className="mr-20 font-bold cursor-pointer text-blue-400"
                     onClick={()=>{
                        setIsOpen(!isOpen)
                    }}
                >
                    {t("navBar.home")}
                </Link>
                <Link className="mr-20 font-bold cursor-pointer">
                    {t("navBar.features")}
                </Link>
                <Link className="mr-20 font-bold cursor-pointer">
                    {t("navBar.plans")}
                </Link>
                <Link to="/login" className="mr-20 font-bold cursor-pointer text-red-700">
                    {t("navBar.login")}
                </Link>
                <TranslationButton />
            </div>

            <div className="flex-1 h-20 bg-blue-200 [clip-path:polygon(5%_0%,100%_0%,100%_100%,0%_100%)] pl-[5%] flex flex-row items-center content-center md:hidden">
                <TranslationButton />
                <Link className="ml-auto font-bold text-4xl border-2 border-gray-50/30 size-10 bg-white transition-all items-center justify-center text-blue-900 rounded-lg shadow-sm" onClick={()=>setIsOpen(!isOpen)}>
                    {isOpen ? "x" : "≡"}
                </Link>
            </div>

            {/** Hamburger for mobile */}

            {isOpen && <div className="md:hidden absolute top-full left-0 w-full bg-blue-200 px-6 py-6 space-y-4 shadow-2xl">
                <Link className="block py-1 border-b w-full text-left text-blue-400 font-bold border-black"
                    onClick={()=>{
                        setIsOpen(!isOpen)
                        navigator("/")
                    }}
                >
                    {t("navBar.home")}
                </Link>
                <Link className="block py-1 border-b w-full text-left font-bold">
                    {t("navBar.features")}
                </Link>
                <Link className="block py-1 border-b w-full text-left font-bold">
                    {t("navBar.plans")}
                </Link>
                <Link className="block py-1 border-b w-full text-left text-red-700 font-bold border-black"
                    to="/login"
                >
                    {t("navBar.login")}
                </Link>
            </div>}

        </div>
    )
}
export default NavBar