import cron from "node-cron";
import { Auction } from "../model/auctionSchema.js";
import { Bid } from "../model/bidSchema.js";
import { calculateCommission } from "../controllers/commissionController.js";
import { User } from "../model/userSchema.js";
import { sendEmail } from "../utils/sendEmail.js";

export const endedAuctionCron = () => {
  //  min hour days month year
  cron.schedule("*/1 * * * *", async () => {
    const now=new Date();
    console.log("Cron for ender auction running");
    
    const endedAuction = await Auction.find({
      endTime: { $lt: now },
      commissionCalculated: false,
    });
    for (const auction of endedAuction) {
      try {
        const commissionAmount = await calculateCommission(auction._id);
        auction.commissionCalculated = true;
        const highestBidder = await Bid.findOne({
          auctionItem: auction._id,
          amount: auction.currentBid,
        });

        const auctioneer = await User.findById(auction.createdBy);
        auctioneer.unpaidCommissions = commissionAmount;

        if (highestBidder) {
          auction.highestBiddder = highestBidder.bidder.id;
          await auction.save();
          const bidder = await User.findById(highestBidder.bidder.id);
          //  const highestBidAmount=bidder.moneySpent+highestBidder.amount;
          await User.findByIdAndUpdate(
            bidder._id,
            {
              $inc: {
                moneySpent: highestBidder.amount,
                auctionWon: 1,
              },
            },
            { new: true }
          );
          await User.findByIdAndUpdate(
            auctioneer._id,
            {
              $inc: {
                unpaidCommissions: commissionAmount,
              },
            },
            { new: true,}
          );
          console.log("Ended Auction completed");
          
          
          const subject=`Congratulation! You Won the Auction for ${auction.title}`;
          const message=`Dear ${bidder.userName}, \n\nCongratulations! You have won the auction for ${auction.title}. \n\nBefore proceeding for payment contact your auctioneer via your auctioneer email:${auctioneer.email} \n\nPlease complete your payment using one of the following methods: \n\n1. **Bank Transfer**: \n- Account Name: ${auctioneer.paymentMethod.bankTransfer.bankName} \n- Account Number: ${auctioneer.paymentMethod.bankTransfer.bankAccountNumber} \n- Bank: ${auctioneer.paymentMethod.bankTransfer.bankName}\n\n2. **UPI**:\n- You can send payment via UPI: ${auctioneer.paymentMethod.upiPayments.upiId}\n\n3. **PayPal**:\n- Send payment to: ${auctioneer.paymentMethods.paypal.paypalEmail}\n\n4. **Cash on Delivery (COD)**:\n- If you prefer COD, you must pay 20% of the total amount upfront before delivery.\n- To pay the 20% upfront, use any of the above methods.\n- The remaining 80% will be paid upon delivery.\n- If you want to see the condition of your auction item then send your email on this: ${auctioneer.email}\n\nPlease ensure your payment is completed by [Payment Due Date]. Once we confirm the payment, the item will be shipped to you.\n\nThank you for participating!\n\nBest regards, \nBidify Auction Team`;
          


          sendEmail({email:bidder.email,subject,message});
          console.log("Email sended Succesully");

          
        }
        else
        {
            await auction.save();
        }
      } catch (error) {
        return next(console.error(error || "Some Error is ended auction cron"));
      }
    }
  });
};
