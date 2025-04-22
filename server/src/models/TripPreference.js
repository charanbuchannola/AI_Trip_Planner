const mongoose = require("mongoose");

const TripPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    days: {
      type: Number,
      required: true,
      min: 1,
      max: 7, // Limit to 7 days
    },
    budget: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
    travelGroup: {
      type: String,
      enum: ["solo", "family", "friends", "couple"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TripPreference", TripPreferenceSchema);
