const express = require("express");
const app = express();
const cors = require("cors");
const cookieparser = require("cookie-parser");
const authRoutes = require("../src/routes/authRoutes");

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5000"], // Add all allowed frontend origins here
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

app.use("/api/auth", authRoutes);

module.exports = app;
