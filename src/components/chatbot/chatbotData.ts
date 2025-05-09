export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface Intent {
  id: string;
  keywords: string[];
  responses: string[];
  followUp?: string[];
}

export interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string; // Element selector to highlight
  link?: string;   // Optional link to navigate to
}

// Predefined intents for the chatbot
export const intents: Intent[] = [
  {
    id: 'greeting',
    keywords: ['hello', 'hi', 'hey', 'greetings', 'sup', 'yo'],
    responses: [
      "Hello! Welcome to our social media platform. How can I help you today?",
      "Hi there! I'm your assistant. What would you like to know about our platform?"
    ],
    followUp: ['help', 'tour', 'features']
  },
  {
    id: 'help',
    keywords: ['help', 'assistance', 'support', 'guide', 'how to'],
    responses: [
      "I'd be happy to help! What specifically do you need assistance with?",
      "Sure thing! I can help you with navigation, posting content, finding communities, and more. What would you like help with?"
    ],
    followUp: ['navigation', 'posting', 'communities', 'features']
  },
  {
    id: 'navigation',
    keywords: ['navigate', 'find', 'go to', 'where is', 'location'],
    responses: [
      "Our site has several main sections: Home, Create Post, Communities, and Profile. What would you like to find?",
      "You can navigate using the menu at the top of the page. Would you like me to explain each section?"
    ]
  },
  {
    id: 'posting',
    keywords: ['post', 'create', 'share', 'publish', 'content', 'write'],
    responses: [
      "To create a post, click the 'Create Post' option in the navigation menu. You can add a title, content, and image to your post.",
      "Creating a post is easy! Click 'Create Post', then fill out the form with your content. You can also use our AI assistant to help generate or enhance your content."
    ]
  },
  {
    id: 'communities',
    keywords: ['community', 'communities', 'group', 'join', 'forum'],
    responses: [
      "You can browse all communities by clicking on 'Communities' in the navigation menu. You can join existing communities or create your own!",
      "Communities are groups centered around specific topics. Browse them in the Communities section or create your own community!"
    ]
  },
  {
    id: 'features',
    keywords: ['feature', 'features', 'what can', 'functionality', 'do', 'capable'],
    responses: [
      "Our platform offers features like posting content, joining communities, AI-powered content assistance, and personalized recommendations.",
      "Some key features include: social posts with images, community creation and participation, AI-driven content suggestions, and a clean, intuitive interface."
    ]
  },
  {
    id: 'ai',
    keywords: ['ai', 'artificial intelligence', 'gemini', 'generate', 'suggestion', 'assistant'],
    responses: [
      "We offer AI-powered content assistance when creating posts. Our AI can help generate content ideas based on topics or enhance your existing content.",
      "Our AI feature uses Gemini to help you create more engaging posts. Just type in a topic, and it will suggest content, or let it enhance what you've already written!"
    ]
  },
  {
    id: 'tour',
    keywords: ['tour', 'walkthrough', 'show me', 'introduction', 'learn'],
    responses: [
      "I'd be happy to give you a tour of our platform! Would you like to start?",
      "Let me show you around our platform to help you get familiar with everything!"
    ]
  },
  {
    id: 'thanks',
    keywords: ['thanks', 'thank you', 'appreciation', 'grateful', 'thx'],
    responses: [
      "You're welcome! Is there anything else I can help you with?",
      "Happy to help! Let me know if you need anything else."
    ]
  },
  {
    id: 'bye',
    keywords: ['bye', 'goodbye', 'see you', 'later', 'farewell', 'exit'],
    responses: [
      "Goodbye! Feel free to chat with me anytime you need assistance.",
      "See you later! I'll be here if you need help in the future."
    ]
  },
  {
    id: 'fallback',
    keywords: [],
    responses: [
      "I'm not sure I understand. Could you rephrase that?",
      "Sorry, I didn't catch that. Can you ask in a different way?",
      "I'm still learning. Could you clarify what you're looking for?"
    ]
  }
];

// Tour steps for guided walkthrough
export const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Our Platform',
    description: 'This tour will guide you through the main features of our social media platform.',
    target: 'body'
  },
  {
    id: 'home',
    title: 'Home Feed',
    description: 'This is where you can see posts from all users and communities.',
    target: '.navbar',
    link: '/'
  },
  {
    id: 'create-post',
    title: 'Create Posts',
    description: 'Click here to create a new post with text and images. You can also use our AI assistant to help generate content!',
    target: '.navbar',
    link: '/create'
  },
  {
    id: 'communities',
    title: 'Communities',
    description: 'Explore and join communities based on your interests or create your own.',
    target: '.navbar',
    link: '/communities'
  },
  {
    id: 'ai-features',
    title: 'AI Content Assistance',
    description: 'When creating a post, scroll down to find our AI assistant that can generate content ideas or enhance what you write.',
    target: '.navbar',
    link: '/create'
  }
];

// Quick action buttons
export const quickActions = [
  {
    id: 'tour',
    label: 'Take a Tour',
    icon: '🚀',
    action: 'startTour'
  },
  {
    id: 'help',
    label: 'Help with Navigation',
    icon: '🧭',
    action: 'helpNavigation'
  },
  {
    id: 'question',
    label: 'Ask a Question',
    icon: '❓',
    action: 'askQuestion'
  }
];
