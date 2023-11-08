import jwt from 'jsonwebtoken'
import userModel from '../../DB/model/user.model.js'
export const auth=()=>{
return async(req,res,next)=>{
    const{authorization}=req.headers
    if(!authorization?.startsWith(process.env.BEARERKEY)){
        return res.status(400).json({message:"Invalid authorization"})
    }
    const token=authorization.split(process.env.BEARERKEY)[1]
    const decoded=jwt.verify(token,process.env.LOGINTOKEN)
    if(!decoded){
        return res.status(400).json({message:"Invalid authorization"})

    }

    const user=await userModel.findById(decoded.id).select("role userName ")

    if(!user){
        return res.status(404).json({message:"not registerd user"})

    }
    if(user.role=='User'){
        return res.status(403).json({message:"not auth user"})
 
    }
    next()

}
}