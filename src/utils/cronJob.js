const cron = require("node-cron");
const {sendNotification} = require("./sendMail");
const {subDays,startOfDay,endOfDay} = require("date-fns");
const {Connections} = require("../models/connectionModel");
const {User} = require("../models/userModel");
const {Chat} = require("../models/chatModel");



cron.schedule("0 8 * * *",async()=>{
    // sendNotification("ishitabhowmick485@gmail.com","Good Morning Dear","Have a nice day");
    // console.log("Mail is sended to ishita");
    const yesterDay = subDays(new Date(),1);
    const yesterDayStart = startOfDay(yesterDay);
    const yesterDayEnd = endOfDay(yesterDay);

    const pendingUsers = await Connections.find({
        status : "interested",
        updatedAt:{
            $gte:yesterDayStart,
            $lt:yesterDayEnd
        }
    }).populate({path:"toUserId",select:"emailId"});

    const pendingEmails = pendingUsers.map((user)=>{
        return user.toUserId.emailId;
    })
    
    //console.log(pendingEmails);
    //console.log("hello");
    
    for(const email of pendingEmails){
        sendNotification(email,"Good Morning Dear","You have received some request , please check it");
    //   console.log("Mail is sended to pending Emails");
    }
    
})

cron.schedule("0 8 * * *",async()=>{
   const yesterDay = subDays(new Date(),1);
   const yesterDayStart = startOfDay(yesterDay);
   const yesterDayEnd = endOfDay(yesterDay);

   const inactiveUsers = await User.find({
    updatedAt:{
        $lt:yesterDayStart
    }
}) 
console.log(inactiveUsers);

  for(const user of inactiveUsers){
    const msg  = await Chat.find({
      participants : user._id,
      updatedAt:{
        $gte:yesterDayStart,
        $lt:yesterDayEnd
      }
    })
    //console.log(user);

    if(msg!==null){
        sendNotification(user.emailId,"Good Morning Dear","You have received new message, please check it")
        //console.log("msg send to tirtha");
        
    }
    
  }

})


