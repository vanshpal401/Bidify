import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { checkAuctionEndTime } from "../middlewares/checkAuctionEndTime.js";
import { placeBid } from "../controllers/bidController.js";

const router = express.Router();
router.post("/placebid/:id", isAuthenticated, isAuthorized("Bidder"),checkAuctionEndTime,placeBid);

export default router;