import { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ChevronDown, Settings, LogOut, User, X } from "lucide-react"
import { useAuth } from "./context/AuthContext"

function ProfilItem({ name, profil = "", role = "student" }) {
    const { t } = useTranslation()
    const { logout } = useAuth()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const [countdown, setCountdown] = useState(3)
    const containerRef = useRef(null)
    const countdownRef = useRef(null)

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

    useEffect(() => {
        if (showLogoutModal) {
            setCountdown(3)
            countdownRef.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownRef.current)
                        logout()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        } else {
            if (countdownRef.current) {
                clearInterval(countdownRef.current)
                countdownRef.current = null
            }
        }
        return () => {
            if (countdownRef.current) {
                clearInterval(countdownRef.current)
            }
        }
    }, [showLogoutModal])

    const handleLogoutClick = () => {
        setDropdownOpen(false)
        setShowLogoutModal(true)
    }

    const handleCancel = () => {
        setShowLogoutModal(false)
        setCountdown(3)
    }

    const handleConfirmLogout = () => {
        if (countdownRef.current) {
            clearInterval(countdownRef.current)
        }
        logout()
    }

    return (
        <>
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
                                src={profil}
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
                        <span className="text-sm font-semibold text-gray-800 truncate">
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
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
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
                            <Settings className="w-4 h-4 text-gray-400" />
                            <span>Paramètres</span>
                        </Link>

                        <div className="my-1 border-t border-gray-100" />

                        <button
                            onClick={handleLogoutClick}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
                        >
                            <LogOut className="w-4 h-4 text-red-500" />
                            <span>Se Déconnecter</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 m-4 max-w-sm w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900">
                                {t("logout.title")}
                            </h2>
                            <button
                                onClick={handleCancel}
                                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="flex flex-col items-center py-6">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <LogOut className="w-8 h-8 text-red-600" />
                            </div>
                            <p className="text-gray-600 text-center mb-2">
                                {t("logout.message")}
                            </p>
                            <p className="text-3xl font-bold text-red-600">
                                {countdown}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                            >
                                {t("logout.cancel")}
                            </button>
                            <button
                                onClick={handleConfirmLogout}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                            >
                                {t("logout.confirm")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ProfilItem
