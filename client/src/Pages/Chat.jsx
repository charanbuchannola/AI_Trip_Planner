import { useState, useEffect, useRef } from "react";
import axios from "axios";

const intentButtons = [
  { label: "🔁 Reset Password", message: "How can I reset my password?" },
  { label: "✈ Book Flight", message: "Help me book a flight to Paris." },

  {
    label: "☀ Weather in New York",
    message: "What's the weather  in New York?",
  },
  {
    label: "🏨 Hotel in Tokyo",
    message: "Help me book a flight to Paris.",
  },
  { label: "🌧 Forecast Berlin", message: "Will it rain tomorrow in Berlin?" },

  {
    label: "💱 Exchange USD to EUR",
    message: "What's the exchange rate for USD to EUR?",
  },
  {
    label: "🏙 Top spots in Sydney",
    message: "What are the top tourist spots in Sydney?",
  },
  { label: "🚗 Rent Car in Rome", message: "I need a rental car in Rome." },
  { label: "🐛 App Crash", message: "The app keeps crashing on my phone." },

  { label: "🌙 Dark Mode", message: "Can you add a dark mode feature?" },
];

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      let speechTimeout;

      recognition.onstart = () => {
        setListening(true);
        // Auto-stop if no speech for 4 seconds
        speechTimeout = setTimeout(() => {
          recognition.stop();
        }, 4000);
      };

      recognition.onspeechend = () => {
        clearTimeout(speechTimeout);
        recognition.stop();
      };

      recognition.onend = () => {
        setListening(false);
        clearTimeout(speechTimeout);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognitionRef.current = recognition;
    } else {
      alert("Speech recognition not supported in this browser.");
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
      setSpeaking(false);
    }
  };

  const speakText = (text) => {
    stopSpeaking(); // Stop any current speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      startListening(); // Automatically listen after speaking
    };

    synthRef.current.speak(utterance);
  };

  const handleSend = async (customMsg) => {
    const messageToSend = customMsg || input;
    if (!messageToSend.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: messageToSend }]);
    setInput("");

    try {
      const res = await axios.post("http://localhost:5000/api/tripplan/chat", {
        message: messageToSend,
      });

      const botReply = res.data.reply;
      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
      speakText(botReply);
    } catch {
      const errMsg = "Server error occurred.";
      setMessages((prev) => [...prev, { from: "bot", text: errMsg }]);
      speakText(errMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white rounded shadow-lg p-4">
        <h1 className="text-xl font-bold mb-4">🧭 AI Trip Planner</h1>

        {/* Messages Display */}
        <div className="h-96 overflow-y-auto space-y-2 mb-4 border rounded p-2 bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className="flex flex-col">
              <span
                className={`text-xs font-semibold mb-1 ${
                  msg.from === "user"
                    ? "text-blue-600 text-right"
                    : "text-gray-600 text-left"
                }`}
              >
                {msg.from === "user" ? "You" : "Gemini AI"}
              </span>
              <div
                className={`p-2 rounded max-w-xs ${
                  msg.from === "user"
                    ? "bg-blue-200 ml-auto"
                    : "bg-gray-200 mr-auto"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Intent Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
          {intentButtons.map((btn, i) => (
            <button
              key={i}
              onClick={() => handleSend(btn.message)}
              className="bg-gray-100 hover:bg-gray-200 text-sm px-2 py-1 rounded shadow-sm border"
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Input Controls */}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Ask a travel question..."
          />
          <button
            onClick={() => handleSend()}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Send
          </button>
          <button
            onClick={startListening}
            className={`${
              listening ? "bg-red-500" : "bg-green-600"
            } text-white px-3 py-2 rounded`}
          >
            🎤
          </button>
          <button
            onClick={stopSpeaking}
            className="bg-gray-700 text-white px-3 py-2 rounded"
          >
            🛑
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;