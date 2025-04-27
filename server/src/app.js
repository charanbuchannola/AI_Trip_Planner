const express = require("express");
const app = express();
const cors = require("cors");

const userRoutes = require("./routes/user.routes.js");
const tripPlanRoutes = require("./routes/tripPlanRoutes.js");

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5000"], // Add all allowed frontend origins here
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/tripplan", tripPlanRoutes);

module.exports = app;
