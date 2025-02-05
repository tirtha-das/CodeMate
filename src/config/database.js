const mongoose = require("mongoose");

const URI = process.env.DB_SECRET_KEY;

const connectDB = async function(){
    await mongoose.connect(URI)
}

module.exports={
    connectDB
}