import { useState, useEffect, useRef } from "react";
import axios from "axios";

const intentButtons = [
  { label: "🔁 Reset Password", message: "How can I reset my password?" },
  { label: "✈ Book Flight", message: "Help me book a flight to Paris." },
  { label: "☀ Weather in New York", message: "What's the weather in New York?" },
  { label: "🏨 Hotel in Tokyo", message: "Help me book a flight to Paris." },
  { label: "🌧 Forecast Berlin", message: "Will it rain tomorrow in Berlin?" },
  { label: "💱 Exchange USD to EUR", message: "What's the exchange rate for USD to EUR?" },
  { label: "🏙 Top spots in Sydney", message: "What are the top tourist spots in Sydney?" },
  { label: "🚗 Rent Car in Rome", message: "I need a rental car in Rome." },
  { label: "🐛 App Crash", message: "The app keeps crashing on my phone." },
  { label: "🌙 Dark Mode", message: "Can you add a dark mode feature?" },
];

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const chatEndRef = useRef(null);

  // Scroll to bottom on message update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      let speechTimeout;

      recognition.onstart = () => {
        setListening(true);
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
    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      startListening();
    };

    synthRef.current.speak(utterance);
  };

  const handleSend = async (customMsg) => {
    const messageToSend = customMsg || input;
    if (!messageToSend.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: messageToSend }]);
    setInput("");
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center mt-15  p-4">
      <div className="w-full max-w-2xl  rounded-lg shadow-lg p-5 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center text-blue-700">🧭 AI Trip Planner</h1>

        {/* Chat Display */}
        <div className="h-80 overflow-y-auto  rounded-lg p-3 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-lg px-4 py-2 max-w-xs text-sm ${
                msg.from === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg animate-pulse">
                Typing...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Intent Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {intentButtons.map((btn, i) => (
            <button
              key={i}
              onClick={() => handleSend(btn.message)}
              className="text-xs  border hover:bg-gray-100  rounded shadow-sm"
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Input + Controls */}
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded-lg text-sm"
            placeholder="Ask a travel question..."
          />
          <button
            onClick={() => handleSend()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
          <button
            onClick={startListening}
            className={`text-white px-3 py-2 rounded-lg ${
              listening ? "bg-red-500" : "bg-green-600"
            }`}
            title="Start Listening"
          >
            🎤
          </button>
          <button
            onClick={stopSpeaking}
            className="bg-gray-700 text-white px-3 py-2 rounded-lg"
            title="Stop Speaking"
          >
            🛑
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
