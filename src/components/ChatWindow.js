import React, { useState, useEffect, useRef } from "react";
import "./ChatWindow.css";
import { getAIMessage, clearRecentQueries } from "../api/api";
import { marked } from "marked";
import { TbRefresh } from "react-icons/tb";

function ChatWindow() {

  const defaultMessage = [{
    role: "assistant",
    content: "Welcome to the PartSelect Bot to try and help you with basic queries regarding the Part Select Website (https://www.partselect.com/), Try to include the PartSelect/Manufacturer Number and Name with the Product name to get the best possible result. For more detailed/specific information please go to the website and type your part number"
  }];

  const [messages,setMessages] = useState(defaultMessage)
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
      scrollToBottom();
  }, [messages]);

  const handleSend = async (input) => {
    if (input.trim() !== "" && !isSending) {

        setIsSending(true);

      setMessages(prevMessages => [...prevMessages, { role: "user", content: input }]);
      setInput("");


      const loadingMessageId = Date.now();

      setMessages(prevMessages => [...prevMessages, { role: "loading", content: "...", id: loadingMessageId }]);



      const newMessage = await getAIMessage(input);


      setMessages(prevMessages => prevMessages.map(msg =>
        msg.id === loadingMessageId ? { ...newMessage, id: undefined } : msg
      ));

        setIsSending(false);
    }
  };

    const handleRefresh = async () => {
        setInput("");

        setMessages(defaultMessage);

        const message = await clearRecentQueries();  // Call the function to clear recent queries
        console.log(message);

      };

  return (
      <div className="messages-container">
          {messages.map((message, index) => (
            <div key={index} className={`${message.role}-message-container`}>
              {message.role === 'loading' ? (
                <div className="message loading-dots">
                  <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                </div>
              ) : (
                <div className={`message ${message.role}-message`}>
                  <div dangerouslySetInnerHTML={{__html: marked(message.content).replace(/<p>|<\/p>/g, "")}}></div>
                </div>
              )}
            </div>
          ))}

          <div ref={messagesEndRef} />
          <div className="input-area">
          <button className="refresh-button" onClick={handleRefresh}><TbRefresh /></button>
              <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                          handleSend(input);
                          e.preventDefault();
                      }
                  }}
                  rows="3"
              />
              <button className="send-button" onClick={() => handleSend(input)} disabled={isSending}>
                  Send
              </button>

          </div>
      </div>
);
}

export default ChatWindow;
