import Spinner from "@/custom-components/Spinner";
import { getAuctionDetail } from "@/store/slices/auctionSlice";
import { placeBid } from "@/store/slices/bidSlice";
import React, { useEffect, useState } from "react";
import { FaGreaterThan } from "react-icons/fa";
import { RiAuctionFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

const AuctionItem = () => {
  const { id } = useParams();
  const { loading, auctionDetail, auctionBidders } = useSelector(
    (state) => state.auction
  );
  const { isAuthenticated } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const [amount, setAmount] = useState(0);

  const handleBid = () => {
    const formData = new FormData();
    formData.append("amount", amount);
    dispatch(placeBid(id, formData));
    dispatch(getAuctionDetail(id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
    }
    if (id) {
      dispatch(getAuctionDetail(id));
    }
  }, [isAuthenticated]);

  const biddersArray = auctionBidders
    ? Object.values(auctionBidders).sort((a, b) => b.amount - a.amount)
    : [];

  const highestBidder = biddersArray[0];
  const otherBidders = biddersArray.slice(1);

  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
        <div className="text-[16px] flex flex-wrap gap-2 items-center">
          <Link
            to="/"
            className="font-semibold transition-all duration-300 hover:text-[#D6482B]"
          >
            Home
          </Link>
          <FaGreaterThan className="text-stone-400" />
          <Link
            to={"/auctions"}
            className="font-semibold transition-all duration-300 hover:text-[#D6482B]"
          >
            Auctions
          </Link>
          <FaGreaterThan className="text-stone-400" />
          <p className="text-stone-600">{auctionDetail.title}</p>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="flex gap-4 flex-col lg:flex-row">
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex gap-4 flex-col lg:flex-row">
                <div className="bg-white w-[100%] lg:w-40 lg:h-40 flex justify-center items-center p-5">
                  <img
                    src={auctionDetail.image?.url}
                    alt={auctionDetail.title}
                  />
                </div>
                <div className="flex flex-col justify-around pb-4">
                  <h3 className="text-[#111] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">
                    {auctionDetail.title}
                  </h3>
                  <p className="text-xl font-semibold">
                    Condition:{" "}
                    <span className="text-[#D6482B]">
                      {auctionDetail.condition}
                    </span>
                  </p>
                  <p className="text-xl font-semibold">
                    Minimum Bid:{" "}
                    <span className="text-[#D6482B]">
                      Rs.{auctionDetail.startingBid}
                    </span>
                  </p>
                </div>
              </div>
              <p className="text-xl w-fit font-bold">
                Auction Item Description
              </p>
              <hr className="my-2 border-t-[1px] border-t-stone-700" />
              {auctionDetail.description &&
                auctionDetail.description.split(". ").map((element, index) => {
                  return (
                    <li key={index} className="text-[18px] my-2">
                      {element}
                    </li>
                  );
                })}
            </div>
            <div className="flex-1">
              <header className="bg-stone-200 py-4 text-[24px] font-semibold px-4">
                BIDS
              </header>
              <div className="bg-white px-4 min-h-fit lg:min-h-[400px] overflow-y-scroll">
                {Date.now() < new Date(auctionDetail.startTime) ? (
                  // Auction not started
                  <img
                    src="/notStarted.png"
                    alt="Auction Not Started Yet"
                    className="w-full max-h-[650px]"
                  />
                ) : Date.now() > new Date(auctionDetail.endTime) ? (
                  // Auction ended
                  biddersArray.length > 0 ? (
                    <>
                      {/* Winner Section */}
                      {highestBidder && (
                        <div className="py-2 flex items-center justify-between border-b-2 border-green-500">
                          <div className="flex flex-1 items-center gap-4">
                            <img
                              src={highestBidder.profileImage}
                              alt={highestBidder.userName}
                              className="w-12 h-12 rounded-full my-2"
                            />
                            <p className="text-[18px] font-semibold">
                              {highestBidder.userName}{" "}
                              <span className="text-green-600">(Winner)</span>
                            </p>
                          </div>
                          <p className="flex-1 text-center">
                            {highestBidder.amount}
                          </p>
                        </div>
                      )}

                      {/* Other Bidders */}
                      {otherBidders.map((element, index) => (
                        <div
                          key={index}
                          className="py-2 flex items-center justify-between"
                        >
                          <div className="flex flex-1 items-center gap-4">
                            <img
                              src={element.profileImage}
                              alt={element.userName}
                              className="w-12 h-12 rounded-full my-2 hidden md:block"
                            />
                            <p className="text-[18px] font-semibold">
                              {element.userName}
                            </p>
                          </div>
                          <p className="flex-1 text-center">{element.amount}</p>
                        </div>
                      ))}
                    </>
                  ) : (
                    // Auction ended with zero bidders
                    <p className="text-center text-xl font-semibold text-red-600 py-6">
                      The auction has ended with no bidders.
                    </p>
                  )
                ) : (
                  // Auction in progress
                  biddersArray.map((element, index) => (
                    <div
                      key={index}
                      className="py-2 flex items-center justify-between"
                    >
                      <div className="flex flex-1 items-center gap-4">
                        <img
                          src={element.profileImage}
                          alt={element.userName}
                          className="w-12 h-12 rounded-full my-2 hidden md:block"
                        />
                        <p className="text-[18px] font-semibold">
                          {element.userName}
                        </p>
                      </div>
                      {/* <p className="flex-1 text-center">{element.amount}</p> */}
                    </div>
                  ))
                )}
              </div>
              <div className="bg-[#D6482B] py-4 text-[16px] md:text-[24px] font-semibold px-4 flex items-center justify-between">
                {Date.now() >= new Date(auctionDetail.startTime) &&
                Date.now() <= new Date(auctionDetail.endTime) ? (
                  <>
                    <div className="flex gap-3 flex-col sm:flex-row sm:items-center">
                      <p className="text-white">Place Bid</p>
                      <input
                        type="number"
                        className="w-32 focus:outline-none md:text-[20px] p-1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <button
                      className="p-4 text-white bg-black rounded-full transition-all duration-300 hover:bg-[#222]"
                      onClick={handleBid}
                    >
                      <RiAuctionFill />
                    </button>
                  </>
                ) : new Date(auctionDetail.startTime) > Date.now() ? (
                  <p className="text-white font-semibold text-xl">
                    Auction has not started yet!
                  </p>
                ) : (
                  <p className="text-white font-semibold text-xl">
                    Auction has ended!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default AuctionItem;
