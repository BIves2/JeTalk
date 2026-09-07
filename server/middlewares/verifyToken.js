import jwt from "jsonwebtoken"

function verifyToken(req, res, next){
    const token = req.cookies?.token
    if(!token){
        console.log("[Warning⚠️ ]: access denied !")
        return res.status(401).json({code:"ACCESS_DENIED", msg: "Access denied !"})
    }
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = payload
        console.log("[Message✅]: Acces enabled !")
        next()
    }catch(err){
        console.log("[Warning⚠️ ]: Token expired or invalid !")
        return res.status(403).json({code:"EXIRED_OR_INVALID_TOKEN", message:"Expired token or invalid token"})
    }
}
export default verifyToken