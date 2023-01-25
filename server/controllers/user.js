/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModal from "../models/user.js";
dotenv.config();
const secret = process.env.SECRET_HASH;

export const signin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ username });
    if (!oldUser)
      return res.status(404).json({ message: "Enter correct details." });
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Enter correct details." });
    const token = jwt.sign(
      { username: oldUser.username, id: oldUser._id },
      secret,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const signup = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ username });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModal.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { username: result.username, id: result._id },
      secret,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
