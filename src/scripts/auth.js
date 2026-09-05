import axios from "axios";

const url = "http://localhost:5000"

async function signup(name, email, lang, lvl, password){
    try{
        const response = await axios.post(url+'/register',{name, email, lang, lvl, password})
        return response
    } catch(error) {
        if(error.response){
            return error.response
        }
        return {status: 503, data: {msg: "Impossible de joindre le serveur. Vérifiez s'il est ouvert et si vous y êtes connecté puis réessayez"}}
    }
}
async function verifyInfos(email, password){
    try{
        const response = await axios.post(url+'/verifyInfos', {email, password})
        return response
    } catch (error) {
        if(error.response) {
            return error.response
        }
        return {status: 503, data: {msg: "Impossible de joindre le serveur. Vérifiez s'il est ouvert et si vous y êtes connecté puis réessayez"}}
    }
}

export {verifyInfos, signup}