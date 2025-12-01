import React, { useState } from "react";

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "Alice", text: "Hey there!" },
    { id: 2, sender: "You", text: "Hi Alice!" }
  ]);

  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: messages.length + 1, sender: "You", text: newMessage }]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[80vh] border rounded-md">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(msg => (
          <div key={msg.id} className={msg.sender === "You" ? "text-right" : "text-left"}>
            <span className="inline-block px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 m-1">
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded px-2 py-1"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white px-4 py-1 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;