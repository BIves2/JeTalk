import NavBar from "./NavBar"
import Footer from "./Footer"
import UserNavBar from "./UserNavBar"
import UserHeader from "./UserHeader"
import { useTranslation } from "react-i18next"
import { Repeat, Loader2 } from "lucide-react"
import { useState } from "react"
import translate from "./scripts/translation"

function TranslationSpace(){
    const {t} = useTranslation()
    const [toLang, setToLang] = useState("Anglais")
    const [output, setOutput] = useState("")
    const [input, setInput] = useState("")
    const [onTranslation, setOnTranslation] = useState(false)
    return(
        <div className="flex flex-col min-h-screen">
            <UserHeader/>
            <div className="flex flex-1 pt-20 bg-blue-200 flex-row">
                <UserNavBar />
                <div className="p-5 flex flex-col w-full">
                    <h1 className="text-2xl font-bold">{t("translationSpace.title")}</h1>
                    <p>{t("translationSpace.concept")}</p>
                    <div className="flex flex-row w-full justify-around h-2/3 mb-10">
                        <div className="w-2/5 h-full border m-5 rounded-3xl p-2 bg-linear-to-r from-blue-600 to-amber-200">
                            <h1 className="text-2xl m-2 font-bold">Expression (Francais)</h1>
                            <textarea name="toTrans" placeholder="Entrez le texte a traduire"
                                className="h-2/3 w-full rounded-3xl p-5 text-xl bg-white outline-0 resize-none"
                                onChange={(e)=>{
                                    setInput(e.target.value)
                                }}
                                value={input}
                            />
                        </div>
                        <div className="size-30 bg-green-200 m-5 rounded-4xl flex flex-col justify-center hover:shadow-2xl hover:shadow-gray shadow-xl"
                            onClick={()=>{
                                toLang==="Francais"?setToLang("Anglais"):setToLang("Francais")
                                setInput("")
                                setOutput("")
                            }}
                        >
                            <Repeat className="self-center hover:rotate-180 transition duration-500"/>
                            <h2 className="text-center">Inverser les langues</h2>
                        </div>
                        <div className="w-2/5 h-full border m-5 rounded-3xl p-2 bg-linear-to-r from-blue-600 to-amber-200 relative">
                            <h1 className="text-2xl m-2 font-bold">Traduction ({toLang})</h1>
                            <div className="w-full h-2/3 bg-white rounded-3xl p-5 text-xl overflow-auto flex items-start justify-start">
                                {onTranslation ? (
                                    <div className="flex items-center justify-center w-full h-full gap-2">
                                        <Loader2 className="size-8 animate-spin text-blue-600" />
                                        <span className="text-gray-500">Traduction en cours...</span>
                                    </div>
                                ) : (
                                    <p>{output}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <button className="border hover:text-black text-white font-bold rounded-4xl p-2 w-1/3 self-center bg-blue-700 hover:bg-blue-300 flex items-center justify-center gap-2"
                        onClick={async (e)=>{
                            e.preventDefault()
                            if(onTranslation){
                                return
                            }else{
                                setOnTranslation(true)
                                setOutput(await translate(input, toLang))
                                setOnTranslation(false)
                            }
                        }}
                    >
                        {onTranslation && <Loader2 className="size-4 animate-spin" />}
                        <span>Traduire</span>
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default TranslationSpace