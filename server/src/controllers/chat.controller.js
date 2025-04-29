const { chatModel } = require("../models/chat");
const chatWithGemini = require("../utils/gemini");

module.exports.chatController = async (req, res) => {
    const { message } = req.body;
  
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message must be a string." });
    }
  
    try {
      let reply;
      const weatherRegex = /weather in ([a-zA-Z\s]+)/i;
      const match = message.match(weatherRegex);
  
      if (match) {
        const city = match[1].trim();
        reply = await getWeather(city);
      } else {
        reply = await chatWithGemini(message);
      }
  
      await new chatModel({ user: message, bot: reply }).save();
  
      res.json({ reply });
    } catch (err) {
      console.error("ChatController error:", err.message);
      res.status(500).json({ reply: "An internal error occurred." });
    }
  };