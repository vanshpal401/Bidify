import mongoose, { mongo, Mongoose } from "mongoose";


const commissionSchema=new mongoose.Schema({
    amount:Number,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
});

export const Commission=mongoose.model("Commission",commissionSchema)