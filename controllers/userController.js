const userModel = require("../models/userModel.js");
const validator = require("validator");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//login api

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not exist, please register first",
      });
    }

    const isMatch = await bycrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);

    return res.json({ success: true, token });
  } catch (error) {
    return res.json({ success: false, message: "Error" });
  }
};

//token generate

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//register api

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter correct email",
      });
    }

    const isExist = await userModel.findOne({ email: email });
    if (isExist) {
      return res.json({
        success: false,
        message: "User already exist with this email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter strong password",
      });
    }

    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    return res.json({ success: true, token });
  } catch (error) {
    return res.json({ success: false, message: "Error" });
  }
};

module.exports = { loginUser, registerUser };
