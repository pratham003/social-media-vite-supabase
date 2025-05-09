import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize the Google Generative AI with the API key from environment variables
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY as string);

// Using a model optimized for free tier usage
// gemini-2.0-flash-lite is designed to be cost-efficient and works well with free tier quotas
const MODEL_NAME = "gemini-2.0-flash-lite";

// Configure safety settings - using a more permissive setting for creative content
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Configure generation parameters
const generationConfig = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024,
};

export interface ContentSuggestion {
  title: string;
  content: string;
}

/**
 * Generates content suggestions based on a given topic
 * @param topic The topic to generate content for
 * @returns A promise that resolves to a content suggestion
 */
export async function generateContentSuggestion(topic: string): Promise<ContentSuggestion> {
  try {
    // Get the generative model (Gemini) with configuration
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig,
      safetySettings,
    });
    
    // Create a prompt for generating social media post content
    const prompt = `
      Task: Create an engaging social media post about "${topic}"
      
      Requirements:
      1. Create a catchy title (maximum 50 characters)
      2. Write creative and engaging content (maximum 200 characters)
      3. Structure your response in JSON format as follows:
      {
        "title": "Your catchy title here",
        "content": "Your engaging content here"  
      }
      
      Ensure the JSON is properly formatted and contains only these two fields.
    `;
    
    // Generate content based on the prompt
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response to extract the title and content
    try {
      // Try to parse as JSON first
      const parsedResponse = JSON.parse(text);
      return {
        title: parsedResponse.title || "Generated Title",
        content: parsedResponse.content || "Generated Content"
      };
    } catch (parseError) {
      // If JSON parsing fails, try to extract title and content from text
      const titleMatch = text.match(/title["']?\s*:\s*["'](.+?)["']/i);
      const contentMatch = text.match(/content["']?\s*:\s*["'](.+?)["']/i);
      
      return {
        title: titleMatch?.[1] || "Generated Title",
        content: contentMatch?.[1] || text.substring(0, 200)
      };
    }
  } catch (error) {
    console.error("Error generating content:", error);
    return {
      title: "Error Generating Content",
      content: "There was an error generating content. Please try again later."
    };
  }
}

/**
 * Enhances existing content to make it more engaging
 * @param content The content to enhance
 * @returns A promise that resolves to enhanced content
 */
export async function enhanceContent(content: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig,
      safetySettings,
    });
    
    const prompt = `
      Task: Enhance the following social media post to make it more engaging and impactful.
      
      Original Post: "${content}"
      
      Requirements:
      1. Keep the same general topic and core message
      2. Make it more captivating, creative, and shareable
      3. Add compelling language that encourages engagement
      4. Keep the enhanced content under 250 characters
      5. Do not use hashtags or emojis unless they were in the original
      6. Return only the enhanced text with no additional formatting or explanation
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Ensure we're not exceeding the character limit
    return response.text().substring(0, 250);
  } catch (error) {
    console.error("Error enhancing content:", error);
    return content;
  }
}
