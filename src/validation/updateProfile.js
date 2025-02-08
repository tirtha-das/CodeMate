const validator = require("validator");
const {PHOTOURL_END_REGEX, GENDER_POSSIBLE_VALUE} = require("../config/constant")

const updateProfileValidation = function(firstName,lastName,photoURL,age,gender){
    const nameValidator = new RegExp(process.env.NAME_VALIDATION_REGEX)
    if(!firstName || firstName!==firstName.trim() || !nameValidator.test(firstName)){
        throw new Error("First name is not valid");
    }
    if(!lastName || lastName!==lastName.trim() || !nameValidator.test(lastName)){
        throw new Error("Last name is not valid");
    }
    if(photoURL && (!validator.isURL(photoURL) || !PHOTOURL_END_REGEX.test(photoURL))){
        throw new Error("Photo URL is not valid");   
    }
    if(age && age<18 || age>80){
        throw new Error("Age should be between 18 and 80");
    }
    if(gender && !GENDER_POSSIBLE_VALUE.includes(gender)){
        throw new Error("Gender is not valid");
    }
    
}


module.exports={
    updateProfileValidation
}