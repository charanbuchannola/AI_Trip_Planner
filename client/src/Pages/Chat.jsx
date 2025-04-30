"use client";
import { Mic, Square, User, Bot, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const suggestions = [
  "Best places to visit in Japan?",
  "Plan a 5-day Europe trip",
  "Where should I go in winter?",
];

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [suggestionsVisible, setSuggestionsVisible] = useState(true);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setTimeout(() => {
          handleSend(transcript);
        }, 300); // Allow time for input to update before sending
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
  
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setSuggestionsVisible(false);
  
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_OPENAI_API_KEY`, // 🔐 Replace with your API key
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful travel assistant." },
            { role: "user", content: userMessage.text },
          ],
        }),
      });
  
      const data = await res.json();
      const botMessage = {
        sender: "bot",
        text: data.choices[0].message.content.trim(),
      };
  
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error fetching AI response:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="h-[90vh] max-w-3xl mx-auto mt-20 px-4 py-6 flex flex-col">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-300 pb-4">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            className={`chat ${msg.sender === "user" ? "chat-end" : "chat-start"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="chat-image avatar">
              <div className="w-8 rounded-full bg-white flex items-center justify-center">
                {msg.sender === "user" ? <User className="text-blue-600" /> : <Bot className="text-green-600" />}
              </div>
            </div>
            <div className={`chat-bubble ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
              {msg.text}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-8 rounded-full bg-white flex items-center justify-center">
                <Bot className="text-green-600" />
              </div>
            </div>
            <div className="chat-bubble bg-gray-200 text-black animate-pulse">
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {suggestionsVisible && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
          {suggestions.map((text, index) => (
            <button
              key={index}
              className="btn btn-sm btn-outline"
              onClick={() => handleSend(text)}
            >
              {text}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="mt-4 flex items-center gap-2">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask your travel assistant..."
          className="textarea textarea-bordered flex-1 resize-none text-sm"
        />
        <button
          onClick={() => handleSend()}
          className="btn btn-circle btn-primary"
          disabled={loading || !input.trim()}
        >
          <Send size={18} />
        </button>
        <button
          onClick={startListening}
          className={`btn btn-circle ${listening ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`}
          disabled={listening}
        >
          {listening ? <Square size={20} /> : <Mic size={20} />}
        </button>
      </div>
    </div>
  );
}
