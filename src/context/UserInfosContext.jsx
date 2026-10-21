import axios from "axios"
import { createContext, useEffect, useState, useContext } from "react"
import { useAuth } from "./AuthContext"
import { Outlet } from "react-router-dom"
import API_URL from "../config/api"

const InfosContext = createContext()

function UserInfosContext(){
    const [infos, setInfos] = useState(null)
    const {user} = useAuth()
    const checkInfos = async ()=>{
        if(!user?.id)return
        try{
            const response = await axios.get(`${API_URL}/user`, {
                withCredentials: true
            })
            setInfos({
                name: response.data.name,
                langue: response.data.langue || "Français",
                niveau: response.data.niveau || null,
                description: response.data.description || null,
                id: user.id
            })
        }catch(err){
            setInfos(null)
        }
    }
    useEffect(()=>{
        checkInfos()
    }, [user?.id])
    return (
        <InfosContext.Provider value={{ 
            name: infos?.name || "", 
            langue: infos?.langue || "Français",
            niveau: infos?.niveau || null,
            description: infos?.description || null,
            id: infos?.id || null 
        }}>
            <Outlet />
        </InfosContext.Provider>
    )
}

export const useInfos = ()=>useContext(InfosContext)
export default UserInfosContext
