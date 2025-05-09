import { useState, useRef, useEffect } from "react";
import { useChatbot } from "../../context/ChatbotContext";
import { quickActions } from "./chatbotData";

export const ChatbotWidget = () => {
  const {
    isOpen,
    messages,
    isTourActive,
    toggleChatbot,
    sendMessage,
    nextTourStep,
    endTour,
    executeQuickAction,
  } = useChatbot();

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat toggle button */}
      <button
        onClick={toggleChatbot}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none"
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* Chatbot panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-in-out transform">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 text-white flex justify-between items-center">
            <h3 className="font-medium">Assistant</h3>
            <div className="flex space-x-2">
              {isTourActive && (
                <div className="flex space-x-2">
                  <button
                    onClick={nextTourStep}
                    className="text-xs bg-purple-600 bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded text-white font-medium cursor-pointer"
                  >
                    Next
                  </button>
                  <button
                    onClick={endTour}
                    className="text-xs bg-purple-600 bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded text-white font-medium cursor-pointer"
                  >
                    End Tour
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Messages container */}
          <div className="h-80 overflow-y-auto p-3 space-y-3 bg-gray-800">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-gray-700 text-gray-100 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block text-right">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick action buttons */}
          <div className="p-3 bg-gray-800 border-t border-gray-700 flex flex-wrap justify-center gap-2 overflow-hidden">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => executeQuickAction(action.action)}
                className="flex-shrink-0 text-xs bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors"
              >
                <span className="text-sm">{action.icon}</span>
                <span className="font-medium">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="p-2 bg-gray-850 border-t border-gray-700 flex">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-700 text-white placeholder-gray-400 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-r-lg px-3 py-2 hover:opacity-90"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
