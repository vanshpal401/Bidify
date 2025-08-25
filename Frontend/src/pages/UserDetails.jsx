import Spinner from "@/custom-components/Spinner";
import { getUserDetails } from "@/store/slices/superAdminSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UserDetails = () => {
  const { id } = useParams();
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { fetchedUser, loading } = useSelector((state) => state.superAdmin);

  useEffect(() => {
    if (!isAuthenticated || user.role !== "Super Admin") {
      navigateTo("/");
    } else {
      console.log(fetchedUser);
      
      dispatch(getUserDetails(id));
    }
  }, [isAuthenticated, user.role, id, dispatch, navigateTo]);

  if (loading) {
    return <Spinner />;
  }

  if (!fetchedUser) {
    return <p className="text-center mt-10 text-gray-500">User details not found.</p>;
  }

  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-start">
      <div className="bg-white mx-auto w-full h-auto px-2 flex flex-col gap-4 items-center py-4 justify-center rounded-md">
        <img
          src={fetchedUser.profileImage?.public_url || "/default-profile.png"}
          alt="User Profile"
          className="w-36 h-36 rounded-full"
        />

        <div className="mb-6 w-full">
          <h3 className="text-xl font-semibold mb-4">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Username" value={fetchedUser.userName} />
            <InfoField label="Email" value={fetchedUser.email} />
            <InfoField label="Phone" value={fetchedUser.phone} />
            <InfoField label="Address" value={fetchedUser.address} />
            <InfoField label="Role" value={fetchedUser.role} />
            <InfoField
              label="Joined On"
              value={fetchedUser.createdAt?.substring(0, 10)}
            />
          </div>
        </div>

        {fetchedUser.role === "Auctioneer" && (
          <DetailsSection title="Payment Details">
            <InfoField
              label="Bank Name"
              value={fetchedUser.paymentMethod?.bankTransfer?.bankName}
            />
            <InfoField
              label="Bank Account"
              value={fetchedUser.paymentMethod?.bankTransfer?.bankAccountNumber}
            />
            <InfoField label="User Name On Bank Account" value={fetchedUser.userName} />
            <InfoField
              label="UPI ID"
              value={fetchedUser.paymentMethod?.upiPayments?.upiId}
            />
            <InfoField
              label="Paypal Email"
              value={fetchedUser.paymentMethod?.payPal?.paypalEmail}
            />
          </DetailsSection>
        )}

        <DetailsSection title="Other User Details">
          {fetchedUser.role === "Auctioneer" && (
            <InfoField
              label="Unpaid Commissions"
              value={fetchedUser.unpaidCommissions}
            />
          )}
          {fetchedUser.role === "Bidder" && (
            <>
              <InfoField label="Auctions Won" value={fetchedUser.auctionWon} />
              <InfoField label="Money Spent" value={fetchedUser.moneySpent} />
            </>
          )}
        </DetailsSection>
      </div>
    </section>
  );
};

// Reusable InfoField Component
const InfoField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="text"
      value={value || "N/A"}
      className="w-full mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
      disabled
    />
  </div>
);

// Reusable DetailsSection Component
const DetailsSection = ({ title, children }) => (
  <div className="mb-6 w-full">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

export default UserDetails;
