import { GoogleGenAI } from "@google/genai";
import { GenerationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export type IconStyle = 
  // Base
  | 'lucid' 
  // 3D
  | 'photorealistic' | 'clay_3d' | 'low_poly' | 'glossy_3d' | 'rubber_3d' 
  | 'metallic_3d' | 'glass_3d' | 'voxel_3d' | 'balloon_3d' | 'liquid_3d'
  // Modern Professional 2D
  | 'material' | 'fluent' | 'logo_mark' | 'corporate' | 'startup' 
  | 'flat_25d' | 'duotone' | 'badge'
  // Hand-Drawn & Organic
  | 'crayon' | 'ink_sketch' | 'doodle' | 'comic' | 'chalk' | 'marker'
  // Abstract & Artistic
  | 'geometric' | 'fluid' | 'glitch' | 'single_line' | 'splatter' | 'negative_space'
  // Legacy / Specific Art Movements (Keeping high-value ones)
  | 'bauhaus' | 'art_deco' | 'brutalist' | 'mid_century' | 'cyberpunk' | 'pixel' | 'steampunk' | 'gothic';

const STYLE_PROMPTS: Record<IconStyle, string> = {
  // --- BASE ---
  lucid: `
    Style: STRICTLY Minimalist "Lucid" / "Feather" Icon.
    - Lines: Uniform thickness, rounded caps, rounded corners.
    - Geometry: Simple strokes, open shapes.
    - Vibe: Clean, friendly, tech-forward, functional.
  `,

  // --- 3D STYLES (Simulated in B&W) ---
  photorealistic: `
    Style: Photorealistic 3D Rendering (Black & White).
    - Visuals: Highly detailed shading, realistic lighting simulation.
    - Technique: Use fine hatching or stippling to represent greyscale depth using only pure black ink.
    - Vibe: Premium, cinema-quality, depth.
  `,
  clay_3d: `
    Style: Smooth Clay 3D (Soft Monochrome).
    - Visuals: Soft, rounded, organic forms.
    - Technique: Smooth shadows represented by solid black soft shapes. Low detail, high volume.
    - Vibe: Friendly, tactile, modern.
  `,
  low_poly: `
    Style: Low Poly 3D.
    - Visuals: Faceted geometric triangles, angular meshes.
    - Technique: High contrast shading on facets. Sharp edges.
    - Vibe: Digital, structural, modern gaming.
  `,
  glossy_3d: `
    Style: Glossy Plastic 3D.
    - Visuals: Shiny surfaces, distinct specular highlights.
    - Technique: Large white negative space highlights against black curved surfaces.
    - Vibe: Toy-like, sleek, modern.
  `,
  rubber_3d: `
    Style: Soft Rubber 3D.
    - Visuals: Matte finish, rounded edges, squishy appearance.
    - Technique: Soft ambient occlusion shadows, thick rounded outlines.
    - Vibe: Playful, flexible, safe.
  `,
  metallic_3d: `
    Style: Metallic 3D.
    - Visuals: Chrome/Brushed Metal.
    - Technique: High contrast horizon lines, sharp reflections.
    - Vibe: Industrial, premium, strong.
  `,
  glass_3d: `
    Style: Glass / Transparent 3D.
    - Visuals: Refraction, transparency, see-through layers.
    - Technique: Thin outlines, refraction lines, overlap indicators.
    - Vibe: Airy, light, futuristic.
  `,
  voxel_3d: `
    Style: Voxel Cubic 3D.
    - Visuals: Constructed from 3D cubes (Minecraft style).
    - Technique: Isometric grid alignment, blocky shading.
    - Vibe: Digital construction, retro-3D.
  `,
  balloon_3d: `
    Style: Inflated Balloon 3D.
    - Visuals: Puffy, tight seams, high internal pressure.
    - Technique: Round forms with pinch points and strong specular highlights.
    - Vibe: Party, light, pop.
  `,
  liquid_3d: `
    Style: Melting Liquid 3D.
    - Visuals: Dripping, flowing, viscous fluid.
    - Technique: Smooth curves, teardrop shapes, connecting blobs.
    - Vibe: Surreal, artistic, fluid.
  `,

  // --- MODERN PROFESSIONAL 2D ---
  material: `
    Style: Material Design (Google).
    - Visuals: Flat layers, paper-like physics.
    - Technique: Subtle drop shadows represented by solid black shapes. Clean geometric forms.
    - Vibe: Android, enterprise, clean.
  `,
  fluent: `
    Style: Fluent Design (Microsoft).
    - Visuals: Weightless, light, depth.
    - Technique: Clean lines, perspective hints, functional simplicity.
    - Vibe: Windows, modern UI, efficient.
  `,
  logo_mark: `
    Style: Logo Mark / Brand Identity.
    - Visuals: Bold, memorable, reductive.
    - Technique: Solid fills, high contrast, scalable vector aesthetic.
    - Vibe: Iconic, trustworthy, corporate.
  `,
  corporate: `
    Style: Corporate Minimal.
    - Visuals: Grid-based, ultra-clean, nonsense-free.
    - Technique: Thin to medium uniform lines, perfect geometry.
    - Vibe: Professional, serious, B2B.
  `,
  startup: `
    Style: Tech Startup / SaaS.
    - Visuals: Friendly geometry, slightly rounded but structured.
    - Technique: Bold strokes, simple composition, "Notion-style" simplicity.
    - Vibe: Modern, agile, digital.
  `,
  flat_25d: `
    Style: Flat 2.5D.
    - Visuals: Isometric perspective but flat colors.
    - Technique: Side faces are black, top faces white (or vice versa). Distinct planes.
    - Vibe: Informative, dimensional but clean.
  `,
  duotone: `
    Style: Duotone Split (Black & White).
    - Visuals: Sharp division between light and shadow.
    - Technique: One half of the icon is outlined, the other half is solid filled.
    - Vibe: Stylish, high contrast, modern.
  `,
  badge: `
    Style: Outlined Badge / Emblem.
    - Visuals: Enclosed in a shape (circle, hexagon, shield).
    - Technique: Uniform stroke width, contained composition.
    - Vibe: Official,verified, secure.
  `,

  // --- HAND DRAWN & ORGANIC ---
  crayon: `
    Style: Kids Crayon Drawing.
    - Visuals: Rough, waxy texture strokes.
    - Technique: Broken edges, uneven pressure, naive composition.
    - Vibe: Innocent, playful, raw.
  `,
  ink_sketch: `
    Style: Ink Sketch.
    - Visuals: Fast pen strokes, varying line width.
    - Technique: Loose gestural lines, ink bleed effect, imperfections.
    - Vibe: Human, artisanal, brainstorming.
  `,
  doodle: `
    Style: Notebook Doodle.
    - Visuals: Casual, loopy, ballpoint pen style.
    - Technique: Thin lines, multiple pass strokes, casual shading.
    - Vibe: Informal, creative, rough.
  `,
  comic: `
    Style: Comic Book / Pop.
    - Visuals: Dynamic, bold.
    - Technique: Heavy outlines, "Kirby dots" or speed lines for energy.
    - Vibe: Action, energetic, story.
  `,
  chalk: `
    Style: Chalk Texture.
    - Visuals: Dusty, grainy edges.
    - Technique: Stipple texture on edges, broad strokes. (Rendered as Black on White).
    - Vibe: Educational, rustic, handmade.
  `,
  marker: `
    Style: Permanent Marker.
    - Visuals: Thick, bold, slight bleed.
    - Technique: Heavy constant width lines, rounded ends.
    - Vibe: Bold, workshop, loud.
  `,

  // --- ABSTRACT & ARTISTIC ---
  geometric: `
    Style: Geometric Abstract.
    - Visuals: Shapes composed entirely of primitive circles, triangles, squares.
    - Technique: Clean lines, mathematical composition.
    - Vibe: Modern art, structured, purity.
  `,
  fluid: `
    Style: Fluid Organic.
    - Visuals: Amoeba-like shapes, no straight lines.
    - Technique: Smooth flowing curves, blobbiness.
    - Vibe: Natural, soft, adaptive.
  `,
  glitch: `
    Style: Glitch Art.
    - Visuals: Digital corruption, data moshing.
    - Technique: Horizontal slicing, pixel displacement, noise blocks.
    - Vibe: Cyber, error, edgy.
  `,
  single_line: `
    Style: Minimalist Single Line.
    - Visuals: Continuous line drawing.
    - Technique: One unbroken stroke defines the entire shape. No lifting the pen.
    - Vibe: Elegant, sophisticated, connected.
  `,
  splatter: `
    Style: Splatter / Ink Drop.
    - Visuals: Chaotic splashes, droplets.
    - Technique: Main shape defined by negative space amidst ink splatter or composed of splashes.
    - Vibe: Expressive, messy, energetic.
  `,
  negative_space: `
    Style: Negative Space.
    - Visuals: The subject is defined by what is NOT drawn.
    - Technique: Solid black background block with white subject cut out (or vice versa).
    - Vibe: Clever, bold, high contrast.
  `,

  // --- LEGACY / MOVEMENTS ---
  bauhaus: `
    Style: Bauhaus.
    - Visuals: Geometric primitives, asymmetry.
    - Vibe: Architectural, German modernism.
  `,
  art_deco: `
    Style: Art Deco.
    - Visuals: Sunbursts, parallel lines, geometric ornamentation.
    - Vibe: Luxury, retro-future.
  `,
  brutalist: `
    Style: Brutalist.
    - Visuals: Raw, blocky, anti-design.
    - Vibe: Strong, aggressive.
  `,
  mid_century: `
    Style: Mid-Century Modern.
    - Visuals: Atomic age, starbursts, kidney shapes.
    - Vibe: 1950s retro.
  `,
  cyberpunk: `
    Style: Cyberpunk.
    - Visuals: Circuitry, angular, high-tech.
    - Vibe: Dystopian, future.
  `,
  pixel: `
    Style: Pixel Art (8-bit).
    - Visuals: Grid-based squares.
    - Vibe: Retro gaming.
  `,
  steampunk: `
    Style: Steampunk.
    - Visuals: Gears, brass aesthetic (in B&W), victorian tech.
    - Vibe: Mechanical, retro-sci-fi.
  `,
  gothic: `
    Style: Gothic.
    - Visuals: Sharp arches, blackletter influence.
    - Vibe: Dark, medieval.
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

    // Updated prompt: Explicitly request an image at the start to prevent text-only responses
    const imagePrompt = `
      Generate an image of an icon.
      
      Requirements:
      - Subject: ${name}
      ${description ? `- Context/Metaphor: ${description}` : ""}
      - Color: Strictly Black (#000000) on White (#FFFFFF) background. No greyscale, no gradients.
      - Style: ${style}
      
      Style Details:
      ${styleInstruction}

      Constraints for Vector Tracing:
      - No text, letters, or words.
      - Shapes must be solid and distinct.
      - Centered composition.
      - High contrast.
    `;

    const imageResponse = await ai.models.generateContent({
      model: imageModel,
      contents: { parts: [{ text: imagePrompt }] },
    });

    // Extract the image from the response
    let base64Image: string | null = null;
    let mimeType: string = "image/png";
    let failureText = "";

    const parts = imageResponse.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          mimeType = part.inlineData.mimeType || "image/png";
          break;
        } else if (part.text) {
          failureText += part.text;
        }
      }
    }

    if (!base64Image) {
      console.warn("Gemini returned text instead of image:", failureText);
      const errorMessage = failureText 
        ? `Model Refusal: ${failureText.slice(0, 200)}` 
        : "Failed to generate visual reference (Empty response).";
      throw new Error(errorMessage);
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