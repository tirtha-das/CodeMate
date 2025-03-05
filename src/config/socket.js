const {Server} = require("socket.io");

const initailizeServer = function(server){
  
  const io = new Server(server,{cors:{
     origin:"http://localhost:5173",
     }})


  io.on("connection",(socket)=>{
    socket.on("joinChat",({userId,toUserId})=>{
      const roomId = [userId,toUserId].sort().join("$")
       console.log(roomId);
       socket.join(roomId);
    });

    socket.on("sendMessage",({userId,toUserId,firstName,text})=>{
       const roomId = [userId,toUserId].sort().join("$");

       console.log(firstName+" : "+text);

       io.to(roomId).emit("messageReceived",{fromUserId:userId,firstName,text});
       
    })

    socket.on("disconnect",()=>{

    })
  })

}


module.exports={
    initailizeServer
} 