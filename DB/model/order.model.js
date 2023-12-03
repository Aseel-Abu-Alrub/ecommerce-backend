import mongoose, { Schema,Types,model } from "mongoose";


const orderSchema=Schema({
userId:{
    type:Types.ObjectId,
    ref:'User',
    required:true
},
products:[{
    productId:{type:Types.ObjectId,ref:'Product',required:true},
    quantity:{type:Number,default:1,required:true},
    unitePrice:{type:Number,required:true},
    finalPrice:{type:Number,required:true}

}

],
finalPrice:{
type:Number,
required:true
},
copounName:{
    type:String,
    required:true
},
paymentType:{
    type:String,
    default:'cash',
    enum:['cart','cash']
},
status:{
  type:String,
  default:'pending',
  enum:['pending','cancelled','confirmed','onWay','deliverd']  
},
phoneNumber:{
type:String,
required:true
},
address:{
type:String,
required:true
},
resonRejected:String,
note:String,
updateBy:{
    type:Types.ObjectId,
    ref:'User',
    required:true
}
},

{
timestamps:true
}

)

const orderModel=mongoose.models.Order || model('Order',orderSchema)
export default orderModel