import {
  clearAllSuperAdminSliceErrors,
  getAllPaymentProofs,
  getAllUsers,
  getMonthlyRevenue,
} from "@/store/slices/superAdminSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "@/custom-components/Spinner";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const { loading } = useSelector((state) => state.superAdmin);

  useEffect(() => {
    dispatch(getMonthlyRevenue());
    dispatch(getAllUsers());
    dispatch(getAllPaymentProofs());
    dispatch(clearAllSuperAdminSliceErrors());
  }, []);

  const { user, isAuthenticated } = useSelector((state) => state.user);
  useEffect(() => {
    if (user.role !== "Super Admin" || !isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated]);

  // Navigation handler
  const handleNavigation = (route) => {
    navigateTo(route);
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col gap-10">
          <h1
            className={`text-[#d6482b] text-2xl font-bold mb-4 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl text-center`}
          >
            Dashboard
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <div
              className="bg-white shadow-lg rounded-lg p-8 cursor-pointer hover:bg-gray-200 transition-all duration-300"
              onClick={() => handleNavigation("/dashboard/monthly-revenue")}
            >
              <h3 className="text-xl font-semibold text-[#111] text-center">
                Monthly Total Payments Received
              </h3>
            </div>
            <div
              className="bg-white shadow-lg rounded-lg p-8 cursor-pointer hover:bg-gray-200 transition-all duration-300"
              onClick={() => handleNavigation("/dashboard/users")}
            >
              <h3 className="text-xl font-semibold text-[#111] text-center">
                Users
              </h3>
            </div>

            <div
              className="bg-white shadow-lg rounded-lg p-8 cursor-pointer hover:bg-gray-200 transition-all duration-300"
              onClick={() => handleNavigation("/dashboard/payment-proofs")}
            >
              <h3 className="text-xl font-semibold text-[#111] text-center">
                Payment Proofs
              </h3>
            </div>

            <div
              className="bg-white shadow-lg rounded-lg p-8 cursor-pointer hover:bg-gray-200 transition-all duration-300"
              onClick={() =>
                handleNavigation("/dashboard/delete-auction-items")
              }
            >
              <h3 className="text-xl font-semibold text-[#111] text-center">
                Delete Items From Auction
              </h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
