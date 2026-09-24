import axios from "axios"

const url = 'http://localhost:5000/modelT'

export const voiceApi = {
    async sendVoiceMessage(message, history = []){
        const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true
        const response = await axios.post(url, {
            message, 
            history,
            isOnline
        }, {
            responseType: 'arraybuffer'
        })
        return response.data
    }
}
