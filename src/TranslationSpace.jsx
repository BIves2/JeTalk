import NavBar from "./NavBar"
import Footer from "./Footer"
import UserNavBar from "./UserNavBar"
import UserHeader from "./UserHeader"
import { useTranslation } from "react-i18next"

function TranslationSpace(){
    const {t} = useTranslation()
    return(
        <div className="flex flex-col min-h-screen">
            <UserHeader/>
            <div className="flex flex-1 pt-20 bg-blue-200 flex-row">
                <UserNavBar />
                <div className="p-5">
                    <h1 className="text-2xl font-bold">{t("translationSpace.title")}</h1>
                    <p>{t("translationSpace.concept")}</p>
                </div>
                <div className="border w-full">

                </div>
            </div>
            <Footer />
        </div>
    )
}
export default TranslationSpace