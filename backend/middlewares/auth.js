import { User } from "../model/userSchema.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";
import { catchAsyncError } from "./catchAsyncError.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new ErrorHandler("User not Authenticate", 400));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);
  next();
});


export const isAuthorized=(...roles)=>{
    return (req,res,next)=>{
      if(!roles.includes(req.user.role))
      {
        return next(new ErrorHandler(`${req.user.role} not Allowed to access this resources`,403));
      }
      next();
    };
}