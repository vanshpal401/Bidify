import mongoose from "mongoose";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Auction } from "../model/auctionSchema.js";
import { PaymentProof } from "../model/commisssionProofSchema.js";
import { User } from "../model/userSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const proofOfCommission = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Payment Proof ScreenShot Required", 400));
  }
  const { proof } = req.files;
  const { amount, comment, transactionId } = req.body;

  const user = await User.findById(req.user._id);

  if (!amount || !comment || !transactionId) {
    return next(
      new ErrorHandler("Amount, Comment,Transaction id is required", 400)
    );
  }

  if (user.unpaidCommissions == 0) {
    return res.status(200).json({
      success: true,
      message: "You have no Unpaid Commission",
    });
  }

  if (user.unpaidCommissions < amount) {
    return next(
      new ErrorHandler(
        `The Amount Exceeds your Unpaid Commission Balance.Please Enter the amount Upto ${user.unpaidCommissions}`
      ),
      403
    );
  }



  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(proof.mimetype)) {
    return next(new ErrorHandler("Screenshot Format not Supported", 400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    proof.tempFilePath,
    {
      folder: "Payment Proofs",
    }
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error("Cloudinary error:", cloudinaryResponse.error || "Unknown error");
    return next(new ErrorHandler("Failed to upload profile Image to cloudinary", 400));
  }

  const commissionProof=await PaymentProof.create({
    userId:req.user._id,
    proof:{
        public_id:cloudinaryResponse.public_id,
        url:cloudinaryResponse.secure_url,
    },
    amount,
    comment,
    transactionId,
  })

  res.status(200).json({
    success:true,
    message:"Your Payment Proof has been submmited Succesfully we will review it and respond to you within 24 hour",
    commissionProof,
  });

});

export const calculateCommission=async (auctionId)=>{
  const auction=await Auction.findById(auctionId);
  if(!mongoose.Types.ObjectId.isValid(auctionId))
  {
    return next(new ErrorHandler("Invalid Auction Id Formet",400));
  }
  const commissionRate=0.05;
  const commission=auction.currentBid * commissionRate;
  const user=await User.findById(auction.createdBy);
  return commission;
}
