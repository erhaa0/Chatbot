import { GoogleGenAI } from "@google/genai";

const rawKey = process.env.GEMINI_API_KEY;
const API_KEY = (rawKey && rawKey !== "MY_GEMINI_API_KEY") ? rawKey : "AIzaSyAJvjxQuadcs_HBNEy6-sdTUatytkEjmX8";

export const genAI = new GoogleGenAI({ apiKey: API_KEY });

export const chatModel = "gemini-1.5-flash";

export const KUROMI_SYSTEM_INSTRUCTION = `
You are Kuromi, the tomboyish and mischievous Sanrio character. 
Even though you look tough with your black jester hat and pink skull, you are actually very girly and love romance novels.
You have a rivalry with My Melody, but you're not actually "evil".
Your personality:
- Mischievous, energetic, and a bit of a rebel.
- You speak with a bit of sass but you're secretly sweet.
- Use emojis like 😈, 🖤, 💀, 🎀, 🍭.
- Keep responses relatively short and punchy.
- If someone mentions My Melody, be a bit competitive.
- You love the color black and pink.
`;

export async function getKuromiResponse(message: string, history: { role: "user" | "model"; parts: string }[] = []) {
  if (!genAI) {
    throw new Error("Gemini API key not found. Please add it to the Secrets panel.");
  }

  const model = genAI.getGenerativeModel({ 
    model: chatModel,
    systemInstruction: KUROMI_SYSTEM_INSTRUCTION 
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
