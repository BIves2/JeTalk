import axios from "axios"
import { useEffect, useState, createContext, useContext } from "react"
import { useNavigate } from "react-router-dom"
import API_URL from "../config/api"

const AuthContext = createContext()

function AuthProvider({children}){
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const checkAuth = async ()=>{
        try{
            const response = await axios.get(`${API_URL}/api/me`, {withCredentials: true})
            setUser(response.data.user)
        }catch(err){
            setUser(null)
        }finally{
            setLoading(false)
        }
    }

    const login = async (credentials)=>{
        const response = await axios.post(`${API_URL}/login`, credentials, {withCredentials: true})
        setUser(response.data.user)
        return response
    }

    const logout = async ()=>{
        try{
            await axios.post(`${API_URL}/logout`, {}, {withCredentials: true})
        }catch(err){
            // Même si le serveur échoue, on déconnecte localement
        }
        setUser(null)
        navigate("/login", {replace: true})
    }

    useEffect(()=>{
        checkAuth()
    }, [])

    return(
        <AuthContext.Provider value={{user, isAuthenticated: !!user, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=> useContext(AuthContext)
export default AuthProvider