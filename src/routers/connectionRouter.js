const express  = require("express");
const {userAuth} = require("../middlewares/userAuth");
const { Connections } = require("../models/connectionModel");


const connectionRouter = express.Router();


connectionRouter.post('/request/send/:status/:toUserId',userAuth,async(req,res)=>{
    try{
        const {loggedInUser} = req.body;
        const {status,toUserId} = req.params;
        if(loggedInUser._id.toString()===toUserId.toString()){
            throw new Error("You can't send friend request to yourself");
        }

        if(!(status==="interested" || status==="ignored")){
            throw new Error("Requested status is invalid");
        }

        const isConnectionAlreadyPresent = await Connections.findOne({
            $or:[{fromUserId:loggedInUser._id,toUserId},
                {fromUserId:toUserId,toUserId:loggedInUser._id}]});
        
        if(isConnectionAlreadyPresent){
            throw new Error("Connection is already present");
        }
        
        const newConnection = new Connections({
            fromUserId:loggedInUser._id,
            toUserId,
            status
        })

        await newConnection.save();
        
        
         res.send(`${status} request send to ${toUserId}`);
    }catch(err){
      res.status(400).send(err.message);
    }
    
})

connectionRouter.patch('/request/review/:status/:reviewUserId',userAuth,async(req,res)=>{
    try{
        const {loggedInUser} = req.body;
        const {status,reviewUserId} = req.params;
        if(!(status==="accepted" || status==="rejected")){
           throw new Error("invalid review request");
        }

        const connectionToBeReview = await Connections.findOne({
            fromUserId:reviewUserId,
            toUserId:loggedInUser._id,
            status:"interested"
        })

        if(!connectionToBeReview){
            throw new Error("No connection found");
        }

        connectionToBeReview.status = status;
        await connectionToBeReview.save();
        res.send("connection review is succefully completed")
    }catch(err){
        res.status(400).send(err.message);
    }
    
})


connectionRouter.patch('/request/profilereview/:status/:toUserId',userAuth,async(req,res)=>{
    try{
      const {loggedInUser} = req.body;
      const {status,toUserId} = req.params;
      if(!(status==="blocked"||status==="unblocked")){
        throw new Error("Invalid request");
      }
      const connectiontobeModified = await Connections.findOne({
        $or:[{fromUserId:loggedInUser._id,toUserId:toUserId,status:"accepted"},
            {fromUserId:toUserId,toUserId:loggedInUser._id,status:"accepted"}
        ]
      })
     
      
      if(!connectiontobeModified){
        throw new Error("No connection found");
      }
      if(status==="blocked"){
        if(!connectiontobeModified.blockedBy){
            connectiontobeModified.blockedBy = loggedInUser._id;
            await connectiontobeModified.save();
            res.send(`you have blocked ${toUserId}`);
        }else{
            throw new Error("You have made a invalid request");
        }
      }else{
        if(connectiontobeModified.blockedBy && connectiontobeModified.blockedBy.toString()===loggedInUser._id.toString()){
            connectiontobeModified.blockedBy = null;
            await connectiontobeModified.save();
            res.send(`you have unblocked ${toUserId}`);
        }else{
            throw new Error("You have made a invalid request");
        }
      }
    
    }catch(err){
        res.status(400).send(err.message)
    }
})

module.exports={
    connectionRouter
}