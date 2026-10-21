import UserHeader from "./UserHeader"
import UserNavBar from "./UserNavBar"
import Footer from "./Footer"
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import axios from "axios"
import API_URL from "./config/api"
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react"

function LessonSpace() {
    const { t } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    const lesson = location.state?.lesson

    const [finishing, setFinishing] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")

    if (!lesson) {
        return (
            <div className="flex flex-col min-h-screen bg-blue-50">
                <UserHeader />
                <div className="flex flex-1 pt-20">
                    <UserNavBar />
                    <div className="p-6 w-full text-center">
                        <p className="text-red-600 font-bold">Leçon introuvable ou non sélectionnée.</p>
                        <button 
                            onClick={() => navigate("/activities")}
                            className="mt-4 bg-blue-900 text-white px-4 py-2 rounded-2xl cursor-pointer"
                        >
                            Retour aux leçons
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    // Étape 7 & 8: Finir le cours et envoyer la requête au SGBD
    const handleFinishLesson = async () => {
        try {
            setFinishing(true)
            await axios.post(`${API_URL}/lessons/complete`, {
                id_cours: lesson.id
            }, {
                withCredentials: true
            })
            
            setSuccessMessage("Félicitations ! Votre progression a été enregistrée avec succès.")
            
            // Étape 10: Ramener l'utilisateur sur la page de choix de cours après 2 secondes
            setTimeout(() => {
                navigate("/activities/courses")
            }, 2000)
        } catch (error) {
            console.error("Erreur lors de l'enregistrement de la leçon", error)
            alert("Une erreur est survenue lors de l'enregistrement de votre progression.")
        } finally {
            setFinishing(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-blue-50">
            <UserHeader />
            <div className="flex flex-1 pt-20">
                <UserNavBar />
                <div className="p-6 w-full max-w-4xl mx-auto">
                    <button 
                        onClick={() => navigate("/activities/courses")}
                        className="flex items-center gap-2 text-blue-900 hover:text-blue-700 font-semibold mb-6 cursor-pointer"
                    >
                        <ArrowLeft className="size-5" />
                        <span>Retour aux cours</span>
                    </button>

                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                                {lesson.niveau}
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{lesson.titre}</h1>
                        <p className="text-gray-500 italic mb-6">{lesson.description}</p>
                        
                        <hr className="border-gray-200 mb-6" />

                        {/* Étape 6: Affichage de l'espace de cours */}
                        <div className="prose max-w-none text-gray-700 text-lg leading-relaxed mb-8 whitespace-pre-line bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            {lesson.contenu}
                        </div>

                        {successMessage && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-2xl mb-6 text-center font-medium flex items-center justify-center gap-2 animate-bounce">
                                <CheckCircle className="size-5" />
                                {successMessage}
                            </div>
                        )}

                        {/* Étape 7: Bouton "Terminer la leçon" */}
                        <button
                            onClick={handleFinishLesson}
                            disabled={finishing || successMessage !== ""}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition duration-200 cursor-pointer disabled:opacity-50"
                        >
                            {finishing ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" />
                                    <span>Enregistrement de la progression...</span>
                                </>
                            ) : (
                                <span>Terminer la leçon</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default LessonSpace
