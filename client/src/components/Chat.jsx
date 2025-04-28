import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // Initialize the socket connection once (outside of useEffect)
  const newSocket = io("http://localhost:5000", {
    auth: { token: localStorage.getItem("token") },
  });

  useEffect(() => {
    // Listen for new messages from the server
    newSocket.on("chat message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for connection status
    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to socket server");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from socket server");
    });

    // Cleanup when the component unmounts
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []); // Empty dependency array ensures that this effect runs only once when the component mounts

  const handleMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      newSocket.emit("chat message", newMessage); // Send message to server
      setNewMessage(""); // Clear the input field
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col justify-between h-full bg-gray-100 rounded-xl shadow-lg p-4">
      <div className="flex-1 overflow-auto">
        <div className="space-y-4">
          {/* Render chat messages */}
          {messages.map((msg, index) => (
            <div key={index} className="flex justify-start space-x-2">
              <div className="bg-blue-500 text-white p-2 rounded-lg max-w-[80%]">
                {msg}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message input */}
      <div className="flex items-center space-x-4 mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={handleMessageChange}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>

      {/* Connection status */}
      <div className="text-center text-sm text-gray-500 mt-2">
        {isConnected ? "Connected" : "Disconnected"}
      </div>
    </div>
  );
};

export default Chat;
