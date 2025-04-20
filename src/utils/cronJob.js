const cron = require("node-cron");
const {sendNotification} = require("./sendMail");
const {subDays,startOfDay,endOfDay} = require("date-fns");
const {Connections} = require("../models/connectionModel");



cron.schedule("0 8 * * *",async()=>{
    // sendNotification("ishitabhowmick485@gmail.com","Good Morning Dear","Have a nice day");
    // console.log("Mail is sended to ishita");
    const yesterDay = subDays(new Date(),1);
    const yesterDayStart = startOfDay(yesterDay);
    const yesterDayEnd = endOfDay(yesterDay);

    const pendingUsers = await Connections.find({
        status : "interested",
        createdAt:{
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


