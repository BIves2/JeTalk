import "dotenv/config"
import prisma from "../config/db.js"

const createUser = async (name, lang, lvl, email, password, profil=null, description=null)=>{
     const userData = {
        nom : name,
        langue: lang,
        niveau: lvl,
        compte: {
            create: {
                email : email,
                mot_de_passe : password,
            }
        }
    }
    if(profil)userData.profil = profil
    if(description)userData.description = description
    const newUser = await prisma.utilisateur.create({
       data: userData
    })
    return newUser
} 

const getUserById = async (id)=>{
    const userReturned = await prisma.utilisateur.findFirst({
        where: {id: id}
    })
    return userReturned
}

const getUserByEmail = async (email)=>{
    const userReturned = await prisma.utilisateur.findFirst({
        where: {
            compte: {
                email: email
            }
        }
    })
    return userReturned
}
export {createUser, getUserById, getUserByEmail}