import mongoose from "mongoose";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Auction } from "../model/auctionSchema.js";
import { Commission } from "../model/commissionSchema.js";
import { PaymentProof } from "../model/commisssionProofSchema.js";
import { User } from "../model/userSchema.js";

// Deleteing the Item
export const deleteAuctionItem = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid id formet", 400));
  }
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction item with id is Not Exist", 400));
  }
  await auctionItem.deleteOne();
  res.status(200).json({
    success: true,
    message: "Auction item Deleted Succesfully",
  });
});

// Getting all payment proof
export const getAllPaymentProof = catchAsyncError(async (req, res, next) => {
  let paymentProofs = await PaymentProof.find();
  res.status(200).json({
    success: true,
    paymentProofs,
  });
});

// Getting the Payent Details By id
export const getPaymentProofDetail = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const paymentProofDetail = await PaymentProof.findById(id);
  res.status(200).json({
    success: true,
    paymentProofDetail,
  });
});

// Updating the Payment Status
export const updateProofStatus = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { amount, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid User ID", 400));
  }

  let proof = await PaymentProof.findById(id);
  if (!proof) {
    return next(new ErrorHandler("Payment Proof Not Available", 400));
  }
  proof = await PaymentProof.findByIdAndUpdate(
    id,
    { status, amount },
    { new: true, runValidators: true, useFindAndModify: true }
  );

  res.status(200).json({
    success: true,
    message: "Payment proof Amount and status Updated",
    proof,
  });
});

export const deletePaymentProof = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const proof = await PaymentProof.findById(id);

  if (!proof) {
    return next(new ErrorHandler("Payment Proof Not Found", 400));
  }
  await proof.deleteOne();
  res.status(200).json({
    sucsess: true,
    message: "Payment Proof Delete Suucessfully",
  });
});

export const fetchAllUser = catchAsyncError(async (req, res, next) => {
  const users = await User.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          role: "$role",
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        month: "$_id.month",
        year: "$_id.year",
        role: "$_id.role",
        count: 1,
        _id: 0,
      },
    },
    {
      $sort: { year: 1, month: 1 },
    },
  ]);
  const bidder = users.filter((user) => user.role === "Bidder");
  const auctioneer = users.filter((user) => user.role === "Auctioneer");

  const transformDataToMonthlyArray = (data, totalMonth = 12) => {
    const result = Array(totalMonth).fill(0);
    data.forEach((item) => {
      result[item.month - 1] = item.count;
    });

    return result;
  };
  const bidderArray = transformDataToMonthlyArray(bidder);
  const auctioneerArray = transformDataToMonthlyArray(auctioneer);

  res.status(200).json({
    success: true,
    bidderArray,
    auctioneerArray,
  });
});

export const fetchAllUserData = catchAsyncError(async (req, res, next) => {
  const user = await User.find().sort({ createdAt: -1 });
  if (!user) {
    return next(ErrorHandler("No User Registered", 400));
  }
  res.status(200).json({
    message: "All User Fetched Successfully",
    user,
  });
});

export const monthlyRevenue = catchAsyncError(async (req, res, next) => {
  const payments = await Commission.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);
  const transformDataToMonthlyArray = (payments, totalMonth = 12) => {
    const result = Array(totalMonth).fill(0);
    payments.forEach((payment) => {
      result[payment._id.month - 1] = payment.totalAmount;
    });

    return result;
  };

  const totalMonthlyRevenue = transformDataToMonthlyArray(payments);
  res.status(200).json({
    success: true,
    totalMonthlyRevenue,
  });
});

export const deleteUserById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid id format", 400));
  }
  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler("User with this id does not exist", 400));
  }
  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

export const getUserById = catchAsyncError(async (req, res,next) => {
  const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
     return next(new ErrorHandler("No user Found",400))
    }
    res.status(200).json({
      success: true,
      user,
    });
  }
);
