import slugify from "slugify"
import categoryModel from "../../../DB/model/category.model.js"
import cloudinary from "../../services/cloudinery.js"

export const getAllcategories= async(req,res)=>{
    const categories=await categoryModel.find().populate('subcategory')
    return res.status(200).json({message:"success",categories}) 
}

export const createCategories=async(req,res,next)=>{
    const name=req.body.name.toLowerCase()
    if(await categoryModel.findOne({name})){
        return res.status(409).json({message:"category name already exists"})
    }

    const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
        folder:`${process.env.APP_NAME}/categories`
    })
    const cat=await categoryModel.create({name,slug:slugify(name),image:{secure_url,public_id}})
    return res.status(201).json({message:"success",cat})
}
export const getspecificCategories=async(req,res,next)=>{
const{id}=req.params
const category=await categoryModel.findById(id)
return res.status(200).json({message:"success",category}) 

} 

export const updateCategories=async(req,res,next)=>{
    const category=await categoryModel.findById(req.params.id)
    if(!category){
        return res.status(404).json({message:`invalid category id ${req.params.id}`})
    }

    if(req.body.name){
        if(await categoryModel.findOne({name:req.body.name}).select("name")){
            return res.status(409).json({message:`category ${req.body.name} already exists`})            
        }
        category.name=req.body.name
        category.slug=slugify(req.body.name)
      
    }

    if(req.body.status){
        category.status=req.body.status
    }

    if(req.file){
        const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
            folder:`${process.env.APP_NAME}/categories`
        })
        await cloudinary.uploader.destroy(category.image.public_id)
        category.image={secure_url,public_id}
    }
    await category.save()
    return res.status(200).json({message:"success"})    
}  
 
export const getActiveCategory=async(req,res,next)=>{
    const category=await categoryModel.find({status:"Active"}).select('name status')

    return res.status(200).json({message:"success",category})
}