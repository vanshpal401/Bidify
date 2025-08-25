import ErrorHandler from "../middlewares/error.js";
import { User } from "../model/userSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { v2 as cloudinary } from "cloudinary"; // For image upload
import { generateToken } from "../utils/jwtToken.js"; // For token generation

// Register User

export const register = catchAsyncError(async (req, res,next) => {
  if (!req.files) {
    return next(new ErrorHandler("Profile Image required", 400));
  }
  
  const { profileImage } = req.files;

  
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(profileImage.mimetype)) {
    return next(new ErrorHandler("File Format not Supported", 400));
  }

  const {
    userName,
    email,
    password,
    address,
    phone,
    role,
    bankAccountNumber,
    bankName,
    ifscCode,
    upiId,
    paypalEmail,
  } = req.body;

  if (!userName || !email || !password || !address || !role ||!phone)  {
    return next(new ErrorHandler("Please Provide the proper Details", 400));
  }

  if (role === "Auctioneer") {
    if (!bankAccountNumber || !bankName || !ifscCode) {
      return next(
        new ErrorHandler(
          "To be an Auctioneer.. You have to provide the bank Details",
          400
        )
      );
    }
    if (!upiId ) {
      return next(new ErrorHandler("Please provide your UPI details", 400));
    }
    if (!paypalEmail) {
      return next(new ErrorHandler("Please provide your UPI details", 400));
    }
  }

  const isRegistered = await User.findOne({ email });
  const isRegisteredPhone=await User.findOne({phone});
  if (isRegistered) {
    return next(new ErrorHandler("User Already Registered", 400));
  }

  if(isRegisteredPhone)
  {
    return next(new ErrorHandler("Phone Number already Exist", 400));
  }
  // Upload the profile image to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(
    profileImage.tempFilePath,
    {
      folder: "Bidify Users",
    }
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error("Cloudinary error:", cloudinaryResponse.error || "Unknown error");
    return next(new ErrorHandler("Failed to upload profile Image to cloudinary", 400));
  }


  const user = await User.create({
    userName,
    email,
    password,
    phone,
    address,
    role,
    profileImage: {
      public_id: cloudinaryResponse.public_id,
      public_url: cloudinaryResponse.secure_url,
    },
    paymentMethod: {
      bankTransfer: { bankAccountNumber, bankName, ifscCode },
      upiPayments: { upiId },
      payPal: { paypalEmail },
    },
  });
  
  generateToken(user, "User Registered Successfully", 201, res);
});

// Login User
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please fill in all the details", 400));
  }

  // Find user by email
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 400));
  }

  // Compare entered password with stored password
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid credentials", 400));
  }

  // Generate JWT token
  generateToken(user, "Login successful", 200, res);
});

// Get Profile
export const getProfile = catchAsyncError(async (req, res, next) => {
  // 'req.user' contains the authenticated user (set by the 'isAuthenticated' middleware)
  const user = req.user;

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user, // Returning the user object
  });
});

// Logout User
export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token","", {
      expires: new Date(Date.now()), // Expire the cookie immediately
      httpOnly: true, // To prevent access via JavaScript
    })
    .json({
      success: true,
      message: "Logout successfully",
    });
});

// Fetch Leaderboard
export const fetchLeaderboard = catchAsyncError(async (req, res, next) => {
  const users = await User.find({ moneySpent: { $gt: 0 } });

  // Sort users by moneySpent in descending order
  const leaderboard = users.sort((a, b) => b.moneySpent - a.moneySpent);

  res.status(200).json({
    success: true,
    leaderboard,
  });
});



