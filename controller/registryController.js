import { createUser, getUserById, getUserByEmail } from "../model/User.js"
import bcrypt from "bcrypt"

/**
 * Function used for registration of new users
 */
const registration = async (req, res)=>{
    try{
        const {name, lang, lvl, email, password, description, profil} = req.body
        const userWithEmail = await getUserByEmail(email)
        if(userWithEmail){
            console.log("[Warning⚠️ ]: Email already present on database")
            return res.status(409).json({
                code: "EMAIL_ALREADY_EXIST",
                msg: "Email deja present dans la base de donnees"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const userCreated = await createUser(name, lang, lvl, email, hashedPassword, description, profil)
        if(userCreated){
            console.log("[Message✅]: User created successfully")
            return res.status(201).json({
                code: "USER_CREATED",
                msg: "L'utilisateur a ete cree avec succes"
            })
        } else {
            console.error("[Error🚨] : The user wasn't created due to database side error")
        }
    } catch (error) {
        console.error("[Error🚨] : ", error)
        res.json({
            code: "Unknow error occurred",
            msg: "Erreur inconnue"
        })
    }
}

/**
 * This function verify if informations sended for registration to server are true
 * @param {*} req request sended to server by user
 * @param {*} res response given by te server to user 
 * @returns response of server to user
 */
const verifyInfos = (req, res)=>{
    if(!req.body.email || !req.body.password){
        console.error("[Error🚨]: No password or email provided by user")
        return res.status(400).json({code:"INFORMATIONS_NOT_PROVIDED", msg:"Mot de passe ou email non fournis"})
    }
    const email = req.body.email
    const emailTrim = email.trim()
    if(email.length > 256) {
        console.error("[Warning⚠️ ]: Too long email entered")
        return res.status(400).json({code:"TOO_LONG_EMAIL", msg:"Email trop long !"})
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const validity = regex.test(emailTrim)
    if(validity){
        console.log("[Message✅]: User email verified successfully !")
        const password = req.body.password

        if(password.length < 8){
            console.error("[Warning⚠️ ]: Password entered has less than 8 caracters !")
            res.status(400).json({code:"INVALID_PASSORD", msg:"Le mot de passe doit contenir au moins 8 caracteres"})
        } else if(!(/[a-z]/.test(password))){
            console.error("[Warning⚠️ ]: Password entered has no lowercase !")
            res.status(400).json({code:"INVALID_PASSORD", msg:"Minuscule manquante !"})
        } else if(!(/[A-Z]/.test(password))){
            console.error("[Warning⚠️ ]: Password entered has no uppercase !")
            res.status(400).json({code:"INVALID_PASSORD", msg:"Majuscule manquante dans le mot de passe !"})
        } else if(!(/[!~`@#$%&%^&*()_\-+={}\[\];':"<>.,\?\\]/.test(password))){
            console.error("[Warning⚠️ ]: Password entered has no specific caracter !")
            res.status(400).json({code:"INVALID_PASSORD", msg:"Caractere special manquant dans le mot de passe !"})
        } else if(!(/[0-9]/.test(password))){
            console.error("[Warning⚠️ ]: Invalid email entered by user !")
            res.status(400).json({code:"INVALID_PASSORD", msg:"Chiffre manquant dans le mot de passe"})
        } else {
            console.log("[Message✅]: User Password verified successfully !")
            res.status(200).json({code:"VALID_INFOS", msg:"Email et Password verifies avec succes"})
        }
    }else{
        console.error("[Warning⚠️ ]: Invalid email entered by user !")
        return res.status(400).json({code:"INVALID_EMAIL", msg:"Email invalide !"})
    }
}

export {registration, verifyInfos}