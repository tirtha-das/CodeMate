const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PHOTOURL_END_REGEX, GENDER_POSSIBLE_VALUE } = require("../config/constant");

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
          return GENDER_POSSIBLE_VALUE.includes(value);
        },"Gender is not valid"]
    },
    photoURL:{
        type:String,
        default:"https://cdn-icons-png.flaticon.com/256/9572/9572778.png",
        validate:[function(value){
            return (validator.isURL(value) && (PHOTOURL_END_REGEX.test(value)));
        },"PhotoURL is not valid"]
    },
    about:{
        type:String,
        maxlength:[250,"About section shouldn't be contain more than 500 words including space"],
    },
    skills:[{
        type:String,
    }]
})

userSchema.methods.getJWT = function(){
   
    const token = jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:"1D"});
    return token;    

}

userSchema.methods.passwordValidation = async function(passwordFromInput){
    const passwordHash = this.password;

    const isPasswordValid = await bcrypt.compare(passwordFromInput,passwordHash);
    return isPasswordValid

}

const User = mongoose.model("User",userSchema);

module.exports = {
    User
}