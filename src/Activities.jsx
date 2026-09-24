import UserHeader from "./UserHeader"
import UserNavBar from "./UserNavBar"
import Footer from "./Footer"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { BookOpen, BarChart3, ArrowRight } from "lucide-react"

function Activities() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <div className="flex flex-col min-h-screen bg-blue-50">
            <UserHeader />
            <div className="flex flex-1 pt-20">
                <UserNavBar />
                <div className="p-6 w-full max-w-5xl mx-auto flex flex-col mb-16 md:mb-0">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Mes Activités</h1>
                        <p className="text-gray-600 mt-1">Choisissez une activité pour progresser ou évaluer vos résultats.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Option 1 : Suivre un cours */}
                        <div 
                            onClick={() => navigate("/activities/courses")}
                            className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between cursor-pointer group"
                        >
                            <div>
                                <div className="w-14 h-14 bg-blue-100 text-blue-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <BookOpen className="size-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-3">Suivre un cours</h2>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Accédez aux leçons adaptées à votre niveau et à votre langue d'apprentissage, et validez vos acquis étape par étape.
                                </p>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    navigate("/activities/courses")
                                }}
                                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition duration-200 cursor-pointer"
                            >
                                <span>Démarrer une leçon</span>
                                <ArrowRight className="size-5" />
                            </button>
                        </div>

                        {/* Option 2 : Consulter ses statistiques */}
                        <div 
                            onClick={() => navigate("/activities/statistics")}
                            className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between cursor-pointer group"
                        >
                            <div>
                                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <BarChart3 className="size-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-3">Consulter ses statistiques</h2>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Suivez l'évolution de vos points d'apprentissage, vos cours validés et vos performances globales.
                                </p>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    navigate("/activities/statistics")
                                }}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition duration-200 cursor-pointer"
                            >
                                <span>Voir mes statistiques</span>
                                <ArrowRight className="size-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Activities
