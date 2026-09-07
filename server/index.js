import express, { json } from 'express'
import cors from 'cors'
import UserRoutes from '../routes/UserRoutes.js'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())
app.use(json())
app.use("/",UserRoutes)

app.listen(5000, ()=>{
    console.log("Server launched on port 5000 : http://localhost:5000")
})