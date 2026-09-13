import axios from "axios"
import { createContext, useEffect, useState, useContext } from "react"
import { useAuth } from "./AuthContext"
import { Outlet } from "react-router-dom"

const InfosContext = createContext()

function UserInfosContext(){
    const [infos, setInfos] = useState(null)
    const url = "http://localhost:5000"
    const {user} = useAuth()
    const checkInfos = async ()=>{
        if(!user?.id)return
        try{
            const response = await axios.get(url+"/user", {
                params: {id: user.id},
                withCredentials: true
            })
            setInfos(response.data.name)
        }catch(err){
            setInfos(null)
        }
    }
    useEffect(()=>{
        checkInfos()
    }, [user?.id])
    return (
        <InfosContext.Provider value={{name: infos}}>
            <Outlet />
        </InfosContext.Provider>
    )
}

export const useInfos = ()=>useContext(InfosContext)
export default UserInfosContext