import express from "express"
import { registration, verifyInfos } from "../controller/registryController.js"
import login from "../controller/loginController.js"
import verifyToken from "../server/middlewares/verifyToken.js"
import modelTest from "../controller/LLMController.js"
import { getUserInfos } from "../controller/userInfosController.js"
import TranslationController from "../controller/TranslationController.js"
import { getAvailableLessons, completeLesson } from "../controller/LessonController.js"

const UserRoutes = express.Router()
UserRoutes.post("/register", registration)
UserRoutes.post("/verifyInfos", verifyInfos)
UserRoutes.post("/login", login)
UserRoutes.post("/modelT", modelTest)
UserRoutes.get("/api/me", verifyToken, (req, res) => {
    res.json({user: req.user})
})
UserRoutes.get("/user", verifyToken, getUserInfos)
UserRoutes.post("/translate", TranslationController)

UserRoutes.get("/lessons", verifyToken, getAvailableLessons)
UserRoutes.post("/lessons/complete", verifyToken, completeLesson)

export default UserRoutes