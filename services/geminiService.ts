
import { GoogleGenAI, Type } from "@google/genai";
import { CrisisManifesto, KeywordArchetype, Language } from "../types";

export async function getCrisisManifesto(crisisName: string, lang: Language = 'de'): Promise<CrisisManifesto> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const languageInstructions = lang === 'de' 
    ? "Antworte ausschließlich auf DEUTSCH. Nutze einen präzisen, hochenergetischen akademischen Stil (Kritische Theorie, Poststrukturalismus, Systemtheorie)."
    : "Respond exclusively in ENGLISH. Use a precise, high-level academic style (Critical Theory, Post-Structuralism, Systems Theory).";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", 
      contents: `Perform a systemic deconstruction and scientific diagnosis of the phenomenon: "${crisisName}". 
      
      ${languageInstructions}

      Analysis Framework:
      1. PHILOSOPHICAL DISCOURSE: Discuss the phenomenon through the lens of thinkers like Adorno, Foucault, Mbembe, or Mark Fisher.
      2. SCIENTIFIC ANALYSIS: Apply Systems Theory or Physics.
      3. BASAL Q&A (W-FRAGEN): Provide clear, concise answers to: What exactly is it? Who is affected/responsible? Where is the epicenter? When does it become critical? Why is it happening now? How can the system be stabilized?
      4. EMPIRICAL DATA: Use Google Search for verified statistics (2020-2025).
      5. TONE: Cold, diagnostic, structuralist.

      Constraints:
      - NO BOLD TEXT.
      - Use markdown for structure but keep it minimal.
      - Ensure the output is valid JSON.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 2000 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            definition: { type: Type.STRING },
            philosophicalDiscourse: { type: Type.STRING },
            scientificAnalysis: { type: Type.STRING },
            qa: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING }
                },
                required: ["question", "answer"]
              }
            },
            symptoms: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "description"]
              } 
            },
            consequences: { type: Type.STRING },
            callToAction: { type: Type.STRING },
            philosophicalFragment: { type: Type.STRING },
            historicalContext: { type: Type.STRING },
            historicalTimeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  year: { type: Type.STRING },
                  location: { type: Type.STRING },
                  event: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["year", "location", "event", "description"]
              }
            },
            sociopsychologicalAnalysis: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            statisticalData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING },
                  trend: { type: Type.STRING, enum: ["up", "down", "stable"] },
                  isVerified: { type: Type.BOOLEAN },
                  interpretation: { type: Type.STRING }
                },
                required: ["label", "value", "trend", "interpretation"]
              }
            },
            visualizationData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.NUMBER }
                },
                required: ["label", "value"]
              }
            },
            visualPrompt: { type: Type.STRING }
          },
          required: ["definition", "philosophicalDiscourse", "scientificAnalysis", "qa", "symptoms", "consequences", "callToAction", "philosophicalFragment", "historicalContext", "historicalTimeline", "sociopsychologicalAnalysis", "keywords", "statisticalData", "visualizationData", "visualPrompt"]
        }
      }
    });

    const parsedData: any = JSON.parse(response.text);
    const sources: string[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) sources.push(chunk.web.uri);
      });
    }

    return {
      ...parsedData,
      sources: [...new Set(sources)].slice(0, 8),
      lastUpdated: new Date().toISOString()
    };
  } catch (err) {
    console.error("Gemini Text Error:", err);
    throw err;
  }
}

export async function getArchetypeAnalysis(keyword: string, lang: Language = 'de'): Promise<KeywordArchetype> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const languageInstructions = lang === 'de' 
    ? "Antworte ausschließlich auf DEUTSCH. Nutze einen präzisen, akademischen Stil."
    : "Respond exclusively in ENGLISH. Use a precise, academic style.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Deep dive into the archetype/site: "${keyword}". 
      ${languageInstructions}
      Requirements: Analytical tone, zero moralization. Focus on the spatial and symbolic logic.`,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 1000 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            etymology: { type: Type.STRING },
            scientificPerspective: { type: Type.STRING },
            socioCulturalLens: { type: Type.STRING },
            manifestation: { type: Type.STRING },
            visualPrompt: { type: Type.STRING }
          },
          required: ["id", "title", "etymology", "scientificPerspective", "socioCulturalLens", "manifestation", "visualPrompt"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (err) {
    console.error("Archetype Gemini Error:", err);
    throw err;
  }
}

export async function generateCrisisImage(prompt: string): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `ULTRA-MINIMALIST SWISS-SWEDISH DESIGN PHOTOGRAPHY. Monochrome, heavy film grain. Brutalist architecture, concrete, high contrast shadows. Subject: ${prompt}`,
          },
        ],
      },
      config: { imageConfig: { aspectRatio: "16:9" } },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (err) {
    console.warn("Image Generation Failed:", err);
  }
  return "";
}
