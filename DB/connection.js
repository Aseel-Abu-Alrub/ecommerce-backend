import mongoose from "mongoose";

const connectDB=async()=>{
return await mongoose.connect(process.env.DB)
.then(()=>{
    console.log("connected succesfuly")
    
}).catch((err)=>{
    console.log(`error to connect ${err}`)
})
}

export default connectDB