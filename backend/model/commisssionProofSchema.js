import mongoose from "mongoose";

const paymentProofSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    proof:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        },
    },
    uploadedAt:{
        type:Date,
        default:Date.now(),
    },
    transactionId:{
        type:String,
    },
    status:{
        type:String,
        default:"Pending",
        enum:["Pending","Approved","Rejected","Settled"],
    },
    amount:{
        type:Number,
        required:true,
    },
    comment:String,

});
export const PaymentProof=mongoose.model("PaymentProof",paymentProofSchema);