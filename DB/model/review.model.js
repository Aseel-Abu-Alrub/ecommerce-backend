import mongoose, {Schema,Types,model} from 'mongoose'

const reviewSchema=new Schema({
  comment:{
   type:String,
   required:true 
  },
  rating:{
  type:Number,
  //required:true,
  default:1, 
  min:1,
  max:5
  },
  createdBy:{
   type:Types.ObjectId,
   ref:'User',
   required:true 
  },
  productId:{type:Types.ObjectId,ref:'Product',required:true},
  orderId:{type:Types.ObjectId,ref:'Order',required:true}
},{
 timestamps:true 
})

const reviewModel= mongoose.models.Review || model('Review',reviewSchema)

export default reviewModel