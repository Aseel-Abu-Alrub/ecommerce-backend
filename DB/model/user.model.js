import mongoose, { Schema,model } from "mongoose";

const userSchema=new Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    
        password:{
            type:String,
            required:true
        },
        confirmEmail:{ 
            type:Boolean,
             required:false,
             default:false
        
        },
        image:{
            type:Object,
        },
        gender:{
        type:String,
        default:'Male',
        enum:['Male','Female']
        },
        role:{
            type:String,
            default:'User',
            enum:['User','Admin']
        },
        status:{
            type:String,
            default:'Active',
            enum:['Active','Inactive']
        }
},{
    timestamps:true
})

const userModel= mongoose.models.User || model('User',userSchema)

export default userModel;