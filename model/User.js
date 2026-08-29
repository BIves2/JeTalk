import "dotenv/config"
import prisma from "../config/db.js"

const createUser = async (req, res)=>{
    const data = req.body
    const newUser = await prisma.utilisateur.create({
        data : {
            nom : data.name,
            langue: data.lang,
            niveau: data.lvl,
            compte: {
                create: {
                    email : data.email,
                    mot_de_passe : data.password
                }
            }
        }
    })
    console.log("User cree avec succes")
    res.json({msg: "User Created"})
} 

const getUserById = async (req, res)=>{
    const id = req.body.id
    const userReturned = await prisma.users.findFirst({
        where: {id: id}
    })
    res.json({name: userReturned.name})
}

const getUserByEmail = async (req, res)=>{
    const email = req.body.email
    const userReturned = await prisma.users.findFirst({
        where: {email: email}
    })
    res.json({name: userReturned.name})
}
export {createUser, getUserById, getUserByEmail}