require('dotenv').config();
const express = require("express");
const cookieParse = require("cookie-parser")
const {connectDB} = require("./config/database");
const {authRouter} = require("./routers/authRouter");
const {connectionRouter} = require("./routers/connectionRouter");
const { profileRouter } = require('./routers/profileRouter');




const app = express();

app.use(cookieParse());
app.use("/",express.json());

app.use("/",authRouter);
app.use("/",connectionRouter);
app.use("/",profileRouter);




connectDB().then(async()=>{
    console.log("Database Connected successfully");
    app.listen(7777,()=>{
        console.log("server is listening on port 7777");
    })
}).catch((err)=>{
   console.error(`Error Occur:
                 ${err}`);
   
})



