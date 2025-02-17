const express = require("express");
const{userAuth} = require("../middlewares/userAuth")
const { Connections } = require("../models/connectionModel");
const {USER_SAFE_DATA} = require("../config/constant")
const {User} = require("../models/userModel")


const userRouter = express.Router();


module.exports ={
    userRouter
}


userRouter.get("/user/request/received",userAuth,async(req,res)=>{
    try{
        const {loggedInUser} = req.body;

      const data = await Connections.find({toUserId:loggedInUser._id,
                                            status:"interested"
                                            }).populate({
                                                path:"fromUserId",
                                                select:USER_SAFE_DATA
                                            })

       const pendingConnections = data.map((connection)=>{
           return connection.fromUserId
       })                                     
           res.json({message:"Data fetched successfully",
                      data: pendingConnections});                                 
    }catch(err){
       res.status(400).send(err.message);
    }
      
})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const {loggedInUser} = req.body;
       
        const data = await Connections.find({
            $or:[{fromUserId:loggedInUser._id,status:"accepted"},
                {toUserId:loggedInUser._id,status:"accepted"}]
        }).populate({
            path:"fromUserId",
            select:USER_SAFE_DATA
        }).populate({
            path:"toUserId",
            select:USER_SAFE_DATA
        })

        const friendList = data.map((friend)=>{
            if(friend.fromUserId._id.toString()===loggedInUser._id.toString()){
                return friend.toUserId;
            }else{
                return friend.fromUserId;
            }
        })

        res.json({message:"Data fetched successfully",
            data: friendList}); 


    }catch(err){
        res.status(400).send(err.message);
        
    }
   
})


userRouter.get("/user/feed",userAuth,async(req,res)=>{
    try{
        const {loggedInUser} = req.body
        //console.log(req.query);
        
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 5;
        if(limit>50) limit = 5;
        let tobeSkipped = (page-1)*limit;
         

        const allConnectionsOfLoggedInUser = await Connections.find({
            $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}]
        })

        const notAllowedUserIds = allConnectionsOfLoggedInUser.map((user)=>{
            if(user.fromUserId.toString()===loggedInUser._id.toString()){
                return user.toUserId;
            }else{
               return user.fromUserId;
            }
        })

        notAllowedUserIds.push(loggedInUser._id);

        const feedData = await User.find({
            _id:{$nin:notAllowedUserIds}
        }).select(USER_SAFE_DATA).skip(tobeSkipped).limit(limit);

        res.json({
            message:"Data fetched successfully",
            data:feedData
        })

    }catch(err){
        res.status(400).send(err.message);
    }
})


userRouter.get("/user/details/:toUserId",userAuth,async(req,res)=>{
    try{
         const {loggedInUser} = req.body;
         const {toUserId} = req.params;
         //console.log(loggedInUser._id +" "+toUserId);
         
         const data = await Connections.find({
             $or:[{fromUserId:loggedInUser._id,toUserId,status:'accepted'},
                   {fromUserId:toUserId,toUserId:loggedInUser._id,status:'accepted'}
             ]
         }).populate({path:"fromUserId",
            select:USER_SAFE_DATA
    }).populate({path:"toUserId",
        select:USER_SAFE_DATA
})
         const userData = data.map((user)=>{
            if(user.fromUserId===loggedInUser._id){
                return user.toUserId;
            }else{
                return user.fromUserId;
            }

         })
 
         res.json({
             message:"profile data succesfully fetched",
             data:userData
         })
 
     }catch(err){
         res.status(400).send(err.message);
     }
     
 })