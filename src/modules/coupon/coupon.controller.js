import couponModel from "../../../DB/model/coupon.model.js"

export const createCoupon= async(req,res,next)=>{
    const{name}=req.body
    req.body.expireDate=new Date(req.body.expireDate)
    if(await couponModel.findOne({name})){
      return res.status(404).json({message:`coupon ${name} already exists`})
    }
 
    const coupon=await couponModel.create(req.body)
    return res.status(201).json({message:"success",coupon})
}

export const getCoupon=async(req,res,next)=>{

const coupon=await couponModel.find({}) 

return res.status(201).json({message:"success",coupon})
}

export const updateCoupon=async(req,res,next)=>{

const coupon=await couponModel.findById(req.params.id)
if(!coupon){
    return res.status(404).json({message:"coupon not found"})

}
if(req.body.name){
    if(await couponModel.findOne({name:req.body.name}).select("name")){
        return res.status(404).json({message:`coupon ${name} already exists`})
 
    }
    coupon.name=req.body.name
}
if(req.body.amount){
    coupon.amount=req.body.amount
}
await coupon.save()
return res.status(201).json({message:"success",coupon})


}

export const softDelete=async(req,res,next)=>{
    const{id}=req.params
    const coupon=await couponModel.findOneAndUpdate({_id:id,isDeleted:false},{isDeleted:true},{new:true})

    if(!coupon){
        return res.status(404).json({message:`can not delete this coupon`})

    } 
    return res.status(201).json({message:"success",coupon})
}

export const hardDelete=async(req,res,next)=>{
 const{id}=req.params
 
 const coupon=await couponModel.findOneAndDelete({_id:id},{new:true})

 if(!coupon){
    return res.status(404).json({message:`can not delete this coupon`})
   
 }
 return res.status(201).json({message:"success"})


}

export const restore=async(req,res,next)=>{
    const{id}=req.params
    const coupon=await couponModel.findOneAndUpdate({_id:id,isDeleted:true},{isDeleted:false},{new:true})

    if(!coupon){
        return res.status(404).json({message:`can not restore this coupon`})

    } 
    return res.status(201).json({message:"success",coupon}) 
}
