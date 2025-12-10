import { GoogleGenAI } from "@google/genai";
import { GenerationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Note: We no longer need the vector schema or second model call
// We only generate the image here.

export const generateIcon = async (
  name: string,
  description?: string,
  onStatusUpdate?: (status: string) => void
): Promise<GenerationResult> => {
  
  try {
    if (onStatusUpdate) onStatusUpdate("Dreaming up design...");
    
    // Step 1: Generate High-Contrast Raster Image
    const imageModel = "gemini-2.5-flash-image";
    
    // Updated prompt for simpler, text-free, bold line art
    const imagePrompt = `
      Create a strictly minimalist, black and white icon. 
      Subject: ${name}
      ${description ? `Context: ${description}` : ""}
      
      STRICT CONSTRAINTS:
      1. NO TEXT, NO WORDS, NO LETTERS. Visuals only.
      2. Style: Bold Line Art (Simulated Vector).
      3. Lines must be thick and uniform (simulate a bold stroke).
      4. High contrast: Pure black shapes on pure white background.
      5. Geometry: Use simple circles, rectangles, and rounded lines. Avoid complex details, textures, or shading.
      6. Aesthetic: Matches 'Lucide' or 'Feather' icons but bolder.
      
      This image will be auto-traced to SVG, so lines must be solid and distinct.
    `;

    const imageResponse = await ai.models.generateContent({
      model: imageModel,
      contents: { parts: [{ text: imagePrompt }] },
    });

    // Extract the image from the response
    let base64Image: string | null = null;
    let mimeType: string = "image/png";

    const parts = imageResponse.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          mimeType = part.inlineData.mimeType || "image/png";
          break;
        }
      }
    }

    if (!base64Image) {
      throw new Error("Failed to generate visual reference.");
    }

    const fullBase64 = `data:${mimeType};base64,${base64Image}`;

    // Return just the image data. The App component will handle vectorization.
    return {
      svg: "", // Will be filled by vectorizer
      name: name, // We just use the prompt name as we don't have an LLM renaming step anymore
      rasterImage: fullBase64
    };

  } catch (error) {
    console.error("Icon generation failed:", error);
    throw error;
  }
};
