import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChatMessage, Intent, intents, tourSteps } from "../components/chatbot/chatbotData";
import { v4 as uuidv4 } from "uuid";

interface ChatbotContextType {
  isOpen: boolean;
  messages: ChatMessage[];
  isTourActive: boolean;
  currentTourStep: number;
  toggleChatbot: () => void;
  sendMessage: (content: string) => void;
  startTour: () => void;
  nextTourStep: () => void;
  endTour: () => void;
  executeQuickAction: (actionId: string) => void;
  clearMessages: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};

interface ChatbotProviderProps {
  children: ReactNode;
}

export const ChatbotProvider = ({ children }: ChatbotProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const navigate = useNavigate();

  // Initialize chatbot with welcome message - using ref to ensure it only runs once
  const welcomeMessageShown = useRef(false);
  
  useEffect(() => {
    if (messages.length === 0 && !welcomeMessageShown.current) {
      welcomeMessageShown.current = true;
      addBotMessage(
        "Hello! 👋 Welcome to our social media platform. I'm your assistant, here to help you navigate and get the most out of our features. What would you like to know?"
      );
    }
  }, [messages]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const addBotMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      content,
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // Function to find the best matching intent based on user input
  const findIntent = (userInput: string): Intent => {
    const input = userInput.toLowerCase();
    
    // Check each intent for keyword matches
    for (const intent of intents) {
      for (const keyword of intent.keywords) {
        if (input.includes(keyword.toLowerCase())) {
          return intent;
        }
      }
    }
    
    // Return fallback intent if no match found
    return intents.find(intent => intent.id === 'fallback') || intents[0];
  };

  const sendMessage = (content: string) => {
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: uuidv4(),
      content,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Find matching intent and respond
    setTimeout(() => {
      const matchedIntent = findIntent(content);
      const randomResponse = matchedIntent.responses[
        Math.floor(Math.random() * matchedIntent.responses.length)
      ];
      
      addBotMessage(randomResponse);

      // If the matched intent is 'tour' and the message indicates starting a tour
      if (matchedIntent.id === 'tour' && content.toLowerCase().includes('start')) {
        startTour();
      }
    }, 500);
  };

  const startTour = () => {
    setIsTourActive(true);
    setCurrentTourStep(0);
    
    // Navigate to the first tour step that has a link
    const firstStep = tourSteps[0];
    if (firstStep.link) {
      navigate(firstStep.link);
    }
    
    addBotMessage(`${tourSteps[0].title}: ${tourSteps[0].description}`);
  };

  const nextTourStep = () => {
    if (currentTourStep < tourSteps.length - 1) {
      const nextStep = currentTourStep + 1;
      setCurrentTourStep(nextStep);
      
      // Navigate if this step has a link
      if (tourSteps[nextStep].link) {
        navigate(tourSteps[nextStep].link);
      }
      
      addBotMessage(`${tourSteps[nextStep].title}: ${tourSteps[nextStep].description}`);
    } else {
      // End of tour
      addBotMessage("That concludes our tour! Feel free to explore the platform and ask if you have any questions.");
      setIsTourActive(false);
    }
  };

  const endTour = () => {
    setIsTourActive(false);
    addBotMessage("Tour ended. Is there anything else I can help you with?");
  };

  const executeQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'startTour':
        startTour();
        break;
      case 'helpNavigation':
        addBotMessage("Our platform has several main sections: Home for viewing posts, Create Post for sharing content, Communities for joining groups, and more. What would you like help finding?");
        break;
      case 'askQuestion':
        addBotMessage("What question do you have about our platform? I can help with features, posting, communities, and more.");
        break;
      default:
        break;
    }
  };

  const clearMessages = () => {
    setMessages([]);
    addBotMessage("Hello! 👋 How can I help you today?");
  };

  return (
    <ChatbotContext.Provider
      value={{
        isOpen,
        messages,
        isTourActive,
        currentTourStep,
        toggleChatbot,
        sendMessage,
        startTour,
        nextTourStep,
        endTour,
        executeQuickAction,
        clearMessages
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};
