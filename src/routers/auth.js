const express = require("express");
const { User } = require("../models/userModel");

const authRouter = express.Router();

authRouter.post("/signup",async(req,res)=>{
    try{
        
    const newUser  = new User(req.body);
    await newUser.save();

    res.send("Data saved successfully");

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
        
       else res.status(400).send({message:"Error : "+ err.message})
    }
    
})


module.exports={
    authRouter
}