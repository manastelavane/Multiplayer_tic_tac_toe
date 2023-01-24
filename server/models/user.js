import mongoose from "mongoose";
import validator from "validator";  

const userSchema = mongoose.Schema({
    name: {
        type: String, 
        required: [true, "Please Enter Your Name"],
    },
    username: {
        type: String,
        required: [true, "Please Enter Your username"],
        unique: true 
    },
    email: { 
        type: String, 
        required: true ,
        validate: [validator.isEmail, "Please Enter a valid Email"],
        unique: true
    },
    password: {
        type: String, 
        required: [true, "Please Enter Your Password"],
    },
});

export default mongoose.model("users", userSchema);