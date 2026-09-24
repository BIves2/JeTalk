import UserHeader from "./UserHeader"
import UserNavBar from "./UserNavBar"
import Footer from "./Footer"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { BookOpen, CheckCircle, ArrowRight, Loader2, ArrowLeft } from "lucide-react"
import axios from "axios"
import { useInfos } from "./context/UserInfosContext"

function CoursesList() {
    const { t } = useTranslation()
    const { id } = useInfos()
    const navigate = useNavigate()
    
    const [lessons, setLessons] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Étape 2 & 3: Requête au SGBD pour récupérer les leçons disponibles
    useEffect(() => {
        const fetchLessons = async () => {
            if (!id) return
            try {
                setLoading(true)
                const response = await axios.get(`http://localhost:5000/lessons?id=${id}`, {
                    withCredentials: true
                })
                // Étape 4: Le système reçoit les cours disponibles
                setLessons(response.data)
            } catch (err) {
                console.error("Erreur lors de la récupération des leçons", err)
                setError("Impossible de charger les leçons pour le moment.")
            } finally {
                setLoading(false)
            }
        }
        fetchLessons()
    }, [id])

    return (
        <div className="flex flex-col min-h-screen bg-blue-50">
            <UserHeader />
            <div className="flex flex-1 pt-20">
                <UserNavBar />
                <div className="p-6 w-full max-w-6xl mx-auto flex flex-col mb-16 md:mb-0">
                    <button 
                        onClick={() => navigate("/activities")}
                        className="flex items-center gap-2 text-blue-900 hover:text-blue-700 font-semibold mb-6 cursor-pointer w-fit"
                    >
                        <ArrowLeft className="size-5" />
                        <span>Retour aux activités</span>
                    </button>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Catalogue des cours</h1>
                        <p className="text-gray-600 mt-1">Sélectionnez une leçon et développez vos compétences dès aujourd'hui.</p>
                    </div>

                    {/* Étape 4: Affichage de la liste des cours */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-12">
                            <Loader2 className="size-10 animate-spin text-blue-600 mb-2" />
                            <p className="text-gray-600 font-medium">Chargement de vos leçons...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl text-center">
                            {error}
                        </div>
                    ) : lessons.length === 0 ? (
                        <div className="bg-white p-8 rounded-3xl shadow-sm text-center border border-gray-200">
                            <BookOpen className="size-12 mx-auto text-blue-400 mb-3" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-1">Aucune leçon disponible</h3>
                            <p className="text-gray-500">Revenez plus tard ou vérifiez votre niveau dans votre profil.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {lessons.map((lesson) => {
                                const isCompleted = lesson.progressions && lesson.progressions.some(p => p.termine)
                                return (
                                    <div 
                                        key={lesson.id} 
                                        className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                                                    {lesson.niveau}
                                                </span>
                                                {isCompleted && (
                                                    <span className="flex items-center text-green-600 text-xs font-semibold gap-1">
                                                        <CheckCircle className="size-4" /> Complété
                                                    </span>
                                                )}
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-800 mb-2">{lesson.titre}</h2>
                                            <p className="text-gray-600 text-sm line-clamp-3 mb-6">{lesson.description}</p>
                                        </div>

                                        {/* Étape 1 & 5: Bouton pour démarrer / sélectionner un cours */}
                                        <button
                                            onClick={() => navigate(`/lesson/${lesson.id}`, { state: { lesson } })}
                                            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition duration-200 cursor-pointer"
                                        >
                                            <span>{isCompleted ? "Revoir la leçon" : "Démarrer la leçon"}</span>
                                            <ArrowRight className="size-4" />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default CoursesList
