const mongoose =  require("mongoose");

const connectionSchema = new mongoose.Schema({
      fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
      },
      toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
      },
      status:{
        type:String,
        enum:{
            values:["interested","ignored","accepted","rejected"],
             message: "Status '{VALUE}' is not valid"
        },
        required:true
      },
      blockedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
      }
})

const Connections  = mongoose.model("Connections",connectionSchema);


module.exports={
    Connections
}