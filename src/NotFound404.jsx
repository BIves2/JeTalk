import Footer from "./Footer"
import NavBar from "./NavBar"
/**
 * Page returned when a page is not finded by the render server
 * @returns page of 404 error
 */
function NotFound404(){
    return (
        <div className="pt-30">
            <NavBar />
            <h1>404 Erreur : Page introuvable</h1>
            <Footer />
        </div>
    )
}
export default NotFound404