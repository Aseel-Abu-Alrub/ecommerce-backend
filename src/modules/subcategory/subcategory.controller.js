import slugify from "slugify"
import SubCategoryModel from "../../../DB/model/subcategory.model.js"
import cloudinary from '../../services/cloudinery.js'
import categoryModel from "../../../DB/model/category.model.js"

export const createSubCategory=async(req,res,next)=>{
  const{name,categoryId}=req.body
   
  const subCategory=await SubCategoryModel.findOne({name})

  if(subCategory){ 
    return res.status(409).json({message:`sub category ${name} already exists`})
  }

  const category=await categoryModel.findById(categoryId)
// return res.json(category)
  if(!category){
    return res.status(409).json({message:"category not found"})

  }   
  const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
    folder:`${process.env.APP_NAME}/subcategories`
})

const subCategory2=await SubCategoryModel.create({name,slug:slugify(name),categoryId,image:{secure_url,public_id}})

return res.status(201).json({message:"success",subCategory2}) 
}

export const getSubCategory=async(req,res,next)=>{

    try{
        const categoryId=req.params.id;

        const category=await categoryModel.findById(categoryId)
    
        if(!category){
            return res.status(409).json({message:"category not found"})
    
        }
    
        const subcategory=await SubCategoryModel.find({categoryId}).populate({path:'categoryId'})
    
        return res.status(200).json({message:"success",subcategory})
    }
    catch(err){
        return res.json(err)
    }

}