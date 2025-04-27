const tripModel = require("../models/trip.model");
const userModel = require("../models/user.model");
const { chatSession } = require("../utils/AIModal"); // your AI integration
const { AI_PROMPT } = require("../utils/options");

module.exports.createTrip = async (req, res) => {
  try {
    const { destination, days, budget, travelGroup } = req.body;
    const userId = req.user._id; // Assuming you have authentication middleware

    if (!destination || !days || !budget || !travelGroup) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (parseInt(days, 10) > 7) {
      return res.status(400).json({ message: "Max 7 days allowed" });
    }

    // Prepare AI Prompt
    const FINAL_PROMPT = AI_PROMPT.replace("{location}", destination)
      .replace("{totalDays}", days)
      .replace("{traveler}", travelGroup)
      .replace("{budget}", budget)
      .replace("{totaldays}", days);

    // Send to Gemini
    const result = await chatSession.sendMessage(FINAL_PROMPT);
    const aiResponse = JSON.parse(result?.response?.text());

    // Create and save Trip
    const trip = await tripModel.create({
      userId,
      destination,
      days,
      budget,
      travelGroup,
      generatedPlan: aiResponse,
    });

    // Update user's trips array
    await userModel.findByIdAndUpdate(userId, { $push: { trips: trip._id } });

    // return res.status(201).json({ trip });

    // Redirect to the trip details page after creation
    return res.redirect(`/api/tripplan/${trip._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate trip" });
  }
};

module.exports.getTrip = async (req, res) => {
  try {
    const { tripId } = req.params; // Get the tripId from the URL params
    const userId = req.user._id; // Assuming authentication middleware is in place

    // Find the trip by tripId
    const trip = await tripModel.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Make sure the trip belongs to the authenticated user
    if (trip.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this trip" });
    }

    // Return the trip details
    return res.status(200).json({ trip });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch trip details" });
  }
};
