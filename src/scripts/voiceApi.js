import axios from "axios"
import API_URL from "../config/api"

const baseUrl = API_URL

export const voiceApi = {
    async sendVoiceMessage(message, history = [], sessionContext = {}) {
        const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true
        const response = await axios.post(`${baseUrl}/modelT`, {
            message, 
            history,
            isOnline,
            sessionContext  // { subject, duration, niveau, userName, userDescription }
        }, {
            responseType: 'arraybuffer',
            withCredentials: true,
            timeout: 60000
        })
        return {
            data: response.data,
            contentType: String(response.headers?.['content-type'] || '').toLowerCase()
        }
    },

    async sendTextMessage(message, history = [], sessionContext = {}) {
        const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true
        const response = await axios.post(`${baseUrl}/modelText`, {
            message,
            history,
            isOnline,
            sessionContext
        }, {
            withCredentials: true,
            timeout: 45000
        })
        return response.data
    },

    async analyzeDiscussion(subject, duration, niveau, chatHistory, langue = "Français") {
        const response = await axios.post(`${baseUrl}/api/discussion/analyze`, {
            subject,
            duration,
            niveau,
            langue,
            chatHistory
        }, {
            withCredentials: true
        })
        return response.data
    },

    async saveDiscussion(subject, duration, niveau, chatHistory, observations, score, userId, langue = "Français") {
        const response = await axios.post(`${baseUrl}/api/discussion/save`, {
            subject,
            duration,
            niveau,
            langue,
            chatHistory,
            observations,
            score,
            userId
        }, {
            withCredentials: true
        })
        return response.data
    }
}
