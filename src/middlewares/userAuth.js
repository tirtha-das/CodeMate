const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

const userAuth = async(req,res,next)=>{
    try{
      const token = req.cookies.token;
      
      
      if(!token){
        throw new Error("");
      }
      const decodedMessage = jwt.verify(token,process.env.JWT_SECRET);
      const loggedInUserId = decodedMessage._id;
      const loggedInUser = await User.findOne({_id:loggedInUserId});
      if(!loggedInUser){
        throw new Error("");
      }
      req.body.loggedInUser = loggedInUser;
      next();
      
    }catch(err){
        res.status(401).send("please login again");
    }
}


module.exports={
    userAuth
}