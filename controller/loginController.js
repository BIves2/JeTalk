import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { getUserByEmail } from "../model/User.js"

/**
 * Login funtion is the function used to enable user to access to JeTalk features.
 * @param {*} req request sended by user
 * @param {*} res response sended by the server
 * @returns the response sended by the navigator to the user
 */
async function login(req, res){
    try{
        const {email, password} = req.body
        const {user, account} = await getUserByEmail(email)
        if(user && account){
            const match = await bcrypt.compare(password, account.mot_de_passe)
            if(match){
                const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "1h"})
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: true,
                    path: "/",
                    maxAge: 60*60*1000
                })
                console.log("[Message✅]: User found on database")
                return res.json({code:"USER_FOUND", user: {id: user.id}})
            } else {
                console.log("[Warning⚠️ ]: Wrong password")
                return res.status(404).json({code:"WRONG_INFORMATIONS", msg:"Mot de passe ou email incorrect, veuillez reessayer !"})
            }
        } else {
            console.log("[Warning⚠️ ]: User not found !")
            return res.status(404).json({code:"USER_NOT_FOUND", msg: "L'utilisateur n'existe pas en base de donnees. Veuillez essayer avec d'autres ientifiants !"})
        }
    } catch(err){
        console.error("[Error🚨] : ", err)
        res.json({
            code: "UNKNOW_ERROR",
            msg: "Erreur inconnue"
        })
    }
}

export default login