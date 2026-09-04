import NavBar from "./NavBar"
import draw from "../src/assets/JeTalkDraw.png"
import flag from "../src/assets/flag.png"
import ai from "../src/assets/ai.png"
import learning from "../src/assets/learning.png"
import Footer from "./Footer"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

/**
 * Reception area for those not connected
 * @returns home space
 */
function Home(){
    const {t} = useTranslation()
    return(
        <div className="pt-20 ">
            <NavBar />

            <div className="flex flex-col">
                <div className="flex md:flex-row pb-10 bg-blue-200 flex-col md:pl-10">
                    <div className="flex flex-col md:mr-30 md:w-250 w-full md:ml-5">
                        <h1 className="text-5xl md:mr-10 mr-5 mb-5 md:5">
                           {t('master')} le <span className="text-amber-500">Francais</span> et l'<span className="text-amber-500">Anglais <br/></span> comme jamais auparavant !
                        </h1>
                        <img src={draw} alt="HEADDRAW" className="md:hidden border-2 border-white shadow-2xl shadow-black rounded-full mb-10 w-60 h-50 self-center"/>
                        <p className="md:mt-5 mt">
                            <span className="font-bold">JeTalk:</span> Votre assistant conversationnel intelligent pour maitriser les langues francaise et anglaise.  
                        </p>
                        <Link className="text-center cursor-pointer self-center md:self-start mt-10 rounded-4xl bg-amber-500 p-3 w-80 md:w-100 font-bold text-lg text-white">
                            Catalogue de Fonctionnalités
                        </Link>
                        <Link to="/signup" className="text-center cursor-pointer self-center md:self-start mt-5 rounded-4xl bg-blue-600 p-3 w-80 md:w-60 font-bold text-lg text-white">
                            S'inscrire maintenant
                        </Link>
                    </div>
                    <img src={draw} alt="HEADDRAW" className="hidden md:flex border-2 border-white shadow-2xl shadow-black rounded-full ml-auto mr-60 w-110 h-100"/>
                </div>
                <div className="flex flex-col md:flex-row justify-around mt-[-20px] items-center">
                    <div className="h-60 w-80 md:w-1/4 rounded-lg bg-white shadow-2xl mb-10 flex flex-row p-2">
                        <img src={flag} alt="CAMEROONFLAG" className="size-20"/>
                        <div>
                            <strong>Intégrez le bilinguisme National</strong>
                            <p className="p-2 w-full">Participez activemnt au bilinguisme national et devenez un patriote camerounais a part entiere en maitrisant les deux langues et cultures camerounaises officielles</p>
                        </div>
                    </div>
                    <div className="h-60 w-80 md:w-1/4 bg-white rounded-lg shadow-2xl mb-10 flex flex-row p-2">
                        <img src={ai} alt="AI" className="size-20 rounded-full"/>
                        <div>
                            <strong>L'IA au coeur de l'apprentissage</strong>
                            <p className="p-2 w-full">Profitez d'une experience completement enrichie avec l'intelligence artificielle au coeur de la production des contenus, une experience unique et inedite</p>
                        </div>
                    </div>
                    <div className="h-60 w-80 md:w-1/4 bg-white rounded-lg shadow-2xl mb-10 flex flex-row p-2">
                        <img src={learning} alt="LEARNING" className="size-20"/>
                        <div>
                            <strong>Apprentissage personnalisé</strong>
                            <p className="p-2 w-full">Votre apprentissage entierement adapte a vos besoins et a votre rythme, tout en respectant vos exigeances et vos disponibilites</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default Home