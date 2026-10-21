import NavBar from "./NavBar"
import Footer from "./Footer"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
    BookOpen,
    MessageCircle,
    Languages,
    BarChart3,
    Mic,
    Brain,
    Award,
    Clock,
    Target,
    Headphones,
    Sparkles,
    ShieldCheck,
    Zap
} from "lucide-react"

function FeaturesPage() {
    const { t } = useTranslation()

    const features = [
        {
            icon: <BookOpen className="size-6" />,
            color: "bg-blue-100 text-blue-700",
            title: "Cours structurés",
            description: "Des leçons progressives adaptées à votre niveau, conçues par des enseignants spécialistes du bilinguisme camerounais."
        },
        {
            icon: <MessageCircle className="size-6" />,
            color: "bg-indigo-100 text-indigo-700",
            title: "Discussion guidée IA",
            description: "Échangez avec notre assistant intelligent sur des sujets variés et recevez une analyse détaillée de vos performances."
        },
        {
            icon: <Mic className="size-6" />,
            color: "bg-emerald-100 text-emerald-700",
            title: "Reconnaissance vocale",
            description: "Parlez naturellement et laissez l'IA comprendre vos intentions même avec des erreurs de transcription."
        },
        {
            icon: <Languages className="size-6" />,
            color: "bg-amber-100 text-amber-700",
            title: "Traduction intelligente",
            description: "Des traductions instantanées et naturelles entre le français et l'anglais, alimentées par l'IA."
        },
        {
            icon: <BarChart3 className="size-6" />,
            color: "bg-emerald-100 text-emerald-700",
            title: "Suivi de progression",
            description: "Visualisez vos points, vos cours terminés et l'évolution de vos compétences au fil du temps."
        },
        {
            icon: <Brain className="size-6" />,
            color: "bg-purple-100 text-purple-700",
            title: "Analyse IA détaillée",
            description: "Recevez des observations précises sur votre fluidité, votre grammaire et votre vocabulaire après chaque discussion."
        },
        {
            icon: <Award className="size-6" />,
            color: "bg-amber-100 text-amber-700",
            title: "Scores et évaluations",
            description: "Obtenez une note globale après chaque session et mesurez vos progrès objectivement."
        },
        {
            icon: <Clock className="size-6" />,
            color: "bg-blue-100 text-blue-700",
            title: "Sessions chronométrées",
            description: "Choisissez la durée de vos discussions (5 à 30 minutes) pour pratiquer de manière ciblée."
        },
        {
            icon: <Target className="size-6" />,
            color: "bg-red-100 text-red-700",
            title: "Sujets personnalisés",
            description: "Concentrez-vous sur les sujets qui vous intéressent : cuisine, voyages, technologie, culture..."
        },
        {
            icon: <Headphones className="size-6" />,
            color: "bg-cyan-100 text-cyan-700",
            title: "Synthèse vocale naturelle",
            description: "Écoutez les réponses de l'IA avec des voix claires et naturelles adaptées à votre niveau."
        },
        {
            icon: <Sparkles className="size-6" />,
            color: "bg-indigo-100 text-indigo-700",
            title: "Mode hors-ligne",
            description: "Continuez à apprendre même sans connexion grâce à notre modèle IA local intégré."
        },
        {
            icon: <ShieldCheck className="size-6" />,
            color: "bg-green-100 text-green-700",
            title: "Sécurité des données",
            description: "Vos conversations et données personnelles sont protégées et stockées en toute sécurité."
        }
    ]

    return (
        <div className="pt-20 flex flex-col min-h-screen bg-blue-50">
            <NavBar />

            {/* Header */}
            <div className="bg-blue-200 px-6 md:px-10 py-10">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 text-blue-800 text-xs font-semibold mb-4">
                        <Zap className="size-3.5" />
                        <span>Fonctionnalités</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-blue-950 mb-3">
                        Tout ce que JeTalk vous offre
                    </h1>
                    <p className="text-blue-900/70 text-sm md:text-base leading-relaxed max-w-2xl">
                        Découvrez l'ensemble des outils et fonctionnalités conçus pour vous aider à maîtriser le français et l'anglais de manière efficace et personnalisée.
                    </p>
                </div>
            </div>

            {/* Features Grid */}
            <div className="flex-1 px-6 md:px-10 py-10">
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold text-blue-950 mb-2">{feature.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="px-6 md:px-10 pb-10">
                <div className="max-w-4xl mx-auto bg-blue-200 rounded-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-blue-950 mb-2">
                        Prêt à commencer ?
                    </h2>
                    <p className="text-blue-900/70 text-sm mb-5">
                        Créez votre compte gratuitement et commencez votre parcours d'apprentissage dès maintenant.
                    </p>
                    <Link
                        to="/signup"
                        className="inline-block cursor-pointer rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 transition-colors"
                    >
                        S'inscrire maintenant
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default FeaturesPage
