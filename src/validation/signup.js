const validator = require("validator");


const signupDataValidation = function(firstName,lastName,emailId,password){
    const nameValidator = new RegExp(process.env.NAME_VALIDATION_REGEX);
        const isValidFirstName = nameValidator.test(firstName);
        if(!isValidFirstName){
            throw new Error("First Name is not valid");
        }
        const isValidLastName = nameValidator.test(lastName);
        if(!isValidLastName){
            throw new Error("Last Name is not valid");
        }
       
        if(!validator.isEmail(emailId)){
            throw new Error("Email id is not valid");
        }
        if(!validator.isStrongPassword(password)){
            throw new Error("Please give a strong password");
        }

}


module.exports={
    signupDataValidation
}