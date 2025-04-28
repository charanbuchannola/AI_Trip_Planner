const express = require("express");
const { createTrip, getTrip } = require("../controllers/trip.controller");
const { authMiddleware } = require("../middleware/user.middleware");

const router = express.Router();

router.post("/createtrip", authMiddleware, createTrip);

router.get("/:tripId", authMiddleware, getTrip); // Route to get trip details

module.exports = router;
