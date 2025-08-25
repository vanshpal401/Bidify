import cron from "node-cron";
import { PaymentProof } from "../model/commisssionProofSchema.js";
import { User } from "../model/userSchema.js";
import { Commission } from "../model/commissionSchema.js";
import { sendEmail } from "../utils/sendEmail.js";

export const verifyCommissionCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("Cron for verify commission running");

    const approvedProofs = await PaymentProof.find({ status: "Approved" });

    for (const proof of approvedProofs) {
      try {
        const user = await User.findById(proof.userId);

        if (user) {
          let updatedUserData;
          
          if (user.unpaidCommissions >= proof.amount) {
            updatedUserData = await User.findByIdAndUpdate(
              user._id,
              {
                $inc: {
                  unpaidCommissions: -proof.amount,
                },
              },
              { new: true }
            );
          } else {
            updatedUserData = await User.findByIdAndUpdate(
              user._id,
              {
                unpaidCommissions: 0,
              },
              { new: true }
            );
          }

          await PaymentProof.findByIdAndUpdate(proof._id, {
            status: "Settled",
          });
          await Commission.create({ amount: proof.amount, user: user._id });

          const settlementDate = new Date(Date.now())
            .toString()
            .substring(0, 15);

          console.log("Verify Auction completed");

          const subject =
            "Your Payment Has been Successfully Verified and Settled";
          const message = `Dear ${user.userName}, \n\nWe are pleased to inform you that your recent payment has been successfully verified and settled. Thank you for promptly providing the necessary proof of payment. Your account has been updated, and you can now proceed with your activities on our platform without any restrictions.\n\nPayment Details: \nAmount Settled: ${proof.amount}\nUnpaid Amount: ${updatedUserData.unpaidCommissions}\nDate of Settlement: ${settlementDate}\n\nBest regards, \nBidify Auction Team`;

          sendEmail({ email: user.email, subject, message });

          console.log(`User ${proof.userId} paid commission of ${proof.amount}`);
        } else {
          console.error(`User not found for proof ID ${proof._id}`);
        }
      } catch (error) {
        console.error(
          `Error processing commission proof for user ${proof.userId}: ${error.message}`
        );
      }
    }
  });
};
