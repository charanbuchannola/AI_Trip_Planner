import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState({});
  const bottomRef = useRef(null);

  const handleSend = async () => {
    const userMsg = input.trim();
    if (!userMsg) return;

    const newMessage = {
      from: "user",
      text: userMsg,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post("http://localhost:5000/api/tripplan/chat", {
        message: userMsg,
      });

      setIsTyping(false);
      const botReply = {
        from: "bot",
        text: res.data.reply,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "⚠️ Server error occurred. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  // Typing effect for bot messages
  useEffect(() => {
    messages.forEach((msg, index) => {
      if (msg.from === "bot" && !displayedText[index]) {
        let i = 0;
        const fullText = msg.text;
        setDisplayedText((prev) => ({ ...prev, [index]: "" }));

        const type = () => {
          if (i < fullText.length) {
            setDisplayedText((prev) => ({
              ...prev,
              [index]: fullText.slice(0, i + 1),
            }));
            i++;
            setTimeout(type, 30); // Adjust typing speed here
          }
        };
        type();
      }
    });
  }, [messages, displayedText]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full md:flex justify-center items-center h-screen overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl "
      >
        <div className="card shadow-2xl rounded-2xl overflow-hidden border  border-gray-200">
          <div className="card-body h-[80vh] p-6">
            <h2 className="card-title text-2xl mb-4 font-bold text-gray-800">
              🌍 Travel Assistant
            </h2>

            <div className="h-[500px] overflow-y-auto pr-4 space-y-4 scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`chat ${
                      msg.from === "user" ? "chat-end" : "chat-start"
                    }`}
                  >
                    <div className="chat-header text-sm font-medium text-gray-600">
                      {msg.from === "user" ? "You" : "AI Agent"}{" "}
                      <time className="text-xs opacity-60 ml-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                    <div
                      className={`chat-bubble ${
                        msg.from === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      } shadow-md rounded-lg p-3 max-w-xs sm:max-w-md break-words`}
                    >
                      {msg.from === "bot" ? displayedText[index] || "" : msg.text}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="chat chat-start"
                  >
                    <div className="chat-header text-sm font-medium text-gray-600">
                      AI Agent
                    </div>
                    <div className="chat-bubble bg-gray-200 text-gray-800 shadow-md rounded-lg p-3">
                      <div className="flex space-x-1">
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce delay-100">.</span>
                        <span className="animate-bounce delay-200">.</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef}></div>
            </div>

            <div className="mt-6 flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="input input-bordered w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50"
                placeholder="Ask about your travel plans..."
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                className="btn bg-blue-500 text-white hover:bg-blue-600 rounded-lg px-6"
              >
                Send
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Chat;