import otpGenerator from "otp-generator";
import { OTP } from "../model/otpSchema.js";
import { User } from "../model/userSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { sendEmail } from "../utils/sendEmail.js";

export const sendOtp = catchAsyncError(async (req, res, next) => {
    try {
      const { email } = req.body;  
      if (!email) {
        return next(new ErrorHandler("Please Enter your Email Address"));
      }
      const checkUserPresent = await User.findOne({ email });
      if (checkUserPresent) {
        return next(new ErrorHandler("User Already Registered", 400));
      }
  

      await OTP.deleteMany({ email });
      
      let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
  
      let result = await OTP.findOne({ otp: otp });
      while (result) {
        otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        });
        result = await OTP.findOne({ otp: otp });
      }
  
      const otpBody = await OTP.create({
        email: email,
        otp: otp,
      });
  
      const subject = `Email Verification For Bidify Registration`;
      const message = `Verification Email\n\nPlease confirm Your OTP\nHere is your OTP ${otp}\n\nThis Otp is valid fo 10 minutes only.. \n\n\nBidify Team`;

      const info=await sendEmail({ email: email, subject, message });
  
      res.status(200).json({
        message: "Otp created and sent successfully",
        otp,
      });
    } catch (error) {
        throw new Error("Error In Otp creation");
    }
  });

  export const verifyOtp = catchAsyncError(async (req, res, next) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return next(new ErrorHandler("Please provide both email and OTP", 400));
      }

      const otpRecord = await OTP.findOne({ email });

      if (!otpRecord) {
        return next(new ErrorHandler("No OTP sent to this email", 400));
      }

      const otpExpirationTime = 5 * 60 * 1000;
      if (Date.now() > otpRecord.createdAt + otpExpirationTime) {
        return next(new ErrorHandler("OTP has expired", 400));
      }

      if (otpRecord.otp !== otp) {
        return next(new ErrorHandler("Invalid OTP", 400));
      }

      await OTP.deleteOne({ email });

      res.status(200).json({
        message: "OTP verified successfully",
      });
    } catch (error) {
      return next(new ErrorHandler("Error in OTP verification", 500));
    }
  });

  
