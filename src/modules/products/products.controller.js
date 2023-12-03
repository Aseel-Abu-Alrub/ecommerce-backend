import slugify from "slugify"
import categoryModel from "../../../DB/model/category.model.js"
import SubCategoryModel from "../../../DB/model/subcategory.model.js"
import cloudinary from '../../services/cloudinery.js'
import productModel from "../../../DB/model/product.model.js"

export const getproducts=async(req,res,next)=>{
   const product=await productModel.find()

   return res.status(200).json({message:"success",product})
}

export const createProduct=async(req,res,next)=>{
    // return res.json(req.files) 
const{name,price,discount,categoryId,subCategoryId}=req.body
const checkCategory=await categoryModel.findById(categoryId)

if(!checkCategory){ 
    return res.status(404).json({message:"category not found"})
}

const checkSubCategory=await SubCategoryModel.findById(subCategoryId)
if(!checkSubCategory){ 
    return res.status(404).json({message:"sub category not found"})
}
req.body.slug=slugify(name)
req.body.finalPrice=price-(price*(discount || 0)/100).toFixed(2)
const {secure_url,public_id}=await cloudinary.uploader.upload(req.files.mainImage[0].path,{
    folder:`${process.env.APP_NAME}/product/${req.body.name}/mainImages`
})
req.body.mainImage={secure_url,public_id}

req.body.subImages=[]

for(const file of req.files.subImages){
    const {secure_url,public_id}=await cloudinary.uploader.upload(file.path,{
        folder:`${process.env.APP_NAME}/product/${req.body.name}/subImages`
    }) 
    req.body.subImages.push({secure_url,public_id})
}

req.body.createdBy=req.user._id
req.body.updateddBy=req.user._id

const product=await productModel.create(req.body)

if(!product){
    return res.status(400).json({message:"error while creating product"})

}
return res.status(200).json({message:"success",product})

} 
 
export const updateProduct=async(req,res,next)=>{
   

 const product=await productModel.findById(req.params.id)
 
 if(!product){ 
    return res.status(404).json({message:`invalid product id ${req.params.id}`})
 }
 if(req.body.name){
    if(await productModel.findOne({name:req.body.name}).select("name")){
        return res.status(409).json({message:`product ${req.body.name} already exists `})
    }
    product.name=req.body.name
    product.slug=slugify(req.body.name)
 }
 if(req.body.discription){
    product.discription=req.body.discription
 }
 if(req.body.price){
    product.price=req.body.price
    product.finalPrice=req.body.price-(req.body.price*(product.discount || 0 )/100)
   }
   if(req.body.discount){
    product.discount=req.body.discount
    product.finalPrice=product.price-(product.price*(req.body.discount || 0 )/100)

   }
   if(req.files){
    const {secure_url,public_id}=await cloudinary.uploader.upload(req.files.mainImage[0].path,{
        folder:`${process.env.APP_NAME}/product/${req.body.name}/mainImages`
    })

    await cloudinary.uploader.destroy(product.mainImage.public_id)
    product.mainImage={secure_url,public_id}
   }
//   

    await product.save()
 

    return res.status(202).json({message:"success",product}) 
   }