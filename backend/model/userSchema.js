import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    minlength: [3, "Username must contain more than 3 characters"],
    maxlength: [40, "Username cannot exceed 40 characters"],
  },
  password: {
    type: String,
    select: false,
    minlength: [8, "Password must contain more than 8 characters"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: String,
  phone: {
    type: String,
    minlength: [10, "Phone number must have 10 digits"],
    maxlength: [10, "Phone number must have 10 digits only"],
  },
  profileImage: {
    public_id: {
      type: String,
      required: true,
    },
    public_url: {
      type: String,
      required: true,
    },
  },
  paymentMethod: {
    bankTransfer: {
      bankAccountNumber: String,
      bankName: String,
      ifscCode: String,
    },
    upiPayments: {
      upiId: String,
    },
    payPal: {
      paypalEmail: String,
    },
  },
  role: {
    type: String,
    enum: ["Auctioneer", "Bidder", "Super Admin"],
    required: true,
  },
  unpaidCommissions: {
    type: Number,
    default: 0,
  },
  auctionWon: {
    type: Number,
    default: 0,
  },
  moneySpent: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Storing the password in hash value
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Comparing the password with the database
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generating JWT Token
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);
