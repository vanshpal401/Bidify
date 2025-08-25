import mongoose from "mongoose"

const otp=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:60*10,
    },
})
export const OTP=mongoose.model("OTP",otp);