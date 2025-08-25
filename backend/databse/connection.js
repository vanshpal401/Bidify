import mongoose from "mongoose";

export const connection=()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"BIDIFY_DB"
    }).then(()=>{
        console.log("Database connected successfully");
    }).catch(err=>{
        console.log(`Some error Occurred while connecting ${err}`);
        
    })
}