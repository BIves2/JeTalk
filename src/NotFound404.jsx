import Footer from "./Footer"
import NavBar from "./NavBar"
import { useTranslation } from "react-i18next"

/**
 * Page returned when a page is not finded by the render server
 * @returns page of 404 error
 */
function NotFound404(){
    const {t} = useTranslation()
    return (
        <div className="pt-30">
            <NavBar />
            <h1>{t("notFound404.title")}</h1>
            <Footer />
        </div>
    )
}
export default NotFound404