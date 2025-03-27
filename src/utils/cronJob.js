const cron = require("node-cron");

cron.schedule("* * * * *",()=>{
    console.log("Good morning to all");
    
})


