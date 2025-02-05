const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        require:[true,"First Name is required"],
        minlength:[3,"Length of First Name shoud be between 3 and 30"],
        maxlength:[30,"Length of First Name shoud be between 3 and 30"]
    },
    lastName:{
      type:String,
      require:[true,"Last Name is required"],
      minlength:[3,"Length of Last Name shoud be between 3 and 30"],
      maxlength:[30,"Length of Last Name shoud be between 3 and 30"]
    },
    emailId:{
        type:String,
        require:[true,"Email id is required"],
        unique:[true,"Email id is already exist"],
        maxlength:[70,"Length of email id shouldn't be more that 70"],
        validate:[function(value){
            return validator.isEmail(value)
        },"Email id is not valid"]
    },
    password:{
        type:String,
        require:[true,"Password is required"],
        minlength:[8,"Length of password shoud be between 8 and 25"],
        maxlength:[25,"Length of password shoud be between 8 and 25"],
        validate:[function(value){
            return validator.isStrongPassword(value);
        },"Password is not Strong"]
    },
    age:{
        type:Number,
        min:[18,"You Should be 18+"],
        max:[80,"Age shouldn't be exceed 80"]
    },
    gender:{
        type:String,
        validate:[function(value){
           const possibleValue=["male","female","other"];
           return possibleValue.includes(value);
        },"Gender is not valid"]
    },
    photoURL:{
        type:String,
        default:"https://cdn-icons-png.flaticon.com/256/9572/9572778.png",
        validate:[function(value){
            return (validator.isURL(value) && (/\.(jpeg|jpg|png|gif|webp|svg)$/i.test(value)));
        },"PhotoURL is not valid"]
    }
})


const User = mongoose.model("User",userSchema);

module.exports = {
    User
}