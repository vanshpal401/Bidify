import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { connection } from "./databse/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./router/userRoutes.js"
import auctionItemRouter from "./router/auctionItemsRoutes.js"
import bidRouter from "./router/bidRoutes.js"
import otpRouter from "./router/otpRoutes.js"
import superAdminRouter from "./router/superAdminRoutes.js"
import commissionRouter from "./router/commissionRoutes.js"
import { verifyCommissionCron } from "./automation/verifyCommissionCron.js";
import {endedAuctionCron} from "./automation/endedAuctionCron.js";


const app=express();

config({
    path:"./config/config.env",
})

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    method:["POST","GET","PUT","DELETE"],
    credentials:true,
}))

app.use(cookieParser());
app.use(express.json());


app.use(express.urlencoded({extended:true}));

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/",
}))

app.use("/api/v1/user",userRouter)

app.use("/api/v1/auctionitem",auctionItemRouter);

app.use("/api/v1/bid",bidRouter);

app.use("/api/v1/commission",commissionRouter);

app.use("/api/v1/superadmin",superAdminRouter);

app.use("/api/v1/register",otpRouter);



endedAuctionCron();
verifyCommissionCron();
 
connection();

app.use(errorMiddleware)




export default app;