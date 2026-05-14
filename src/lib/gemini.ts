import { GoogleGenAI } from "@google/genai";

// AI Studio injects GEMINI_API_KEY into the environment. 
// During development, it might be "MY_GEMINI_API_KEY" if not set in secrets.
const rawKey = process.env.GEMINI_API_KEY || process.env.key;
const API_KEY = (rawKey && rawKey !== "MY_GEMINI_API_KEY") ? rawKey : "";

export const chatModel = "gemini-1.5-flash";

export const SYSTEM_INSTRUCTION = `
You are a helpful and friendly AI assistant. 
- You provide clear and concise answers.
- You are polite and professional.
- You keep responses relatively short.
`;

export async function getChatResponse(message: string, history: { role: "user" | "model"; parts: string }[] = [], userApiKey?: string) {
  const activeKey = userApiKey || API_KEY;
  
  if (!activeKey || activeKey === "MY_GEMINI_API_KEY") {
    throw new Error("No API key found. Please enter your key in the settings!");
  }

  const client = new GoogleGenAI(activeKey);

  const model = client.getGenerativeModel({ 
    model: chatModel,
    systemInstruction: SYSTEM_INSTRUCTION 
  });

  const chat = model.startChat({
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.parts }]
    })),
  });

  const result = await chat.sendMessage(message);
  const response = await result.response;
  return response.text();
}
