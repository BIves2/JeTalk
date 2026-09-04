import { useTranslation } from "react-i18next"

function TranslationButton(){
    const {i18n} = useTranslation()
    const changeLanguage = () => {
        const nextLang = i18n.language === 'fr' ? 'en' : 'fr'
        i18n.changeLanguage(nextLang)
    }
    return (
        <div className="flex gap-4">
            <button className="border-white rounded-lg border p-2 bg-green-400/40 font-bold sm:ml-auto cursor-pointer"  
                onClick={changeLanguage}>
                {i18n.language==='fr'?"FR":"EN"}
            </button>
        </div>
    )
}
export default TranslationButton