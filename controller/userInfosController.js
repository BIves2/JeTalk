import { getUserById } from "../model/User.js"

async function getUserInfos(req, res){
    const id = req.query.id
    if(!id){
        return res.status(400).json({code: "MISSED_ID"})
    }
    console.log("==> Seaching User on DB ...")
    try{
        const response = await getUserById(id)
        if(response){
            console.log("[Message✅]: User infos found and returned successfully !")
            return res.status(200).json({
                name: response.nom,
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

export {getUserInfos}