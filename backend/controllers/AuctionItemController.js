import { Auction } from "../model/auctionSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import { User } from "../model/userSchema.js";
import { Bid } from "../model/bidSchema.js";

// Adding the New Item By the Auctioneer
export const addNewAuctionItem = catchAsyncError(async (req, res, next) => {
  // Check if image is uploaded
  if (!req.files) {
    return next(new ErrorHandler("Auction Item Image is required", 400));
  }

  const { image } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(image.mimetype)) {
    return next(new ErrorHandler("File Format not Supported", 400));
  }

  const {
    title,
    description,
    category,
    condition,
    startingBid,
    startTime,
    endTime,
  } = req.body;

  // Ensure all required fields are provided
  if (
    !title ||
    !description ||
    !category ||
    !condition ||
    !startingBid ||
    !startTime ||
    !endTime
  ) {
    return next(new ErrorHandler("Please provide all details", 400));
  }

  // Validate the start time and end time
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  if (startDate < Date.now()) {
    return next(
      new ErrorHandler(
        "Auction start time must be greater than the current time",
        400
      )
    );
  }
  if (endDate <= startDate) {
    return next(
      new ErrorHandler("Auction end time must be after the start time", 400)
    );
  }

  // Check if the user already has an active auction
  const alreadyActiveAuction = await Auction.findOne({
    createdBy: req.user._id,
    endTime: { $gt: new Date() }, // Active auctions will have end time in the future
  });

  if (alreadyActiveAuction) {
    return next(new ErrorHandler("You already have an active auction", 400));
  }

  try {
    // Upload image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
      image.tempFilePath,
      {
        folder: "Bidify Auction Items",
      }
    );

    if (cloudinaryResponse.error) {
      return next(
        new ErrorHandler(
          "Failed to upload auction item image to Cloudinary",
          500
        )
      );
    }

    // Create the auction item in the database
    const auctionItem = await Auction.create({
      title,
      description,
      category,
      condition,
      startingBid,
      startTime,
      endTime,
      image: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
      createdBy: req.user._id,
    });

    // Respond with success message
    return res.status(201).json({
      success: true,
      message: `Auction item created and will be listed in the auction starting at ${startTime}`,
      auctionItem,
    });
  } catch (error) {
    return next(
      new ErrorHandler(error.message || "Failed to create auction item", 500)
    );
  }
});

// Get All the Auction Item Present in database

export const getAllItems = catchAsyncError(async (req, res, next) => {
  let items = await Auction.find();
  res.status(200).json({
    success: true,
    items,
  });
});

// Getting all the item that is Publish by the current user
export const getMyAuctionItems = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  let items = await Auction.find({ createdBy: userId });
  if (items.length === 0) {
    res.status(200).json({
      success: true,
      message: "No items found for this user.",
      items: [],
    });
  }
  res.status(200).json({
    success: true,
    items,
  });
});

// Getting the auction Detail by Auction id
export const getAuctionDetails = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid id formet", 400));
  }
  const auctionItem = await Auction.findById(id);

  if (!auctionItem) {
    return next(new ErrorHandler("Auction item with id is Not Exist", 400));
  }

  const bidders = auctionItem.bids.sort((a, b) => a.amount - b.amount);
  res.status(200).json({
    success: true,
    auctionItem,
    bidders,
  });
});

// Removing the  Auction Item
export const removeFromAuction = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid id formet", 400));
  }
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction item with id is Not Exist", 400));
  }
  try {
    await cloudinary.uploader.destroy(auctionItem.image.public_id); 
  } catch (error) {
    console.error('Error deleting image:', error);
  }
  await auctionItem.deleteOne();
  res.status(200).json({
    success: true,
    message: "Auction item Deleted Succesfully",
  });
});

// Republishing the item
export const republishItem = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid id formet", 400));
  }

  let auctionItem = await Auction.findById(id);
  
  
  if (!auctionItem) {
    return next(new ErrorHandler("Auction item with id is Not Exist", 400));
  }
  if (!req.body.startTime || !req.body.endTime) {
    return next(
      new ErrorHandler(
        "Start Time and End time of Republish Item is Mandatory",
        400
      )
    );
  }


  if (new Date(auctionItem.endTime )> Date.now()) {
    return next(
      new ErrorHandler("Auction is Already active,cannot be republished", 400)
    );
  }


  let data = {
    startTime: new Date(req.body.startTime),
    endTime: new Date(req.body.endTime),
  };


  if (data.startTime < Date.now()) {
    return next(
      new ErrorHandler(
        "Auction Starting Time must be greater the current Time",
        400
      )
    );
  }
  if (data.startTime >= data.endTime) {
    return next(
      new ErrorHandler("Auction Starting Time must be lesser the End Time", 400)
    );
  }


  if(auctionItem.highestBiddder)
  {
    const highestBidder=await User.findById(auctionItem.highestBiddder);
    highestBidder.moneySpent-=auctionItem.currentBid;
    highestBidder.auctionWon-=1;
    highestBidder.save();
  }
  data.bids = [];
  data.commissionCalculated = false;
  data.currentBid=0;
  data.highestBiddder=null;
  auctionItem = await Auction.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });


  await Bid.deleteMany({auctionItem:auctionItem._id});

  const createdBy = await User.findByIdAndUpdate(
    req.user._id,
    { unpaidCommissions: 0 },
    {
      new: true,
      runValidators: false,
      useFindAndModify: false,
    }
  );

  await createdBy.save();
  res.status(200).json({
    success: true,
    auctionItem,
    message: `Auction republished and Will be active on ${req.body.startTime}`,
  });
});
