const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    secure: true, 
    auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

async function sendNotification(to,subject,text,html) {
    await transporter.sendMail({
      from: `"Tirtha from CodeMate"<${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    });
  
   
  }

  module.exports = {
    sendNotification
  }