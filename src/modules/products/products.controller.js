import slugify from "slugify"
import categoryModel from "../../../DB/model/category.model.js"
import SubCategoryModel from "../../../DB/model/subcategory.model.js"
import cloudinary from '../../services/cloudinery.js'
import productModel from "../../../DB/model/product.model.js"
import { pagination } from "../../services/pagination.js"

export const getproducts=async(req,res,next)=>{
 
    const{skip,limit}=pagination(req.query.page,req.query.limit)
    let queryObj={...req.query}

    const execQuery=['page','limit','skip','sort','search','fields']
     execQuery.map((ele)=>{
        delete queryObj[ele]
     })
       
     //filter
      queryObj=JSON.stringify(queryObj)
     queryObj=queryObj.replace(/\b(gt|gte|lt|lte|in|nin|eq|neq)\b/g,match=>`$${match}`)
     queryObj=JSON.parse(queryObj)
     const moongooseQuery=productModel.find(queryObj).skip(skip).limit(limit)

    //search
    if(req.query.search){
        moongooseQuery.find({
            $or: [
            {name:{$regex:req.query.search,$options:'i'}},
            {description:{$regex:req.query.search,$options:'i'}}
        
            ]
         })
    
    }
    
     moongooseQuery.select(req.query.fields?.replaceAll(',',' '))

     //sort
   const product=await moongooseQuery.sort(req.query.sort?.replaceAll(',',' ')).populate('subCategoryId','name')
  const count=await productModel.estimatedDocumentCount()
   return res.status(200).json({message:"success",page:product.length,count:count,product})
}

export const createProduct=async(req,res,next)=>{
    // return res.json(req.files) 
    try{
        const{name,price,discount,categoryId,subCategoryId}=req.body
const checkCategory=await categoryModel.findById(categoryId)

if(!checkCategory){  
    return res.status(404).json({message:"category not found"})
}



if(req.body.name ){
if(await productModel.findOne({name:req.body.name}).select("name")){
    await productModel.updateOne({name:req.body.name,'colors.color':{$ne:req.body.color}}
        ,{
      $push:{colors:{
        color:req.body.color
      }}})

      await productModel.updateOne({name:req.body.name}
        ,{ 
      $push:{size:{
        sizee:req.body.sizee
      }}})
    return next(new Error(`product ${req.body.name} already exists`,{cause:404}))
    
    }
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
if(req.body.Size){
  
}

req.body.createdBy=req.user._id
req.body.updateddBy=req.user._id

const product=await productModel.create(req.body)

await productModel.updateOne({name:req.body.name}
    ,{
  $push:{colors:{
    color:req.body.color
  }}})

  if(req.body.sizee){
    await productModel.updateOne({name:req.body.name}
        ,{
      $push:{size:{
        sizee:req.body.sizee
      }}})
  }
 

if(!product){
    return res.status(400).json({message:"error while creating product"})

}


return res.status(200).json({message:"success",product})

}
catch(err){
   return res.json(err) 
}   

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
   export const updateRating=async(req,res,next)=>{

    const product=await productModel.findById(req.params.id)
    if(!product){
      return res.status(400).json({message:`product with if ${req.params.id} not found `})
    } 
    if(product.rating>4){
      return res.json("rating more than 5")
        }
     const ratingg= await productModel.findByIdAndUpdate({_id:req.params.id},{$inc:{rating:1}})
   
   return res.status(200).json({message:"success",ratingg})
    
   }
  
   export const decreaseRating=async(req,res,next)=>{

    const product=await productModel.findById(req.params.id)
    if(!product){
      return res.status(400).json({message:`product with if ${req.params.id} not found `})
    } 

    if(product.rating<1){
      return res.json("rating less than 0")
        }

     const ratingg= await productModel.findByIdAndUpdate({_id:req.params.id},{$inc:{rating:-1}})
    
   return res.status(200).json({message:"success",ratingg})
   
   }

   export const getSpesificProduct=async(req,res,next)=>{
    const productId=req.params.id
    const product=await productModel.findById({_id:productId})

if(!product){
  return next(new Error(`product with id ${productId} not found`,{cause:404}))
}

const newProduct=await productModel.findOne({_id:productId})
return res.status(200).json({message:"success",count:newProduct.length,newProduct})


   }

   export const updateSizeColor=async(req,res,next)=>{
    const product=await productModel.findById(req.params.id)
    if(!product){
      return res.status(400).json({message:`product with if ${req.params.id} not found `})
    } 
    if(req.body.Size){
      product.Size=req.body.Size
    }

    if(req.body.Color){
      product.Color=req.body.Color
     
    }
     
   await product.save()
   return res.status(200).json({message:"success",product})

   }