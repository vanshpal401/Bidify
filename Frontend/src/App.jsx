import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";
import SideDrawer from "./layout/SideDrawer";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "./pages/Signup";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Login from "./pages/Login";
import SubmitCommission from "./pages/SubmitCommission";
import UserProfile from "./pages/UserProfile";
import { useDispatch } from "react-redux";
import { fetchUser, leaderboard } from "./store/slices/userSlice";
import { getAllAuctionItems } from "./store/slices/auctionSlice";
import Leaderboard from "./pages/Leaderboard";
import ViewMyAuctions from "./pages/ViewMyAuctions";
import ViewAuctionDetails from "./pages/ViewAuctionDetails";
import CreateAuction from "./pages/CreateAuction";
import Auctions from "./pages/Auctions";
import AuctionItem from "./pages/AuctionItems";
import Dashboard from "./pages/Dashboard/Dashboard";
import UserDetails from "./pages/UserDetails";
import AuctionItemDelete from "./pages/Dashboard/sub-components/AuctionItemDelete";
import PaymentGraph from "./pages/Dashboard/sub-components/PaymentGraph";
import UserDataAndGraph from "./pages/Dashboard/sub-components/UserDataAndGraph";
import PaymentProofs from "./pages/Dashboard/sub-components/PaymentProofs";
import Contact from "./pages/Contact";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
    dispatch(getAllAuctionItems());
    dispatch(leaderboard());
  }, []);
  return (
    <Router>
      <SideDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/me" element={<UserProfile />} />
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/create-auction" element={<CreateAuction />} />
        <Route path="/my-auctions" element={<ViewMyAuctions />} />
        <Route path="/auction/item/:id" element={<AuctionItem />} />
        <Route path="/auction/details/:id" element={<ViewAuctionDetails />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/submit-commission" element={<SubmitCommission />} />
        <Route path="/how-it-works-info" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user/details/:id" element={<UserDetails />} />
        <Route path="/dashboard/monthly-revenue" element={<PaymentGraph />} />
        <Route path="/dashboard/users" element={<UserDataAndGraph />} />
        <Route path="/dashboard/payment-proofs" element={<PaymentProofs />} />
        <Route
          path="/dashboard/delete-auction-items"
          element={<AuctionItemDelete />}
        />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <ToastContainer position="top-right" />
    </Router>
  );
};

export default App;
