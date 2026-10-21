import axios from "axios";
import API_URL from "../config/api";

async function signup(name, email, lang, lvl, password){
    try{
        const response = await axios.post(API_URL+'/register',{name, email, lang, lvl, password})
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
        const response = await axios.post(API_URL+'/verifyInfos', {email, password})
        return response
    } catch (error) {
        if(error.response) {
            return error.response
        }
        return {status: 503, data: {msg: "Impossible de joindre le serveur. Vérifiez s'il est ouvert et si vous y êtes connecté puis réessayez"}}
    }
}

export {verifyInfos, signup}