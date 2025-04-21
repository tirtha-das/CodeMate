const {Server} = require("socket.io");
const { Chat } = require("../models/chatModel");
const jwt = require("jsonwebtoken");
const {User} = require("../models/userModel");
const { Connections } = require("../models/connectionModel");

const initailizeServer = function(server){
  
  const io = new Server(server,{cors:{
     origin:"http://localhost:5173",
     }})

     const onlineUsers = new Map();

  io.use(async(socket,next)=>{
    try{
    const token = socket.handshake.auth.token;

    if(!token){
     throw new Error("Authentication error: Token Missing");
     //next(err);
    } 

    const decodedMessage = jwt.verify(token,process.env.JWT_SECRET);
    //console.log(decodedMessage);
    
    const loggedInUser = await User.findOne({_id:decodedMessage._id});
    if(!loggedInUser){
      throw new Error("Authentication error: Invalid token");
     //next(err);
    }
    next();
  }
   catch(err){
    next(err);
   }
  })

  io.on("connection",(socket)=>{
   // console.log(socket.id);

    socket.on("userOnline",async({userId})=>{
      try{
       onlineUsers.set(userId,socket.id);
       const user = await User.findByIdAndUpdate(userId,{isOnline:true});
      // user.isOnline = true;
      // await user.save();
       
       io.emit("updateUserStatus",{userId,onlineStatus:true});
      }catch(err){
          console.log(err);
          
      }
    })
    
    socket.on("joinChat",async({userId,toUserId})=>{
      try{
      const connection = await Connections.findOne({
        $or:[{fromUserId:userId,toUserId},    
          {fromUserId:toUserId,toUserId:userId}]});
      if(!connection || connection.status!=="accepted"){
        throw new Error("Both of them are not friends");
      }
     // console.log(connection);
      
      const roomId = [userId,toUserId].sort().join("$")
      //  console.log(roomId);
       socket.join(roomId);
      }catch(err){
         socket.emit("notFriend",{err});
      }
    });



    socket.on("sendMessage",async({userId,toUserId,firstName,text})=>{
      try{
       const roomId = [userId,toUserId].sort().join("$");
         //console.log(firstName+" : "+text);
        
       let chats = await Chat.findOne({
          participants:{$all:[userId,toUserId]}
       })

       if(!chats){
          chats = new Chat({
            participants:[userId,toUserId],
            chatMessages:[]
          });
       }

       chats.chatMessages.push({senderId:userId,text});

       await chats.save();
       // console.log("chat is successfully saved");
        
       io.to(roomId).emit("messageReceived",{fromUserId:userId,firstName,text});
      }catch(err){
        console.log(err);
        
      }
       
    })

    socket.on("disconnect",async()=>{
      try{
      const userId = [...onlineUsers.entries()].find(([_,id])=>{
        return id === socket.id
      })?.[0];
      if(userId){
        onlineUsers.delete(userId);
        const user = await User.findByIdAndUpdate(userId,{isOnline:false});
       // user.isOnline = false;
       // await user.save();
        io.emit("updateUserStatus",{userId,onlineStatus:false});
      }
    }catch(err){
      console.log(err);
      
    }
    })
  })

}


module.exports={
    initailizeServer
} 