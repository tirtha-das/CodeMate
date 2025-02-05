require('dotenv').config();
const express = require("express");
const {connectDB} = require("./config/database");
const {authRouter} = require("./routers/auth");




const app = express();

app.use("/",express.json())

app.use("/",authRouter);




connectDB().then(async()=>{
    console.log("Database Connected successfully");
    app.listen(7777,()=>{
        console.log("server is listening on port 7777");
    })
}).catch((err)=>{
   console.error(`Error Occur:
                 ${err}`);
   
})



