import NavBar from "./NavBar"
import Footer from "./Footer"
import { useTranslation } from "react-i18next"
import { ShieldCheck } from "lucide-react"

function PrivacyPolicy() {
    const { t } = useTranslation()

    return (
        <div className="pt-20 flex flex-col min-h-screen bg-blue-50">
            <NavBar />

            {/* Header */}
            <div className="bg-blue-200 px-6 md:px-10 py-10">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 text-blue-800 text-xs font-semibold mb-4">
                        <ShieldCheck className="size-3.5" />
                        <span>Légal</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-blue-950 mb-3">
                        Politique de confidentialité
                    </h1>
                    <p className="text-blue-900/70 text-sm md:text-base leading-relaxed max-w-2xl">
                        Comment JeTalk collecte, utilise et protège vos données personnelles.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 md:px-10 py-10">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 md:p-10">
                    <div className="prose prose-slate max-w-none">
                        <h2 className="text-xl font-bold text-blue-950 mt-0">1. Données collectées</h2>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Nous collectons les informations suivantes : nom complet, adresse email, langue d'apprentissage, niveau de langue, photo de profil (optionnel) et données d'utilisation (conversations, scores, progression).
                        </p>

                        <h2 className="text-xl font-bold text-blue-950 mt-8">2. Utilisation des données</h2>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Vos données sont utilisées pour : personnaliser votre parcours d'apprentissage, générer des analyses de performance, améliorer nos services, et communiquer avec vous concernant votre compte.
                        </p>

                        <h2 className="text-xl font-bold text-blue-950 mt-8">3. Partage des données</h2>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Nous ne vendons ni ne partageons vos données personnelles avec des tiers sans votre consentement, sauf obligation légale. Les données peuvent être partagées avec nos prestataires techniques (hébergement, API IA) dans le strict cadre du fonctionnement du service.
                        </p>

                        <h2 className="text-xl font-bold text-blue-950 mt-8">4. Sécurité</h2>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données : chiffrement des mots de passe (bcrypt), authentification par jeton JWT, cookies sécurisés (httpOnly) et contrôle d'accès.
                        </p>

                        <h2 className="text-xl font-bold text-blue-950 mt-8">5. Vos droits</h2>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition concernant vos données personnelles. Pour exercer ces droits, contactez-nous à : ivesdebanta@gmail.com
                        </p>

                        <h2 className="text-xl font-bold text-blue-950 mt-8">6. Cookies</h2>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Nous utilisons des cookies pour maintenir votre session authentifiée et mémoriser vos préférences de langue. Vous pouvez désactiver les cookies dans votre navigateur, mais certaines fonctionnalités pourraient ne plus être accessibles.
                        </p>

                        <h2 className="text-xl font-bold text-blue-950 mt-8">7. Conservation des données</h2>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Vos données sont conservées tant que votre compte est actif. En cas de suppression de compte, vos données personnelles sont effacées dans un délai raisonnable, sauf obligation légale de conservation.
                        </p>

                        <h2 className="text-xl font-bold text-blue-950 mt-8">8. Modifications</h2>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Cette politique peut être mise à jour. Nous vous informerons de tout changement significatif. La date de dernière mise à jour est indiquée ci-dessous.
                        </p>

                        <p className="text-slate-500 text-xs mt-8 pt-4 border-t border-slate-200">
                            Dernière mise à jour : 28 août 2026
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default PrivacyPolicy
