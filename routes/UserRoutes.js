import express from "express"
import { registration, verifyInfos } from "../controller/registryController.js"
import login from "../controller/loginController.js"
import verifyToken from "../server/middlewares/verifyToken.js"

const UserRoutes = express.Router()
UserRoutes.post("/register", registration)
UserRoutes.post("/verifyInfos", verifyInfos)
UserRoutes.post("/login", login)
UserRoutes.get("/api/me", verifyToken, (req, res) => {
    res.json({user: req.user})
})

export default UserRoutes