import { Link } from "react-router-dom"
import logo from "../src/assets/JeTalkLogo.png"
import { useTranslation } from "react-i18next"
function Footer(){
    const {t} = useTranslation()
    return (
        <div>
            <div className="w-full bg-gray-400/20 flex flex-col md:flex-row">
                <div className="flex flex-col w-80 md:w-1/4 p-5">
                    <img src={logo} alt="JETALKLOGO" className="size-10"/>
                    <p className="text-sm">{t("footer.slogan")}</p>

                </div>

                <div className="flex flex-col w-80 md:w-1/4 p-5">
                    <strong>{t("footer.legalTitle")}</strong>
                    <Link to="/terms" className="self-start hover:text-blue-600 transition-colors">{t("footer.termsOfUse")}</Link>
                    <Link to="/privacy" className="self-start hover:text-blue-600 transition-colors">{t("footer.privacyPolicy")}</Link>
                    <Link to="/about" className="self-start hover:text-blue-600 transition-colors">{t("footer.aboutUs")}</Link>
                </div>

                <div className="flex flex-col w-80 md:w-1/4 p-5">
                    <strong>{t("footer.contactUs")}</strong>
                    <a href="mailto:ivesdebanta@gmail.com" className="self-start hover:text-blue-600 transition-colors">ivesdebanta@gmail.com</a>
                    <p className="self-start">{t("footer.location")}</p>
                    <Link to="/about" className="self-start hover:text-blue-600 transition-colors">{t("footer.aboutUs")}</Link>
                </div>
                <div className="flex flex-col w-80 md:w-1/4 p-5">
                    <strong>{t("footer.usefulLinks")}</strong>
                </div>
            </div>
            <p className="border-t-gray-500/40 bg-gray-400/20 border-t text-center">{t("footer.copyright")}</p>
        </div>
    )
}
export default Footer