const express = require("express");
const {userAuth} = require("../middlewares/userAuth");
const { Chat } = require("../models/chatModel");

const chatRouter = express.Router();


chatRouter.get("/chat/:toUserId",userAuth,async(req,res)=>{
    try{
       const fromUserId = req.body.loggedInUser._id;
       const {toUserId} = req.params;

       const chats  = await Chat.findOne({
         participants:{$all:[fromUserId,toUserId]}
       }).populate({
        path:"chatMessages.senderId",
        select:"firstName"
       })

      // console.log(toUserId);
      const emptyMessages = [];
      if(!chats){
        res.json({messgae:"data fetch successfully",
            data:emptyMessages
        })
      }else{
        const allMessages = chats.chatMessages.map((msg)=>{
            const {senderId,text} = msg;
            const {_id,firstName} = senderId;
            return {fromUserId:_id,firstName,text};
        })
        res.json({messgae:"data fetch successfully",
            data:allMessages
        })
      }
      // res.send(chats);
       //const chats = 
    }catch(err){
      res.status(400).send("Error occurs");
    }
})


module.exports = {
    chatRouter
}