const express = require("express");
const { User } = require("../models/userModel");
const {userAuth} = require("../middlewares/userAuth")
const {updateProfileValidation} = require("../validation/updateProfile")
const {USER_SAFE_DATA} = require("../config/constant");
const { Connections } = require("../models/connectionModel");


const profileRouter = express.Router();


profileRouter.get("/profile/view",userAuth,async(req,res)=>{
   try{
        const {loggedInUser} = req.body;
        const safeFields = USER_SAFE_DATA.split(" ");
        const userData = {};

        safeFields.forEach(field => {
          if (loggedInUser[field] !== undefined) {
          userData[field] = loggedInUser[field];
        }
       });
       userData["_id"] = loggedInUser._id;

        res.json({
            message:"profile data succesfully fetched",
            data:userData
        })

    }catch(err){
        res.status(400).send(err.message);
    }
    
})



profileRouter.patch("/profile/update",userAuth,async(req,res)=>{
    try{
        const {firstName,lastName,photoURL,age,gender,about} = req.body;
       updateProfileValidation(firstName,lastName,photoURL,age,gender);
        const {loggedInUser} = req.body;
        loggedInUser.set({
            firstName,
            lastName,
            photoURL : photoURL || "https://cdn-icons-png.flaticon.com/256/9572/9572778.png",
            age: age || 18,
            gender : gender || "others",
            about
        })

       await loggedInUser.save();

       const safeFields = USER_SAFE_DATA.split(" ");
       const userData = {};

       safeFields.forEach(field => {
           if (loggedInUser[field] !== undefined) {
               userData[field] = loggedInUser[field];
           }
       });

       res.json({
        message:"Data updated successfully",
        data:userData
       })
    
    }catch(err){
       res.status(400).send(err.message);
    }
})


module.exports = {
    profileRouter
}