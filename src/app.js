require('dotenv').config();
const express = require("express");
const cookieParse = require("cookie-parser");
const cors = require("cors");
const {connectDB} = require("./config/database");
const {authRouter} = require("./routers/authRouter");
const {connectionRouter} = require("./routers/connectionRouter");
const { profileRouter } = require('./routers/profileRouter');
const { userRouter } = require('./routers/userRouter');
const {chatRouter} = require("./routers/chatRouter");
const http = require("http");
const {initailizeServer} = require('./config/socket');




const app = express();

app.use(cookieParse());
app.use("/",express.json());

app.use(
    cors({
        origin:"http://localhost:5173",
        credentials:true,
    })
)

app.use("/",authRouter);
app.use("/",connectionRouter);
app.use("/",profileRouter);
app.use("/",userRouter);
app.use("/",chatRouter);
const server = http.createServer(app);

initailizeServer(server);


connectDB().then(async()=>{
    console.log("Database Connected successfully");
    server.listen(7777,()=>{
        console.log("server is listening on port 7777");
    })
}).catch((err)=>{
   console.error(`Error Occur:
                 ${err}`);
   
})



