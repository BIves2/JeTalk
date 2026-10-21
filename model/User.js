import "dotenv/config"
import prisma from "../config/db.js"

const createUser = async (name, lang, lvl, email, password, profil=null, description=null)=>{
    const compteData = {
        email: email,
        mot_de_passe: password
    }
    const userData = {
        nom : name,
        langue: lang,
        niveau: lvl,
        compte: {
            create: compteData
        }
    }
    if(description)compteData.description = description
    if(profil)compteData.photo_profil = profil
    const newUser = await prisma.utilisateur.create({
       data: userData
    })
    return newUser
} 

const getUserById = async (id)=>{
    const numericId = parseInt(id, 10)
    if(isNaN(numericId)) return null
    const userReturned = await prisma.utilisateur.findFirst({
        where: {id: numericId},
        include: { compte: true }
    })
    return userReturned
}

const getUserByEmail = async (email)=>{
    const accountFound = await prisma.compte.findFirst({
        where: {
            email: email
        },
        include: {
            utilisateur: true
        }
    })
    if(!accountFound) return { user: null, account: null }
    return {
        user: accountFound.utilisateur, 
        account: accountFound
    }
}
export {createUser, getUserById, getUserByEmail}