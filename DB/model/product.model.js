import mongoose, { Schema,Types,model } from "mongoose";

const productSchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    
   slug:{
    type:String,
    required:true
   },
   discription:{
    type:String,
    required:true
   },
   stock:{
    type:Number,
    default:1
   },
   price:{
    type:Number,
    required:true
   },
   finalPrice:{
    type:Number,
   },

   discount:{
    type:Number,
    default:0
   },

   mainImage:{
    type:Object,
    required:true
   },
   subImages:[{
    type:Object,
    required:true
   }],
  isDeleted:{
   type:Boolean,
   default:false
  },
   status:{
    type:String,
    default:'Active',
    enum:['Active','Inactive']
},
categoryId:{
  type:Types.ObjectId,
  ref:'Category',
  required:true

},
subCategoryId:{
    type:Types.ObjectId,
    ref:'SubCategory',
    required:true
  
  },
  number_sellers:{
   type:Number,
   default:0
  },
createdBy:{
    type:Types.ObjectId,
    ref:'User',
    required:true 
},  
updateddBy:{
    type:Types.ObjectId,  
    ref:'User',  
    // required:true
},


      
},{
    timestamps:true,
  
})


const productModel= mongoose.models.Product || model('Product',productSchema)

export default productModel;