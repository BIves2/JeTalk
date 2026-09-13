import draw from "../src/assets/JeTalkDraw.png"
import word from "../src/assets/JeTalkWords.png"
import logo from "../src/assets/JeTalkLogo.png"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import TranslationButton from "./TranslationButton"
import { useTranslation } from "react-i18next"
import { Search } from "lucide-react"
import ProfilItem from "./ProfilItem"
import { useInfos } from "./context/UserInfosContext"

/**
 * Navigation bar item
 * @returns navigation bar item
 */
function UserHeader({children}){
    const [isOpen, setIsOpen] = useState(false)
    const navigator = useNavigate()
    const {t} = useTranslation()
    const {name} = useInfos()
    
    return (
        <div className="fixed w-full h-20 flex flex-row shadow-xl shadow-gray-500/30 top-0 z-20 bg-white">
            <div className="w-1/3 h-20 [clip-path:polygon(0%_0%,80%_0%,100%_100%,0%_100%)] overflow-hidden md:flex flex-row items-center content-center hidden">
                <img src={draw} alt="HEADDRAW" height={50} width={80}/>
                <img src={word} alt="JETALK" height={20} width={200}/>
            </div>            
            <div className="w-1/4 h-20 [clip-path:polygon(0%_0%,80%_0%,100%_100%,0%_100%)] overflow-hidden md:hidden flex-row items-center content-center flex">
                <img src={logo} alt="JETALKLOGO" className="size-18"/>
            </div>            
            <div className="flex-1 h-20 pl-[4%] flex flex-row items-center content-center relative">                
                <div className="absolute inset-0 bg-blue-200 [clip-path:polygon(5%_0%,100%_0%,100%_100%,0%_100%)] z-0 pointer-events-none" />             
                <div className="w-2/3 flex flex-row relative z-10">
                    <input type="text" 
                        placeholder={t('userHeader.search')}
                        className="w-full border rounded-4xl mr-5 p-4 bg-amber-50"
                    />
                    <button className="absolute inset-y-0 right-5 flex items-center pr-3">
                        <Search />
                    </button>
                </div>
                
                <div className="flex flex-row items-center gap-4 z-10">
                    <ProfilItem name={name} />
                    <TranslationButton />
                </div>
            </div>
        </div>
    )
}
export default UserHeader
