const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookie = require("cookie-parser");

module.exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashPassword,
    });
    console.log(user);
    // res.redirect("http://localhost:5173/login");
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.redirect("http://localhost:5173/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.redirect("http://localhost:5173/login");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN);

    res.cookie("Token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    // console.log(token);

    // res.redirect("http://localhost:5173/travel-preferences");
    res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    res.redirect("/user/login");
  }
};

module.exports.logout = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "Logged out successfully" });
};

module.exports.checkAuth = (req, res) => {
  try {
    // If the request reaches here, the user is authenticated (thanks to authMiddleware)
    res.status(200).json({ message: "Authenticated", userId: req.user._id });
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};
