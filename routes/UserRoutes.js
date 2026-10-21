import express from "express"
import { registration, verifyInfos } from "../controller/registryController.js"
import login from "../controller/loginController.js"
import verifyToken from "../server/middlewares/verifyToken.js"
import modelTest from "../controller/LLMController.js"
import { getUserInfos, getUserStats } from "../controller/userInfosController.js"
import TranslationController from "../controller/TranslationController.js"
import { getAvailableLessons, completeLesson } from "../controller/LessonController.js"
import { analyzeDiscussion, saveDiscussion } from "../controller/DiscussionController.js"

const UserRoutes = express.Router()
UserRoutes.post("/register", registration)
UserRoutes.post("/verifyInfos", verifyInfos)
UserRoutes.post("/login", login)
UserRoutes.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: true,
        path: "/"
    })
    res.json({code: "LOGGED_OUT", msg: "Déconnexion réussie"})
})
UserRoutes.post("/modelT", verifyToken, modelTest)
UserRoutes.get("/api/me", verifyToken, (req, res) => {
    res.json({user: req.user})
})
UserRoutes.get("/user", verifyToken, getUserInfos)
UserRoutes.get("/user/stats", verifyToken, getUserStats)
UserRoutes.post("/translate", verifyToken, TranslationController)

UserRoutes.get("/lessons", verifyToken, getAvailableLessons)
UserRoutes.post("/lessons/complete", verifyToken, completeLesson)

UserRoutes.post("/api/discussion/analyze", verifyToken, analyzeDiscussion)
UserRoutes.post("/api/discussion/save", verifyToken, saveDiscussion)

export default UserRoutes