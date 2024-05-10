import {Schema,Types,model} from 'mongoose'

const reviewSchema=new Schema({
  comment:{
   type:String,
   required:true 
  },
  rating:{
  type:Number,
  required:true,
  min:1,
  max:5
  },
  createdBy:{
   type:Types.ObjectId,
   ref:'User',
   required:true 
  },
  carId:{type:Types.ObjectId,ref:'Car',required:true},
  orderId:{type:Types.ObjectId,ref:'Order',required:true}
})