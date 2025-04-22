const mongoose = require("mongoose");

const ItinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TripPreference",
      required: true,
    },
    itinerary: {
      type: Array, // This stores the AI-generated plan for each day
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Itinerary", ItinerarySchema);
