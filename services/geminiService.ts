import { GoogleGenAI, Content } from "@google/genai";
import { Message, Role, Language } from "../types";

// We use Gemini 2.5 Flash for Maps Grounding support
const MODEL_NAME = "gemini-2.5-flash";

const getSystemInstruction = (language: Language): string => {
  const baseInstruction = `You are WanderLust, an expert AI Travel Consultant.
Your goal is to assist users in planning trips, finding attractions, and learning about cultures.

Capabilities:
1. Suggest tourist attractions, historical places, and cultural spots.
2. Provide local food recommendations.
3. Create detailed itineraries (1-day, 3-day, 7-day).
4. Offer budget tips and best travel seasons.
5. Provide safety and etiquette advice.

Tone: Friendly, enthusiastic, and professional.
Format: Use Markdown formatting. Use bold for key terms, bullet points for lists, and short paragraphs.
IMPORTANT: When discussing locations, specific places, or restaurants, rely on the Google Maps tool provided to give accurate real-world locations.

Constraints:
- Do not provide medical or legal advice.
- Avoid misinformation.
- If the user asks about something unrelated to travel/geography/culture, politely steer them back to travel topics.`;

  if (language === 'ur') {
    return `${baseInstruction}\n\nIMPORTANT: You must reply in Urdu (Urdu script).`;
  }
  return baseInstruction;
};

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // API key injection is handled by the environment
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async sendMessage(
    history: Message[],
    newMessage: string,
    language: Language
  ): Promise<{ text: string; groundingChunks?: any[] }> {
    try {
      // Convert app history to API history format
      const historyContent: Content[] = history.map((msg) => ({
        role: msg.role === Role.USER ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      // We don't maintain a persistent Chat object here to keep it stateless/simple for the React flow,
      // but we pass the history to generateContent to simulate chat.
      // However, usually for chat, we use ai.chats.create.
      // Let's use ai.chats.create for better context management.
      
      const chat = this.ai.chats.create({
        model: MODEL_NAME,
        config: {
          systemInstruction: getSystemInstruction(language),
          temperature: 0.7,
          tools: [{ googleMaps: {} }], // Enable Maps Grounding
        },
        history: historyContent
      });

      const response = await chat.sendMessage({ message: newMessage });
      
      const candidate = response.candidates?.[0];
      const text = candidate?.content?.parts?.map(p => p.text).join('') || "I couldn't generate a response. Please try again.";
      
      // Extract grounding metadata if available
      const groundingChunks = candidate?.groundingMetadata?.groundingChunks;

      return { text, groundingChunks };

    } catch (error) {
      console.error("Gemini API Error:", error);
      return {
        text: language === 'ur' 
          ? "معذرت، کچھ غلط ہو گیا۔ براہ کرم دوبارہ کوشش کریں۔" 
          : "Sorry, something went wrong. Please try again later.",
      };
    }
  }
}

export const geminiService = new GeminiService();