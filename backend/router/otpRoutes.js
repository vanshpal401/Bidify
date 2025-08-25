import express from "express"
import { sendOtp, verifyOtp } from "../controllers/otpController.js";


const router=express.Router();

router.post("/sendotp",sendOtp);
router.post("/verifyotp",verifyOtp);

export default router;