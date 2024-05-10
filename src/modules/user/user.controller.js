import userModel from "../../../DB/model/user.model.js"
import XLSX from "xlsx"
import { createPdf } from "../../services/pdf.js"

export const profile=async(req,res,next)=>{
    const user=await userModel.findById(req.user._id)

    return res.status(200).json({message:"success",user})
}

export const uploadUserExcel=async(req,res,next)=>{
const workBook=XLSX.readFile(req.file.path)
const workSheet=workBook.Sheets[workBook.SheetNames[0]]
const user=XLSX.utils.sheet_to_json(workSheet)

if(!await userModel.insertMany(user)){
   return next(new Error("Invalid ",{cause:404})) 
}

return res.status(202).json({message:"success"})

}

export const getUser=async(req,res,next)=>{
const users= await userModel.find({}).lean()
 await createPdf(users,'usersList',req,res) 
// return res.status(200).json({message:"success",users})
}