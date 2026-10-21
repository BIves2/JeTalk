import axios from "axios";
import API_URL from "../config/api";

async function translate(message, lang, isOnlineParam) {
    try {
        const onlineStatus = isOnlineParam !== undefined 
            ? isOnlineParam 
            : (typeof navigator !== "undefined" ? navigator.onLine : true)
            
        const response = await axios.post(API_URL + '/translate', {
            message, 
            lang,
            isOnline: onlineStatus
        })
        return {
            success: true,
            translation: response.data.translation,
            provider: response.data.provider
        }
    } catch(error) {
        if (error.response && error.response.data) {
            return {
                success: false,
                msg: error.response.data.msg || error.response.data.error || "Erreur de traduction",
                status: error.response.status
            }
        }
        return {
            success: false,
            msg: "Impossible de joindre le serveur. Vérifiez que le serveur est bien lancé.",
            status: 503
        }
    }
}

export default translate