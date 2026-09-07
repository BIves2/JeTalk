import axios from "axios"
import { useEffect, useState, createContext, useContext } from "react"

const AuthContext = createContext()

function AuthProvider({children}){
    const [user, setUser] = useState(null)
    const url = "http://localhost:5000"
    const [loading, setLoading] = useState(true)
    const checkAuth = async ()=>{
        try{
            const response = await axios.get(url+"/api/me", {withCredentials: true})
            setUser(response.data.user)
        }catch(err){
            setUser(null)
        }finally{
            setLoading(false)
        }
    }
    const login = async (credentials)=>{
        const response = await axios.post(url+"/login", credentials, {withCredentials: true})
        setUser(response.data.user)
    }
    useEffect(()=>{
        checkAuth()
    }, [])
    return(
        <AuthContext.Provider value={{user, isAuthenticated: !!user, login, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=> useContext(AuthContext)
export default AuthProvider