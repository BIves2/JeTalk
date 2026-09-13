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
            <div className="flex flex-1 pt-20 bg-blue-200">
                <UserNavBar />
                <div className="p-5 w-1/3">
                    <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
                    <h2 className="text-2xl">
                        <Trans 
                            i18nKey={"dashboard.welcomeMsg"}
                            values={{name: name}}
                            components={{1: <strong className="text-green-600"/>}}
                        />
                    </h2>
                    <p>Votre niveau actuel : {level} (niveau 1/4)</p>
                    <progress className="rounded-full w-full h-3 overflow-hidden [&::-webkit-progress-bar]:bg-white [&::-webkit-progress-value]:bg-green-600"
                        value={25}
                        max={100}
                    />
                    <div className="mt-10 rounded-2xl shadow-xl p-5 border border-gray-400">
                        <h1 className="text-2xl font-bold">
                            {t("dashboard.runCard.title")}
                        </h1>
                        <p className="mb-5 mt-5">
                            <Trans 
                                i18nKey={"dashboard.runCard.concept"}
                                values={{name: name}}
                                components={{1: <strong />}}
                            />
                        </p>
                        <Link
                            className="bg-blue-900 text-white p-2 rounded-2xl"
                        >
                            Suivre un cours
                        </Link>
                    </div>
                </div>
                <div className="w-2/3 p-5 border border-gray-400 shadow-2xl m-5 rounded-3xl bg-linear-to-r from-blue-600 to-amber-200">
                    <h1 className="text-2xl text-center font-bold">{t("dashboard.conversationCard.title")}</h1>
                    <div className="p-2 flex flex-row justify-around items-center">
                        <img src={robot} alt="" className="size-40"/>
                        <Mic className="bg-blue-500 size-20 rounded-full p-2 hover:animate-pulse hover:bg-red-600 transition-all text-white shadow-2xl shadow-black"/>
                        <img src={human} alt="" className="size-40"/>
                    </div>
                    <span className="flex flex-row justify-center"><Activity className="h-20 w-40"/></span>
                    <p className="text-center m-5">{t("dashboard.conversationCard.concept")}</p>
                    <div className="flex flex-row justify-around">
                        <Link
                            className="bg-blue-900 text-white p-5 rounded-4xl"
                        >
                            {t("dashboard.conversationCard.audioButton")}
                        </Link>
                        <Link
                            className="bg-yellow-600 text-white p-5 rounded-4xl"
                        >
                            {t("dashboard.conversationCard.chatButton")}
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Dashboard