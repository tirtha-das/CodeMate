const {Server} = require("socket.io");
const { Chat } = require("../models/chatModel");

const initailizeServer = function(server){
  
  const io = new Server(server,{cors:{
     origin:"http://localhost:5173",
     }})


  io.on("connection",(socket)=>{
    socket.on("joinChat",({userId,toUserId})=>{
      const roomId = [userId,toUserId].sort().join("$")
      //  console.log(roomId);
       socket.join(roomId);
    });

    socket.on("sendMessage",async({userId,toUserId,firstName,text})=>{
      try{
       const roomId = [userId,toUserId].sort().join("$");
        // console.log(roomId);
        
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

       io.to(roomId).emit("messageReceived",{fromUserId:userId,firstName,text});
      }catch(err){
        console.log(err);
        
      }
       
    })

    socket.on("disconnect",()=>{

    })
  })

}


module.exports={
    initailizeServer
} 