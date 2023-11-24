import userModel from "../../../DB/model/user.model.js"
import bcrypt from 'bcryptjs'
import cloudinary from "../../services/cloudinery.js"
import jwt from 'jsonwebtoken'
import sendmail from "../../services/sendemail.js"
import  { customAlphabet } from 'nanoid'

export const signup= async(req,res,next)=>{
    const{userName,email,password}=req.body
    
    const user=await userModel.findOne({email});
    if(user){
        return res.status(409).json({message:"email already exists"})
    } 

    const hashedPassword=bcrypt.hashSync(password,parseInt(process.env.SALT_ROUND))
    const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
        folder:`${process.env.APP_NAME}/categories`
    })
    const token=jwt.sign({email},process.env.CONFIRMEMAILTOKEN)
    await sendmail(email,"confirm email",`<a href="${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}">verify email</a>`)

    const createUser=await userModel.create({userName,email,password:hashedPassword,image:{secure_url,public_id}})
    return res.status(200).json({message:"success",createUser}) 
 
 



}

export const sendCode=async(req,res,next)=>{
    const{email}=req.body
     let code=customAlphabet('1234567890abcz',4)
     code=code()
     const user=await userModel.findOneAndUpdate({email},{sendCode:code},{new:true})
     const html=`<h2>code is :${code}</h2>`
     await sendmail(email,'reset password',html)
    //  return  res.redirect("https://www.google.com")
     return res.status(200).json({message:"success",user})
}

export const forgetPassword=async(req,res,next)=>{
    const{email,password,code}=req.body
    const user=await userModel.findOne({email})
    if(!user){
        return res.status(404).json({message:"not registered account"})
    }
 
    if(user.sendCode!=code){
        return res.status(404).json({message:"Invalid code"})


    } 
    user.password=await bcrypt.hash(password,parseInt(process.env.SALT_ROUND))
    user.sendCode=null
    await user.save()
    return res.status(200).json({message:"success"})


}

export const confirmEmail=async(req,res,next)=>{
   const{token}=req.params
   const decoded=jwt.verify(token,process.env.CONFIRMEMAILTOKEN)

   if(!decoded){
    return res.status(404).json({message:"Invalid token"})
   }

   const user=await userModel.findOneAndUpdate({email:decoded.email,confirmEmail:false},{confirmEmail:true})

   if(!user){
    return res.status(400).json({message:"Invalid verify your email or your email is verified"})

   }
   return res.json({message:"your email is verified"})
}
export const signin=async(req,res,next)=>{
    const{email,password}=req.body
    const user=await userModel.findOne(({email}))

    if(!user){
        return res.status(409).json({message:"data invalid"})
    }

    const match=await bcrypt.compare(password,user.password)
    if(!match){
        return res.status(409).json({message:"data invalid"})

    }
    // return res.status(201).json({message:"success",user})
    const token=jwt.sign({id:user._id,role:user.role,status:user.status,userName:user.userName},process.env.LOGINTOKEN,{expiresIn:"5m"})
    const refreshToken=jwt.sign({id:user._id,role:user.role,status:user.status},process.env.LOGINTOKEN,{expiresIn:60*60*24*30})

    return res.status(201).json({message:"success",token,refreshToken})  

}