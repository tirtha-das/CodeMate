require('dotenv').config();
const express = require("express");
const {connectDB} = require("./config/database");
const { User } = require("./models/userModel");



const app = express();


connectDB().then(async()=>{
    console.log("Database Connected successfully");
    app.listen(7777,()=>{
        console.log("server is listening on port 7777");
    })
}).catch((err)=>{
   console.error(`Error Occur:
                 ${err}`);
   
})



