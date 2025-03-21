const express = require("express");
const { User } = require("../models/userModel");
const { signupDataValidation } = require("../validation/signup");
const bcrypt = require("bcrypt");
const validator = require("validator");
const {USER_SAFE_DATA} = require("../config/constant")



const authRouter = express.Router();

authRouter.post("/signup",async(req,res)=>{
    try{

    let {firstName,lastName,emailId,password} = req.body;
    firstName = firstName.trim();
    lastName = lastName.trim();
    emailId = emailId.trim();
    
    signupDataValidation(firstName,lastName,emailId,password);
   
        
    const passwordHash = await bcrypt.hash(password,Number(process.env.BCRYPT_SECRET_SALT));
    
    const newUser  = new User({firstName,lastName,emailId,password:passwordHash});
    await newUser.save();

    const token = await newUser.getJWT();

    const safeFields = USER_SAFE_DATA.split(" ");
    const userData = {}
    safeFields.forEach((field)=>{
        if(newUser[field]!==undefined){
            userData[field] = newUser[field];
        }
    })

    res.cookie("token",token);
    res.json({message:"Data saved successfully",
              data:userData
    });

    }catch(err){
        
        if(err.name==='ValidationError'){
           const allErrors = [];
           for(let fields in err.errors){
            allErrors.push(err.errors[fields].message);
           }
           res.status(400).json({data:allErrors});

        }else if(err.name==='MongooseError'){
            res.status(400).json({data:[err.message]});
        }
        
       else res.status(400).json({data:[err.message]})
    }
    
})


authRouter.post("/login",async(req,res)=>{
    try{
       let {emailId,password} = req.body;
       emailId = emailId.trim();
       if(!validator.isEmail(emailId)){
        throw new Error("Invalid Credentials");
       }

       const tobeLoggedInUser = await User.findOne({emailId});
       if(!tobeLoggedInUser){
        throw new Error("Invalid Credentials");
       }

       const isValidPasaword = await tobeLoggedInUser.passwordValidation(password);
       if(!isValidPasaword){
        throw new Error("Invalid Credentials");
       }

       const token = tobeLoggedInUser.getJWT();
       res.cookie("token",token);
       const safeFields = USER_SAFE_DATA.split(" ");
       const userData = {};
       safeFields.forEach(field => {
        if (tobeLoggedInUser[field] !== undefined) {
        userData[field] = tobeLoggedInUser[field];
      }
     });
     userData["_id"]=tobeLoggedInUser._id

       res.json({message:"Successfully logged in",
                  data:userData
       });

       
    }catch(err){
        res.status(401).json({data:[err.message]})
    }
})


authRouter.post("/logout",async(req,res)=>{
    try{
        res.cookie("token",null,{expires:new Date(0)});
        res.send("Succesfully logged out")
    }catch(err){
        res.status(400).send(err.message)
    }
   

})








module.exports={
    authRouter
}