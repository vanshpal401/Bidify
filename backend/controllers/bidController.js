import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Auction } from "../model/auctionSchema.js";
import { Bid } from "../model/bidSchema.js";
import { User } from "../model/userSchema.js";

export const placeBid = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction Item Not Found", 400));
  }
  const { amount } = req.body;

  if (!amount) {
    return next(new ErrorHandler("Please Place your Bid", 400));
  }

  if (amount <= auctionItem.currentBid) {
    return next(
      new ErrorHandler("Bid Amount Must be greater than the current Bid", 400)
    );
  }

  if (amount <= auctionItem.startingBid) {
    return next(
      new ErrorHandler("Bid Amount Must be greater than the Starting Bid", 400)
    );
  }

  try {
    const existingBid = await Bid.findOne({
      "bidder.id": req.user._id,
      auctionItem: auctionItem._id,
    });

    const existingBidInAuction = auctionItem.bids.find(
      (bid) => bid.userId.toString() == req.user._id.toString()
    );
    if (existingBid && existingBidInAuction) {
      existingBidInAuction.amount = amount;
      existingBid.amount = amount;
      await existingBidInAuction.save();
      await existingBid.save();

      auctionItem.currentBid = amount;
    } else {
      const bidderDetail = await User.findById(req.user._id);
      const bid = await Bid.create({
        amount,
        bidder: {
          id: bidderDetail._id,
          userName: bidderDetail.userName,
          profileImage: bidderDetail.profileImage?.public_url,
        },
        auctionItem: auctionItem._id,
      });

      auctionItem.bids.push({
        userId: req.user._id,
        userName: bidderDetail.userName,
        profileImage: bidderDetail.profileImage?.public_url,
        amount,
      });
    }
    auctionItem.currentBid = amount;
    await auctionItem.save();
    res.status(200).json({
      success: true,
      message: "Bid Placed",
      currentBid: auctionItem.currentBid,
    });
  } 
  catch (error) {
    return next(new ErrorHandler(error.message || "Failed to Place Bid", 500));
  }
});
