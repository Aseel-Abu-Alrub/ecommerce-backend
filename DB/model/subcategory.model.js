import mongoose, { Schema,Types,model } from "mongoose";

const SubCategorySchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    
   slug:{
    type:String,
    required:true
   },
   image:{
    type:Object,
    // required:true
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
createdBy:{
    type:Types.ObjectId,
    ref:'User'
},
updateddBy:{
    type:Types.ObjectId,
    ref:'User'
},


      
},{
    timestamps:true,
    toObject:{virtuals:true},
    toJSON:{virtuals:true}
})

SubCategorySchema.virtual('product',{
 localField:'_id',
 foreignField:'subCategoryId',
 ref:'Product'  
})

const SubCategoryModel= mongoose.models.SubCategory || model('SubCategory',SubCategorySchema)

export default SubCategoryModel;