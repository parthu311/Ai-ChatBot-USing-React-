import React, { useState } from "react";
import axios from "axios";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user's message to the chat
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Call OpenAI API directly
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o", // Or other model like `text-davinci-003`
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: input },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `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`, // Replace with your OpenAI API key
          },
        }
      );

      // Get AI response
      const aiMessage = {
        sender: "ai",
        text: response.data.choices[0].message.content,
      };

      // Update chat with AI response
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "ai", text: "Sorry, I couldn't process that." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "user" ? "user-message" : "ai-message"}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="ai-message">Typing...</div>}
      </div>

      <div className="input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
