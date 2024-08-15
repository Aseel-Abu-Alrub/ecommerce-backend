import productModel from "../../../DB/model/product.model.js"
import orderModel from "../../../DB/model/order.model.js"
import reviewModel from "../../../DB/model/review.model.js"

export const createReview=async(req,res,next)=>{
 const{productId}=req.params
 const{comment}=req.body
 const product=await productModel.findById(productId)
 if(!product){
   return next(new Error(`this product with id ${productId} not found`,{cause:404})) 
 }  
 
 const order=await orderModel.findOne({
   userId:req.user._id, 
   status:'deliverd',
   'products.productId':productId 
 })
 
if(!order){
    return next(new Error(`can't review in this product `,{cause:404})) 
  
}
const checkReview=await reviewModel.findOne({
    createdBy:req.user._id,
    productId:productId
})

if(checkReview){
    return next(new Error(`already review `,{cause:400})) 
   
}

const review=await reviewModel.create({
  comment,
  rating,
  createdBy:req.user._id,
  productId:productId ,
  orderId:order._id
})
if(!review){
    return next(new Error(`error while adding review`,{cause:400})) 


}

return res.status(200).json({message:"success",review})

}


export const getReview=async(req,res,next)=>{
  const review=await reviewModel.findOne({createdBy:req.user._id}).populate('createdBy')  
  return res.status(200).json({message:"success",review})
}

export const getSpesificReview=async(req,res,next)=>{
 const{id}=req.params 
 const review=await reviewModel.find({productId:id}).populate('createdBy')  

 return res.status(200).json({message:"success",review})
}

export const getAllReview=async(req,res,next)=>{
  const review=await reviewModel.find({}).populate("createdBy")  
  return res.status(200).json({message:"success",review})

}

export const updateReview=async(req,res,next)=>{
const{id}=req.params
const review=await reviewModel.findById(id)

if(!review){
    return next(new Error(`review with id ${id} not foud`,{cause:404}))
}

if(req.body.comment){
  review.comment=req.body.comment  
}

if(req.body.rating){
  review.rating=req.body.rating  
}
await review.save()
return res.status(200).json({message:"success",review})


}

export const updateRating=async(req,res,next)=>{ 
  

    const product=await productModel.findById(req.params.id)
    if(!product){
      return res.status(400).json({message:`product with if ${req.params.id} not found `})
    } 
    
      const ratingg= await reviewModel.findOneAndUpdate({productId:req.params.id},{$inc:{rating:1}})
     if(ratingg.rating>3){
      return res.json("rating more than 5")
    
        }
   
   return res.status(200).json({message:"success",ratingg})
    
   
}

export const deleteReview=async(req,res,next)=>{
    const{id}=req.params
const review=await reviewModel.findById(id)

if(!review){
    return next(new Error(`review with id ${id} not foud`,{cause:404}))
}

const deletereview=await reviewModel.deleteOne({_id:id})
return res.status(200).json({message:"success"})

}