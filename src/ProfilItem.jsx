import { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ChevronDown, Settings, LogOut, User } from "lucide-react"

function ProfilItem({ name, profil = "", role = "student" }) {
    const { t } = useTranslation()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const containerRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <div ref={containerRef} className="relative z-30">
            <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-gray-200 bg-white/80 hover:bg-white hover:shadow-md transition-all duration-200 max-w-[180px] sm:max-w-[240px] cursor-pointer outline-none focus:ring-2 focus:ring-blue-400"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
            >
                <div className="relative shrink-0">
                    {profil ? (
                        <img
                            src={profil === "" ? <User /> : profil}
                            alt={name || "USER_PROFIL"}
                            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover ring-2 ring-blue-500/20"
                        />
                    ) : (
                        <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            <User className="w-5 h-5" />
                        </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div className="flex flex-col text-left min-w-0 flex-1 hidden xs:flex">
                    <span
                        className="text-sm font-semibold text-gray-800 truncate"
                    >
                        {name}
                    </span>
                    <span className="text-[10px] font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full w-fit max-w-full truncate uppercase tracking-wider">
                        {t("userHeader." + role)}
                    </span>
                </div>
                <ChevronDown
                    className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                />
            </button>
            {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 xs:hidden">
                        <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
                        <span className="text-xs text-blue-600 font-medium">
                            {t("userHeader." + role)}
                        </span>
                    </div>

                    <Link
                        to="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                        <Settings className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                        <span>Paramètres</span>
                    </Link>

                    <div className="my-1 border-t border-gray-100" />

                    <button
                        onClick={() => {
                            setDropdownOpen(false)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
                    >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Se Déconnecter</span>
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfilItem