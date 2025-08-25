import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  deleteAuctionItem,
  getAllPaymentProof,
  getPaymentProofDetail,
  updateProofStatus,
  deletePaymentProof,
  fetchAllUser,
  monthlyRevenue,
  fetchAllUserData,
  deleteUserById,
  getUserById,
} from "../controllers/superAdminController.js";

const router = express.Router();

router.delete(
  "/auctionitem/delete/:id",
  isAuthenticated,
  isAuthorized("Super Admin"),
  deleteAuctionItem
);

router.get(
  "/paymentproofs/getall",
  isAuthenticated,
  isAuthorized("Super Admin"),
  getAllPaymentProof
);

router.get(
  "/paymentproof/get/:id",
  isAuthenticated,
  isAuthorized("Super Admin"),
  getPaymentProofDetail
);

router.put(
  "/paymentproof/status/update/:id",
  isAuthenticated,
  isAuthorized("Super Admin"),
  updateProofStatus
);

router.delete(
  "/paymentproof/delete/:id",
  isAuthenticated,
  isAuthorized("Super Admin"),
  deletePaymentProof
);

router.get(
  "/user/getall",
  isAuthenticated,
  isAuthorized("Super Admin"),
  fetchAllUser
);

router.get(
  "/monthlyincome",
  isAuthenticated,
  isAuthorized("Super Admin"),
  monthlyRevenue
);

router.get(
  "/user/allusers",
  isAuthenticated,
  isAuthorized("Super Admin"),
  fetchAllUserData
);

router.delete(
  "/user/delete/:id",
  isAuthenticated,
  isAuthorized("Super Admin"),
  deleteUserById
);
router.get(
  "/user/:id",
  isAuthenticated,
  isAuthorized("Super Admin"),
  getUserById
);

export default router;
