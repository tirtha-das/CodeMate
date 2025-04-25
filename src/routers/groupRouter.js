const express = require('express');
const {userAuth} = require('../middlewares/userAuth');
const {Chat} = require("../models/chatModel");
const { Connections } = require('../models/connectionModel');

const groupRouter = express.Router();

groupRouter.post("/group/createGroup",userAuth,async(req,res)=>{
    try{
    const {groupMembers,groupName} = req.body;
    const {loggedInUser} = req.body;
    const distinctMembers = new Set();
    groupMembers.forEach(member => {
        distinctMembers.add(member);
    });
    const filterdMembers = [...distinctMembers];
    //console.log(filterdMembers);
    
    for (const toUserId of filterdMembers) {
       //console.log(toUserId);
       
        const friend = await Connections.findOne({
            $or:[{fromUserId:loggedInUser._id,toUserId},
                {fromUserId:toUserId,toUserId:loggedInUser._id}],
                status:"accepted"
        })

        if(!friend){
            res.status(400).send("Invalid Friend Ids");
            return ;
        }
    }
    filterdMembers.push(loggedInUser._id.toString());
  
    
    const  newGroup = new Chat({
        chatName:groupName,
        participants:filterdMembers,
        isItGroup:true,
        chatMessages:[]
    })

     await newGroup.save();
     res.send("Group Created Succesfully");
   }catch(err){
    console.log(err);
    
    res.status(400).send("Error occurs");
   }
})

groupRouter.get("/group/allGroups",userAuth,async(req,res)=>{
   try{
     const {loggedInUser} = req.body;
     //console.log(loggedInUser);
     
     const allGroupsData = await Chat.find({
        participants:loggedInUser._id,
        isItGroup:true
     })
    // console.log(allGroupsData);
     
     const allGroups = allGroupsData.map((group)=>{
        const{_id,chatName} = group;
        return {groupId:_id,groupName:chatName};
     })
     res.json({
        message:"All groups info successfully found",
        data:allGroups
     })
   }catch(err){
    console.log(err);
    
    res.status(400).send("Some error occurs");
   }
})




module.exports = { 
    groupRouter
};