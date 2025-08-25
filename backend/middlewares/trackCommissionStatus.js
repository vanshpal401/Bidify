import { User } from "../model/userSchema.js";
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";

export const trackCommissionStatus = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user.unpaidCommissions > 0) {
    return next(
      new ErrorHandler(
        "You have Unpaid Commission. Please pay then before posting a new Auction",
        400
      )
    );
  }
  next();
});
