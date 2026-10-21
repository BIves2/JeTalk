import UserHeader from "./UserHeader"
import UserNavBar from "./UserNavBar"
import Footer from "./Footer"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { BarChart3, Loader2, ArrowLeft, CheckCircle } from "lucide-react"
import axios from "axios"
import API_URL from "./config/api"

function Statistics() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`${API_URL}/user/stats`, {
                    withCredentials: true
                })
                setStats(response.data)
            } catch (err) {
                console.error("Erreur lors de la récupération des statistiques", err)
                setError("Impossible de charger vos statistiques pour le moment.")
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    return (
        <div className="flex flex-col min-h-screen bg-blue-50">
            <UserHeader />
            <div className="flex flex-1 pt-20">
                <UserNavBar />
                <div className="p-6 w-full max-w-4xl mx-auto flex flex-col mb-16 md:mb-0">
                    <button 
                        onClick={() => navigate("/activities")}
                        className="flex items-center gap-2 text-blue-900 hover:text-blue-700 font-semibold mb-6 cursor-pointer w-fit"
                    >
                        <ArrowLeft className="size-5" />
                        <span>Retour aux activités</span>
                    </button>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Mes Statistiques</h1>
                        <p className="text-gray-600 mt-1">Visualisez votre progression sur JeTalk.</p>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-12">
                            <Loader2 className="size-10 animate-spin text-emerald-600 mb-2" />
                            <p className="text-gray-600 font-medium">Récupération de vos statistiques...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl text-center">
                            {error}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-200">
                            <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 text-center flex flex-col items-center">
                                <div className="p-4 bg-blue-100 text-blue-600 rounded-full mb-4">
                                    <CheckCircle className="size-10" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-500">Cours terminés</h3>
                                <p className="text-5xl font-black text-gray-800 mt-2">{stats?.coursTermines || 0}</p>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 text-center flex flex-col items-center">
                                <div className="p-4 bg-amber-100 text-amber-500 rounded-full mb-4">
                                    <span className="text-3xl font-bold">💎</span>
                                </div>
                                <h3 className="text-lg font-medium text-gray-500">Points accumulés</h3>
                                <p className="text-5xl font-black text-gray-800 mt-2">{stats?.points || 0}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Statistics
