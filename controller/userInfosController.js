import { getUserById } from "../model/User.js"
import prisma from "../config/db.js"

/**
 * Retourne les informations de l'utilisateur connecté.
 * L'identifiant vient exclusivement du token JWT, jamais du client.
 */
async function getUserInfos(req, res){
    const id = req.user?.id
    if(!id){
        return res.status(401).json({code: "UNAUTHORIZED", msg: "Authentification requise"})
    }
    console.log("==> Seaching User on DB ...")
    try{
        const response = await getUserById(id)
        if(response){
            console.log("[Message✅]: User infos found and returned successfully !")
            return res.status(200).json({
                name: response.nom,
                langue: response.langue,
                niveau: response.niveau,
                description: response.compte?.description || null,
                code: "USER_INFO_FOUND"
            })
        } else {
            console.log("[Warning⚠️ ]: Informations not founded !")
            return res.status(404).json({code: "USER_NOT_FOUND", msg: "Informations non trouvees"})
        }
    } catch (err) {
        console.error("[Error🚨] : ", err)
        return res.status(500).json({code: "SERVER_ERROR", msg: "Erreur serveur"})
    }
}

/**
 * Retourne les statistiques de l'utilisateur connecté.
 */
async function getUserStats(req, res){
    const id = req.user?.id
    if(!id){
        return res.status(401).json({code: "UNAUTHORIZED", msg: "Authentification requise"})
    }
    try{
        const stats = await prisma.statistiques.findUnique({
            where: { id_utilisateur: id }
        })
        return res.status(200).json({
            points: stats?.points ?? 0,
            coursTermines: stats?.coursTermines ?? 0
        })
    } catch (err) {
        console.error("[Error🚨 getUserStats] : ", err)
        return res.status(500).json({code: "SERVER_ERROR", msg: "Erreur serveur"})
    }
}

export {getUserInfos, getUserStats}
