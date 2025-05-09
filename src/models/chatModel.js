const mongoose = require("mongoose");


const messageSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        required:true
    }
},{timestamps:true});

const chatSchema  =  new mongoose.Schema({
    chatName:{
        type:String,
        default:"Default"
    },
   participants :[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
   }],
   isItGroup:{
    type:Boolean,
    default:false
   },
   chatMessages:[{
    type:messageSchema,
    required:true
   }]
},{timestamps:true});


const Chat = mongoose.model("Chat",chatSchema);


module.exports={
    Chat
}