import NavBar from "./NavBar"
import Footer from "./Footer"
import { useTranslation } from "react-i18next"
import { Info, MapPin, Mail, Globe } from "lucide-react"
import logo from "../src/assets/JeTalkLogo.png"

function About() {
    const { t } = useTranslation()

    return (
        <div className="pt-20 flex flex-col min-h-screen bg-blue-50">
            <NavBar />

            {/* Header */}
            <div className="bg-blue-200 px-6 md:px-10 py-10">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 text-blue-800 text-xs font-semibold mb-4">
                        <Info className="size-3.5" />
                        <span>À propos</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-blue-950 mb-3">
                        À propos de JeTalk
                    </h1>
                    <p className="text-blue-900/70 text-sm md:text-base leading-relaxed max-w-2xl">
                        Découvrez notre mission, notre équipe et notre vision pour l'apprentissage des langues au Cameroun.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 md:px-10 py-10">
                <div className="max-w-4xl mx-auto">
                    {/* Mission */}
                    <div className="bg-white rounded-2xl shadow-md p-6 md:p-10 mb-6">
                        <h2 className="text-xl font-bold text-blue-950 mb-4">Notre mission</h2>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                            JeTalk est née d'une vision simple : rendre l'apprentissage du français et de l'anglais accessible à tous les Camerounais, quel que soit leur niveau ou leur lieu de résidence.
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                            En tant que pays bilingue, le Cameroun offre une opportunité unique de maîtriser deux langues internationales. Cependant, les méthodes traditionnelles d'apprentissage ne sont pas toujours adaptées aux réalités locales.
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Notre plateforme utilise l'intelligence artificielle pour offrir un apprentissage personnalisé, interactif et disponible 24h/24, avec ou sans connexion internet.
                        </p>
                    </div>

                    {/* Valeurs */}
                    <div className="bg-white rounded-2xl shadow-md p-6 md:p-10 mb-6">
                        <h2 className="text-xl font-bold text-blue-950 mb-4">Nos valeurs</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-xl p-4">
                                <h3 className="font-bold text-blue-950 text-sm mb-1">Accessibilité</h3>
                                <p className="text-slate-600 text-xs leading-relaxed">Un apprentissage de qualité accessible à tous, partout au Cameroun.</p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-4">
                                <h3 className="font-bold text-blue-950 text-sm mb-1">Innovation</h3>
                                <p className="text-slate-600 text-xs leading-relaxed">L'IA au service d'un apprentissage moderne et efficace.</p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-4">
                                <h3 className="font-bold text-blue-950 text-sm mb-1">Communauté</h3>
                                <p className="text-slate-600 text-xs leading-relaxed">Une communauté d'apprenants solidaires et engagés.</p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-4">
                                <h3 className="font-bold text-blue-950 text-sm mb-1">Excellence</h3>
                                <p className="text-slate-600 text-xs leading-relaxed">Un accompagnement vers la maîtrise complète des langues.</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-white rounded-2xl shadow-md p-6 md:p-10">
                        <h2 className="text-xl font-bold text-blue-950 mb-4">Nous contacter</h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-slate-600 text-sm">
                                <Mail className="size-4 text-blue-600" />
                                <span>ivesdebanta@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 text-sm">
                                <MapPin className="size-4 text-blue-600" />
                                <span>Yaoundé, Cameroun</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 text-sm">
                                <Globe className="size-4 text-blue-600" />
                                <span>Disponible en français et en anglais</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default About
