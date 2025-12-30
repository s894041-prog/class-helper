
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateTeamNames(count: number, theme: string): Promise<string[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `請根據主題「${theme}」，為教室活動生成 ${count} 個富有創意且有趣的中文小組隊名。請確保名稱簡短且適合學生。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            names: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "小組隊名列表"
            }
          },
          required: ["names"]
        }
      }
    });

    const data = JSON.parse(response.text);
    return data.names || Array.from({ length: count }, (_, i) => `第 ${i + 1} 組`);
  } catch (error) {
    console.error("Error generating team names:", error);
    return Array.from({ length: count }, (_, i) => `第 ${i + 1} 組`);
  }
}
