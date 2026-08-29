import express from "express"
import {createUser, getUserById, getUserByEmail} from '../model/User.js'

const router = express.Router()
router.post("/register", createUser)
router.get("/findUser/id", getUserById)
router.get("/findUser/email", getUserByEmail)

export default router