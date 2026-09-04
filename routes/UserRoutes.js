import express from "express"
import { registration, verifyInfos } from "../controller/registryController.js"

const UserRoutes = express.Router()
UserRoutes.post("/register", registration)
UserRoutes.post("/verifyInfos", verifyInfos)

export default UserRoutes