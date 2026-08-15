import NavBar from "./NavBar"
import draw from "../src/assets/JeTalkDraw.png"

/**
 * 
 * @returns 
 */
function Home(){
    return(
        <div className="pt-22 ">
            <NavBar />

            <div className="flex flex-col ">
                <div className="flex flex-row pb-10 bg-blue-200">
                    <div className="flex flex-col m-10 mr-30 w-1/2">
                        <h1 className="text-5xl">
                            Maitrisez le <span className="text-amber-500">Francais</span> et l'<span className="text-amber-500">Anglais <br/></span> comme jamais au paravant !
                        </h1>
                        <p className="mt-5">
                            <span className="font-bold">JeTalk:</span> Votre assistant conversationnel intelligent pour maitriser les langues francaise et anglaise.  
                        </p>
                        <button className="cursor-pointer self-start mt-10 rounded-4xl bg-amber-500 p-3 w-100 font-bold text-lg text-white">
                            Catalogue de Fonctionnalites
                        </button>
                        <button className="cursor-pointer self-start mt-5 rounded-4xl bg-blue-600 p-3 w-60 font-bold text-lg text-white">
                            S'inscrire maintenant
                        </button>
                    </div>
                    <img src={draw} alt="" className="border-2 border-white shadow-2xl shadow-black rounded-full ml-auto mr-60 w-110 h-100"/>
                </div>
                <div className="flex flex-row justify-around mt-[-20px]">
                    <div className="h-30 w-1/4 rounded-lg bg-white"></div>
                    <div className="h-30 w-1/4 bg-white rounded-lg"></div>
                    <div className="h-30 w-1/4 bg-white rounded-lg"></div>
                </div>
            </div>

        </div>
    )
}
export default Home