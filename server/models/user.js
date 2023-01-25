import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
  },
  username: {
    type: String,
    required: [true, "Please Enter Your username"],
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
  },
});

export default mongoose.model("users", userSchema);
