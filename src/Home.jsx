import NavBar from "./NavBar"
import draw from "../src/assets/JeTalkDraw.png"
import flag from "../src/assets/flag.png"
import ai from "../src/assets/ai.png"
import learning from "../src/assets/learning.png"
import Footer from "./Footer"
import { Link } from "react-router-dom"
import { Trans, useTranslation } from "react-i18next"

/**
 * Reception area for those not connected
 * @returns home space
 */
function Home(){
    const {t} = useTranslation()
    return(
        <div className="pt-20 flex flex-col min-h-screen bg-blue-50">
            <NavBar />

            {/* Hero */}
            <div className="flex flex-col md:flex-row bg-blue-200 items-center px-6 md:px-10 py-10 gap-8">
                <div className="flex flex-col md:w-1/2 gap-5">
                    <h1 className="text-3xl md:text-4xl font-bold text-blue-950 leading-snug">
                        <Trans
                            i18nKey={"homePage.bigMsg"}
                            components={{1: <span className="text-amber-500"/>}}
                        />
                    </h1>
                    <p className="text-blue-900/70 text-sm md:text-base leading-relaxed">
                        <Trans
                            i18nKey={"homePage.presentation"}
                            components={{1: <span className="font-semibold text-blue-950"/>}}
                        />
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            to="/signup"
                            className="text-center cursor-pointer rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 transition-colors"
                        >
                            {t("homePage.buttons.signup")}
                        </Link>
                        <Link
                            to="/features"
                            className="text-center cursor-pointer rounded-2xl bg-white hover:bg-blue-50 text-blue-700 font-semibold py-3 px-6 border border-blue-200 transition-colors"
                        >
                            {t("homePage.buttons.catalog")}
                        </Link>
                    </div>
                </div>
                <img
                    src={draw}
                    alt="JeTalk"
                    className="md:w-1/2 w-full max-w-sm rounded-2xl shadow-lg"
                />
            </div>

            {/* Features */}
            <div id="features" className="flex flex-col md:flex-row justify-around items-stretch gap-6 px-6 md:px-10 py-10 flex-1">
                <div className="flex flex-row md:flex-col bg-white rounded-2xl shadow-md p-5 gap-4 items-start md:items-center md:w-1/3 hover:shadow-lg transition-shadow">
                    <img src={flag} alt="Cameroun" className="size-12 rounded-full object-cover shrink-0"/>
                    <div>
                        <strong className="text-blue-950 text-sm">{t("homePage.cards.cmr.title")}</strong>
                        <p className="text-slate-600 text-xs mt-1 leading-relaxed">{t("homePage.cards.cmr.content")}</p>
                    </div>
                </div>

                <div className="flex flex-row md:flex-col bg-white rounded-2xl shadow-md p-5 gap-4 items-start md:items-center md:w-1/3 hover:shadow-lg transition-shadow">
                    <img src={ai} alt="IA" className="size-12 rounded-full object-cover shrink-0"/>
                    <div>
                        <strong className="text-blue-950 text-sm">{t("homePage.cards.ai.title")}</strong>
                        <p className="text-slate-600 text-xs mt-1 leading-relaxed">{t("homePage.cards.ai.content")}</p>
                    </div>
                </div>

                <div className="flex flex-row md:flex-col bg-white rounded-2xl shadow-md p-5 gap-4 items-start md:items-center md:w-1/3 hover:shadow-lg transition-shadow">
                    <img src={learning} alt="Apprentissage" className="size-12 rounded-full object-cover shrink-0"/>
                    <div>
                        <strong className="text-blue-950 text-sm">{t("homePage.cards.learning.title")}</strong>
                        <p className="text-slate-600 text-xs mt-1 leading-relaxed">{t("homePage.cards.learning.content")}</p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
export default Home
