import { GoogleGenAI } from "@google/genai";
import { GenerationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export type IconStyle = 
  | 'lucid' 
  | 'bauhaus' 
  | 'swiss' 
  | 'art_deco' 
  | 'brutalist' 
  | 'mid_century' 
  | 'japanese' 
  | 'cyberpunk' 
  | 'sketch'
  | 'art_nouveau'
  | 'de_stijl'
  | 'pixel'
  | 'isometric'
  | 'tribal'
  | 'origami'
  | 'stencil'
  | 'victorian'
  | 'pop_art'
  | 'steampunk'
  | 'gothic';

const STYLE_PROMPTS: Record<IconStyle, string> = {
  lucid: `
    Style: STRICTLY Minimalist "Lucid" / "Feather" Icon.
    - Lines: Uniform thickness, rounded caps, rounded corners.
    - Geometry: Simple strokes, open shapes.
    - Vibe: Clean, friendly, tech-forward, functional.
    - Detail: Extremely low detail. Abstract representation.
  `,
  bauhaus: `
    Style: Bauhaus / Constructivist.
    - Visuals: Composition of basic geometric primitives (circles, squares, triangles).
    - Layout: Asymmetrical balance, structural.
    - Lines: Mix of heavy blocks and fine structural lines.
    - Vibe: Architectural, functional, German modernism.
  `,
  swiss: `
    Style: Swiss International Style.
    - Visuals: Grid-based, objective, mathematical.
    - Lines: Very heavy, bold, solid strokes. No decoration.
    - Geometry: Right angles, perfect circles. High impact.
    - Vibe: Corporate, reliable, objective, bold.
  `,
  art_deco: `
    Style: Art Deco / Streamline Moderne.
    - Visuals: Sunburst motifs, parallelism, geometric ornamentation.
    - Lines: Combination of thick and thin parallel lines.
    - Geometry: Symmetrical, elegant curves, sharp angles.
    - Vibe: Sophisticated, luxury, retro-future.
  `,
  brutalist: `
    Style: Brutalist / Neo-Brutalist.
    - Visuals: Raw, unpolished, heavy.
    - Lines: Thick, jagged, or blocky. "Anti-design" aesthetic.
    - Geometry: Exaggerated proportions, bold solid shadows.
    - Vibe: Aggressive, strong, web3, trendy.
  `,
  mid_century: `
    Style: Mid-Century Modern (Atomic Age).
    - Visuals: Organic kidney shapes, starbursts, boomerangs.
    - Lines: Fluid, rhythmic, playful.
    - Vibe: 1950s optimism, retro, human-centric.
  `,
  japanese: `
    Style: Japanese Minimalist (Hanko/Brush).
    - Visuals: Zen simplicity, negative space.
    - Lines: Mimics a sumi-e brush stroke OR extremely precise circular crest design (Kamon).
    - Vibe: Balanced, peaceful, refined.
  `,
  cyberpunk: `
    Style: Cyberpunk / Tech Interface.
    - Visuals: Circuitry patterns, glitches, data points.
    - Lines: Angular, 45-degree cuts, technical markings.
    - Vibe: Dystopian, high-tech, digital, futuristic.
  `,
  sketch: `
    Style: Hand-Drawn / Ink Sketch.
    - Visuals: Imperfect, organic, human touch.
    - Lines: Variable width, slightly wobbly (wabi-sabi), solid ink.
    - Vibe: Artisanal, draft, casual, creative.
  `,
  art_nouveau: `
    Style: Art Nouveau (Jugendstil).
    - Visuals: Flowing organic lines, whiplash curves, plant-like forms.
    - Lines: Elegant, sinuous, varying thickness.
    - Geometry: Asymmetrical, intertwining, decorative.
    - Vibe: Natural, romantic, vintage elegance.
  `,
  de_stijl: `
    Style: De Stijl / Neoplasticism.
    - Visuals: Strictly horizontal and vertical lines. No curves.
    - Lines: Thick black grids.
    - Geometry: Rectangular blocks, pure abstraction.
    - Vibe: Order, harmony, reductionist.
  `,
  pixel: `
    Style: Pixel Art / 8-Bit.
    - Visuals: Low-resolution digital aesthetic.
    - Lines: Stepped edges, blocky construction.
    - Geometry: Grid-aligned squares only.
    - Vibe: Retro gaming, digital nostalgia.
  `,
  isometric: `
    Style: Isometric 3D (Line Art).
    - Visuals: 30-degree angles, dimensional structures.
    - Lines: Clean, technical, precise.
    - Geometry: Cubes, spatial depth, engineering look.
    - Vibe: Structural, architectural, technical.
  `,
  tribal: `
    Style: Tribal / Aztec Geometric.
    - Visuals: Indigenous patterns, steps, repetitive motifs.
    - Lines: Bold, angular, solid fills.
    - Geometry: Diamonds, triangles, stairs.
    - Vibe: Ancient, cultural, bold.
  `,
  origami: `
    Style: Origami / Paper Fold.
    - Visuals: Faceted planes, sharp creases.
    - Lines: Angular, straight, no curves.
    - Geometry: Polygons, folded appearance.
    - Vibe: Sharp, precise, delicate yet structural.
  `,
  stencil: `
    Style: Industrial Stencil.
    - Visuals: Broken lines (bridges), spray-paint aesthetic.
    - Lines: Thick, disconnected segments.
    - Geometry: Military, crate markings, utilitarian.
    - Vibe: Urban, industrial, raw.
  `,
  victorian: `
    Style: Victorian / Woodcut.
    - Visuals: Etching style, hatching lines for shading.
    - Lines: Intricate, fine, engraved look.
    - Vibe: Classic, literary, vintage scientific.
  `,
  pop_art: `
    Style: Pop Art.
    - Visuals: Comic book style, bold impact.
    - Lines: Very thick outlines, high contrast.
    - Geometry: Dynamic, explosive, simplified.
    - Vibe: Energetic, commercial, loud.
  `,
  steampunk: `
    Style: Steampunk / Victorian Sci-Fi.
    - Visuals: Gears, cogs, brass aesthetics (in B&W), mechanical complexity.
    - Lines: Detailed, technical, ornamental.
    - Vibe: Retro-futuristic, mechanical, adventurous.
  `,
  gothic: `
    Style: Gothic / Blackletter.
    - Visuals: Sharp arches, spikes, dense detail.
    - Lines: Angular, vertical stress, calligraphy influence.
    - Vibe: Dark, medieval, intense, sharp.
  `
};

export const generateIcon = async (
  name: string,
  description?: string,
  onStatusUpdate?: (status: string) => void,
  style: IconStyle = 'lucid'
): Promise<GenerationResult> => {
  
  try {
    if (onStatusUpdate) onStatusUpdate(`Dreaming in ${style} style...`);
    
    // Step 1: Generate High-Contrast Raster Image
    const imageModel = "gemini-2.5-flash-image";
    
    const styleInstruction = STYLE_PROMPTS[style] || STYLE_PROMPTS['lucid'];

    // Updated prompt combines the specific style with the UNIVERSAL constraints required for vectorization
    const imagePrompt = `
      Create a strictly black and white icon.
      Subject: ${name}
      ${description ? `Context/Metaphor: ${description}` : ""}
      
      ${styleInstruction}

      UNIVERSAL CONSTRAINTS (MUST FOLLOW FOR AUTO-TRACING):
      1. NO TEXT, NO WORDS, NO LETTERS. Visuals only.
      2. COLOR: Pure Black (#000000) on Pure White (#FFFFFF) background only. No grays, no gradients.
      3. CLARITY: Shapes must be distinct and solid.
      4. COMPOSITION: Centered, balanced, suitable for a UI icon.
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
      name: name, 
      rasterImage: fullBase64
    };

  } catch (error) {
    console.error("Icon generation failed:", error);
    throw error;
  }
};