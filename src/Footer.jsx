import { Link } from "react-router-dom"
import logo from "../src/assets/JeTalkLogo.png"
function Footer(){
    return (
        <div>
            <div className="w-full bg-gray-400/20 flex flex-col md:flex-row">
                <div className="flex flex-col w-80 md:w-1/4 p-5">
                    <img src={logo} alt="JETALKLOGO" className="size-10"/>
                    <p className="text-sm">Votre assistant conversationnel intelligent pour maitriser les langues francaise et anglaise.</p>

                </div>

                <div className="flex flex-col w-80 md:w-1/4 p-5">
                    <strong>Legal</strong>
                    <Link className="self-start">Conditions d'utilisation</Link>
                    <Link className="self-start">Politique de confidentialite</Link>
                    <Link className="self-start">A propos</Link>
                </div>

                <div className="flex flex-col w-80 md:w-1/4 p-5">
                    <strong>Contactez-nous</strong>
                    <Link className="self-start">ivesdebanta@gmail.com</Link>
                    <Link className="self-start">Yaounde, Cameroun</Link>
                    <Link className="self-start">A propos</Link>
                </div>
                <div className="flex flex-col w-80 md:w-1/4 p-5">
                    <strong>Liens utiles</strong>
                </div>
            </div>
            <p className="border-t-gray-500/40 bg-gray-400/20 border-t text-center">© 2026 JeTalk. All Rights reserved</p>
        </div>
    )
}
export default Footer