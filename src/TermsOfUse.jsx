import NavBar from "./NavBar"
import Footer from "./Footer"
import { useTranslation } from "react-i18next"
import { FileText } from "lucide-react"

function TermsOfUse() {
    const { t } = useTranslation()

    return (
        <div className="pt-20 flex flex-col min-h-screen bg-blue-50">
            <NavBar />

            {/* Header */}
            <div className="bg-blue-200 px-6 md:px-10 py-10">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 text-blue-800 text-xs font-semibold mb-4">
                        <FileText className="size-3.5" />
                        <span>Légal</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-blue-950 mb-3">
                        Conditions d'utilisation
                    </h1>
                    <p className="text-blue-900/70 text-sm md:text-base leading-relaxed max-w-2xl">
                        Les règles et conditions qui régissent l'utilisation de la plateforme JeTalk.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 md:px-10 py-10">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 md:p-10">
                    <div className="prose prose-slate max-w-none">
                        <h2 className="text-xl font-bold text-blue-950 mt-0">1. Acceptation des conditions</h2>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            En créant un compte et en utilisant JeTalk, vous acceptez pleinement et sans réserve les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.
                        </p>

                        <h2 className="text-xl font-bold text-blue-950 mt-8">2. Description du service</h2>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            JeTalk est une plateforme d'apprentissage des langues (français et anglais) utilisant l'intelligence artificielle pour offrir des cours, des discussions guidées, de la traduction et un suivi de progression personnalisé.
                        </p>

                        <h2 className="text-xl font-bold text-blue-950 mt-8">3. Compte utilisateur</h2>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Vous êtes responsable de la confidentialité de vos identifiants de connexion. Vous devez fournir des informations exactes et à jour lors de votre inscription. Un seul compte est autorisé par adresse email.
                        </p>

                        <h2 className="text-xl font-bold text-blue-950 mt-8">4. Utilisation acceptable</h2>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Vous vous engagez à ne pas utiliser JeTalk à des fins illégales, nuisibles ou frauduleuses. Toute tentative de perturbation du service, d'accès non autorisé ou d'utilisation abusive pourra entraîner la suspension ou la suppression de votre compte.
                        </p>

                        <h2 className="text-xl font-bold text-blue-950 mt-8">5. Propriété intellectuelle</h2>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            L'ensemble du contenu de la plateforme (cours, textes, logos, logiciels) est protégé par le droit de la propriété intellectuelle. Toute reproduction ou utilisation non autorisée est interdite.
                        </p>

                        <h2 className="text-xl font-bold text-blue-950 mt-8">6. Limitation de responsabilité</h2>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            JeTalk s'efforce de fournir un service de qualité mais ne garantit pas l'absence d'erreurs ou d'interruptions. Nous ne saurions être tenus responsables des dommages directs ou indirects résultant de l'utilisation de la plateforme.
                        </p>

                        <h2 className="text-xl font-bold text-blue-950 mt-8">7. Modifications</h2>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés des changements importants. L'utilisation continue de la plateforme après modification vaut acceptation des nouvelles conditions.
                        </p>

                        <h2 className="text-xl font-bold text-blue-950 mt-8">8. Contact</h2>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Pour toute question concernant ces conditions d'utilisation, vous pouvez nous contacter à l'adresse : ivesdebanta@gmail.com
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default TermsOfUse
