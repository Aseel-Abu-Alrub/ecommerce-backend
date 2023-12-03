import cartModel from "../../../DB/model/cart.model.js"
import couponModel from "../../../DB/model/coupon.model.js"
import orderModel from "../../../DB/model/order.model.js"
import productModel from "../../../DB/model/product.model.js"
import userModel from "../../../DB/model/user.model.js"

export const createOrder=async(req,res,next)=>{
    const{copounName}=req.body
const cart=await cartModel.findOne({userId:req.user._id})

if(!cart){
    return next(new Error("cart is Empty",{cause:400}))
}
req.body.products=cart.products

if(copounName){
const checkCoupon=await couponModel.findOne({name:copounName})

if(!checkCoupon){
    return next(new Error("coupon not found",{cause:404}))
}
const currentDate=new Date()

if(checkCoupon.expireDate <= currentDate){
return next(new Error("this coupon has expired",{cause:400}))
}

if(checkCoupon.usedBy.includes(req.user._id)){
   return next(new Error("this copoun already used",{cause:400})) 
}
req.body.coupon=checkCoupon

}
  let subTotals=0
  let finalProductList=[]
  for(let product of req.body.products){
    const checkProduct=await productModel.findOne({
    _id:product.productId,
    stock:{$gte:product.quantity}
    })
    if(!checkProduct){
        return next(new Error("product quantity not available "))
    }
    product=product.toObject()
    product.name=checkProduct.name
    product.unitePrice=checkProduct.price
    product.discount=checkProduct.discount
    product.finalPrice=product.quantity*checkProduct.finalPrice
    subTotals+=product.finalPrice
    finalProductList.push(product)
  }

//return res.json(finalProductList)
const user=await userModel.findById(req.user._id)

if(!req.body.address){
   req.body.address=user.address 
}
if(!req.body.phone){
    req.body.phone=user.phoneNumber
}
// return res.json(req.body)
const order=await orderModel.create({
  userId:req.user._id,
  products: finalProductList,
  finalPrice: subTotals - (subTotals * (req.body.coupon?.amount || 0)/100),
  phoneNumber:req.body.phone,
  address:req.body.address,   
  updateBy:req.user._id,
  copounName:req.body.copounName??''
 

})

for(let product of req.body.products ){
   await productModel.updateOne({_id:product.productId},{$inc:{stock:-product.quantity}}) 
}
if(req.body.coupon){
    await couponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id}})
}

await cartModel.updateOne({userId:req.user._id},{products:[]})
return res.status(201).json({message:"success",order})

} 