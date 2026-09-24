import axios from "axios";

const url = "http://localhost:5000"

async function translate(message, lang){
    try{
        const response = await axios.post(url+'/translate',{message, lang})
        return response.data.translation
    } catch(error) {
        if(error.response){
            return error.response
        }
        return {status: 503, data: {msg: "Impossible de joindre le serveur. Vérifiez s'il est ouvert et si vous y êtes connecté puis réessayez"}}
    }
}

export default translate