import NavBar from "./NavBar"
import Footer from "./Footer"
import UserNavBar from "./UserNavBar"
import UserHeader from "./UserHeader"
import { Trans, useTranslation } from "react-i18next"
import { useInfos } from "./context/UserInfosContext"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Mic, Activity } from "lucide-react"
import human from "../src/assets/human.png"
import robot from "..//src/assets/robot.png"

function Dashboard(){
    const {t} = useTranslation()
    const {name} = useInfos()
    const [level, setLevel] = useState("Amateur")
    return(
        <div className="flex flex-col min-h-screen">
            <UserHeader/>
            <div className="flex flex-col lg:flex-row flex-1 pt-20 bg-blue-200">
                <UserNavBar />

                {/* Contenu principal */}
                <div className="flex flex-col md:flex-row flex-1 p-4 md:p-6 gap-6 mb-16 md:mb-0">
                    {/* Colonne de gauche (Profil, Progression, Cours) */}
                    <div className="w-full md:w-5/12 lg:w-1/3 flex flex-col gap-6">
                        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20">
                            <h1 className="text-2xl font-bold text-gray-800">{t("dashboard.title")}</h1>
                            <h2 className="text-xl text-gray-700 mt-2">
                                <Trans
                            i18nKey={"dashboard.welcomeMsg"}
                            values={{name: name}}
                            components={{1: <strong className="text-green-600"/>}}
                        />
                    </h2>

                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-600">Votre niveau actuel : {level} (niveau 1/4)</p>
                                <progress className="rounded-full w-full h-3 mt-2 overflow-hidden [&::-webkit-progress-bar]:bg-white/50 [&::-webkit-progress-value]:bg-green-600 border border-gray-100"
                        value={25}
                        max={100}
                    />
                            </div>
                        </div>

                        <div className="bg-white/90 rounded-3xl shadow-xl p-6 border border-gray-100 flex flex-col justify-between flex-1">
                            <div>
                                <h1 className="text-2xl font-bold text-blue-900">
                                    {t("dashboard.runCard.title")}
                                </h1>
                                <p className="my-4 text-gray-600 leading-relaxed">
                                    <Trans
                                        i18nKey={"dashboard.runCard.concept"}
                                        values={{name: name}}
                                        components={{1: <strong className="text-blue-950" />}}
                            />
                        </p>
                            </div>
                            <Link
                                to="/activities"
                                className="bg-blue-900 hover:bg-blue-850 text-white font-bold py-3 px-6 rounded-2xl text-center inline-block transition duration-200 mt-4 cursor-pointer"
                        >
                            Suivre un cours
                        </Link>
                    </div>
                </div>

                    {/* Colonne de droite (Discussion Guidée) */}
                    <div className="w-full md:w-7/12 lg:w-2/3 p-6 md:p-8 border border-white/20 shadow-2xl rounded-3xl bg-linear-to-r from-blue-600 to-amber-200 flex flex-col justify-between text-white">
                        <div>
                            <h1 className="text-2xl md:text-3xl text-center font-bold">{t("dashboard.conversationCard.title")}</h1>

                            {/* Zone Avatar/Micro interactive et adaptative */}
                            <div className="py-8 flex flex-row justify-around items-center gap-4">
                                <img src={robot} alt="Robot Avatar" className="size-24 sm:size-32 md:size-40 object-contain drop-shadow-xl"/>
                                <Link to="/conversation" className="cursor-pointer">
                                    <Mic className="bg-blue-500 size-16 sm:size-20 rounded-full p-4 hover:scale-110 hover:bg-red-600 transition-all text-white shadow-2xl shadow-black/50 active:scale-95"/>
                                </Link>
                                <img src={human} alt="Human Avatar" className="size-24 sm:size-32 md:size-40 object-contain drop-shadow-xl"/>
                            </div>

                            <span className="flex flex-row justify-center"><Activity className="h-16 w-32 md:h-20 md:w-40 text-blue-100 opacity-80"/></span>
                            <p className="text-center text-sm md:text-base max-w-xl mx-auto my-6 leading-relaxed text-blue-50">{t("dashboard.conversationCard.concept")}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-around gap-4 mt-4">
                            <Link
                                to="/conversation"
                                className="bg-blue-900 hover:bg-blue-950 text-white py-3.5 px-6 rounded-3xl font-bold text-center transition duration-200 shadow-md flex-1 cursor-pointer"
                            >
                                Lancer une discussion
                            </Link>
                        </div>
                    </div>
        </div>
            </div>
            <Footer />
        </div>
    )
}

export default Dashboard