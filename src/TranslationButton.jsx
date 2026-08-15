import { useState } from "react"

function TranslationButton(){
    const [language, setLanguage] = useState("Fr")
    const changeLanguage = (requiredLanguage) => {
        document.cookie = `googtrans=/fr/${requiredLanguage}; path=/; domain=${window.location.hostname}`
        document.cookie = `googtrans=/fr/${requiredLanguage}; path=/`
        setLanguage(requiredLanguage)
        window.location.reload()
    }
    return (
        <div className="flex gap-4">
            <button className="border-white rounded-lg border p-2 bg-green-400/40 font-bold sm:ml-auto cursor-pointer"  
                onClick={()=>{
                    if(language === 'Fr'){
                        setLanguage('En')
                        changeLanguage('en')
                    } else {
                        setLanguage('Fr')
                        changeLanguage('fr')
                    }
                }}
            >
                {(language=='Fr')?"FR":"EN"}
            </button>
        </div>
    )
}
export default TranslationButton