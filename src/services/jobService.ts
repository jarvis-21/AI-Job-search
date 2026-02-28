import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface Job {
  title: string;
  company: string;
  location: string;
  experience: string;
  postedDate: string;
  url: string;
  source: string;
  description: string;
}

export async function fetchDataEngineerJobs(): Promise<Job[]> {
  const prompt = `Find the latest Data Engineer job postings from the last 24 hours. 
  Focus on roles requiring 2-3 years of experience. 
  Search across major portals like LinkedIn, Naukri, Wellfound, and Foundit.
  Return the results as a JSON array of objects with these fields: 
  title, company, location, experience, postedDate, url, source, description.
  Ensure the experience level is strictly around 2-3 years.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              company: { type: Type.STRING },
              location: { type: Type.STRING },
              experience: { type: Type.STRING },
              postedDate: { type: Type.STRING },
              url: { type: Type.STRING },
              source: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ["title", "company", "url"],
          },
        },
      },
    });

    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}
