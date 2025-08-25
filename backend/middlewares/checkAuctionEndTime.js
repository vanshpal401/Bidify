import mongoose from "mongoose";
import { Auction } from "../model/auctionSchema.js";
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";

export const checkAuctionEndTime = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format", 400));
  }
  const auction = await Auction.findById(id);
  if (!auction) {
    return next(new ErrorHandler("No Auction Found", 404));
  }
  const now = new Date();
  if (new Date(auction.startTime) > now) {
    return next(new ErrorHandler("Auction Not Started yet", 400));
  }
  if (new Date(auction.endTime) < now) {
    return next(new ErrorHandler("Auction is Ended", 400));
  }
  next();
});
