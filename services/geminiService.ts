import { GoogleGenAI } from "@google/genai";
import { GenerationResult, IconStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const STYLE_PROMPTS: Record<IconStyle, string> = {
  // --- BASE ---
  lucid: `
    Style: Minimalist "Lucid" Icon.
    - Uniform line thickness, rounded caps.
    - Simple strokes, open shapes.
    - Clean, friendly, functional.
  `,

  // --- 3D STYLES ---
  photorealistic: `
    Style: Photorealistic Engraving.
    - Detailed lighting using lines.
    - Woodcut-style hatching for shading. No gradients.
    - Premium, classic.
  `,
  photorealistic_angled: `
    Style: Photorealistic Angled View.
    - Object in 3/4 perspective.
    - Woodcut-style hatching for depth. Deep contrast.
    - Cinematic, premium.
  `,
  clay_3d: `
    Style: Soft Clay 3D.
    - Soft, rounded, organic forms.
    - Thick, soft black outlines. Blob-like shadows.
    - Friendly, tactile.
  `,
  low_poly: `
    Style: Low Poly Wireframe.
    - Faceted geometric triangles.
    - Black outlines for every polygon edge. No solid fills.
    - Digital, structural.
  `,
  glossy_3d: `
    Style: Glossy Plastic.
    - Shiny surfaces, specular highlights.
    - Black surfaces with sharp WHITE shapes for reflection.
    - Toy-like, sleek.
  `,
  isometric_3d: `
    Style: Isometric Line Art.
    - 30-degree angles, dimensional structures.
    - Uniform line weight, technical drawing.
    - Structural, precise.
  `,
  isometric_rounded: `
    Style: Rounded Isometric (45 degrees).
    - Isometric view with smoothed, rounded edges.
    - Clean lines, friendly geometry.
    - Soft, modern.
  `,
  metallic_3d: `
    Style: Metallic.
    - Chrome/Brushed Metal.
    - High contrast horizon lines. Bands of black and white for reflection.
    - Industrial, strong.
  `,
  glass_3d: `
    Style: Glass / Transparent.
    - Refraction, transparency.
    - Thin outlines, refraction lines, overlap indicators.
    - Airy, futuristic.
  `,
  voxel_3d: `
    Style: Voxel Cubic (Outlined).
    - Stacked 3D cubes.
    - Thick black outlines for every cube. Distinct separation.
    - Digital construction.
  `,
  balloon_3d: `
    Style: Inflated Balloon.
    - Puffy, tight seams.
    - Round forms with pinch points. White circular highlights.
    - Party, pop.
  `,
  liquid_3d: `
    Style: Melting Liquid.
    - Dripping, flowing, viscous fluid.
    - Smooth curves, teardrops, connecting blobs.
    - Surreal, fluid.
  `,

  // --- LOGO & PROFESSIONAL ---
  material: `
    Style: Material Design.
    - Flat layers, paper physics.
    - Solid black shapes for shadows. Geometric forms.
    - Enterprise, clean.
  `,
  fluent: `
    Style: Fluent Design.
    - Weightless, light, depth.
    - Clean lines, perspective hints.
    - Modern UI, efficient.
  `,
  logo_mark: `
    Style: Logo Mark.
    - Bold, memorable, reductive.
    - Solid fills, high contrast.
    - Iconic, corporate.
  `,
  corporate: `
    Style: Corporate Minimal.
    - Grid-based, ultra-clean.
    - Thin to medium uniform lines, perfect geometry.
    - Professional, B2B.
  `,
  startup: `
    Style: Tech Startup.
    - Friendly geometry, slightly rounded.
    - Bold strokes, simple composition.
    - Modern, agile.
  `,
  mascot: `
    Style: Esports Mascot.
    - Aggressive, dynamic character.
    - Thick bold outer contours, angular shading blocks.
    - Competitive, energetic.
  `,
  monogram: `
    Style: Luxury Monogram.
    - Interwoven lines, letter-like abstraction.
    - Consistent stroke width, symmetry.
    - High-end, sophisticated.
  `,
  flat_25d: `
    Style: Flat 2.5D.
    - Isometric perspective, flat colors.
    - distinct planes (black vs white).
    - Informative, clean.
  `,
  duotone: `
    Style: Duotone Split.
    - Sharp division between light and shadow.
    - Half outlined, half solid filled.
    - Stylish, modern.
  `,
  badge: `
    Style: Outlined Badge.
    - Enclosed in a shape (circle/shield).
    - Uniform stroke width.
    - Official, verified.
  `,

  // --- TECHNICAL & SCHEMATIC ---
  blueprint: `
    Style: Technical Blueprint.
    - Engineering diagram.
    - Thin precise lines, small dashed construction lines.
    - Planned, industrial.
  `,
  architectural: `
    Style: Architectural Sketch.
    - Draftsman concept.
    - Loose but straight lines, corner overshoots.
    - Creative, structural.
  `,
  circuit: `
    Style: PCB Circuit.
    - Tech nodes, traces.
    - Lines ending in dots. 45-degree turns.
    - Hardware, electronic.
  `,
  neon: `
    Style: Neon Sign.
    - Glowing glass tubes.
    - Double outlines (parallel lines), rounded ends.
    - Nightlife, retro-tech.
  `,

  // --- FUN & COMIC ---
  kawaii: `
    Style: Kawaii / Cute.
    - Exaggerated rounded proportions, big heads.
    - Soft rounded lines, minimal detail.
    - Adorable, happy.
  `,
  classic_animation: `
    Style: Classic Animation.
    - Smooth, flowing line art.
    - Elegant tapered ink lines.
    - Magical, polished.
  `,
  rubber_hose: `
    Style: Vintage 1930s Cartoon.
    - Pie-cut eyes, noodle limbs.
    - Uniform thick black lines, bounce.
    - Retro, cheerful.
  `,
  tv_cartoon: `
    Style: Prime Time TV Cartoon.
    - Overbites, distinct silhouettes.
    - Clean uniform outlines.
    - Satirical, funny.
  `,
  superhero: `
    Style: Superhero Comic.
    - Dynamic action, heavy shadows (spot blacks).
    - Varying line weights, musculature.
    - Epic, strong.
  `,
  graffiti: `
    Style: Graffiti.
    - Bubble letters style, drips.
    - Ultra thick outlines.
    - Urban, rebellious.
  `,
  retro_anime: `
    Style: 90s Retro Anime.
    - Cel-shaded, dramatic lighting.
    - Sharp angular shadow blocks against white.
    - Nostalgic, action.
  `,
  sticker: `
    Style: Die-Cut Sticker.
    - Sticker with border.
    - Very thick bold outer contour.
    - Collectible, pop.
  `,
  comic: `
    Style: Comic Book.
    - Dynamic, bold.
    - Heavy outlines, "Kirby dots".
    - Action, story.
  `,
  pop_art: `
    Style: Pop Art.
    - High contrast, explosive shapes.
    - Very thick outlines.
    - Energetic, loud.
  `,

  // --- CRAFT & TEXTURE ---
  paper_cutout: `
    Style: Paper Cutout.
    - Layered paper.
    - Shapes defined by sharp drop shadows.
    - Craft, tactile.
  `,
  embroidery: `
    Style: Embroidery.
    - Thread texture.
    - Lines made of small stitches.
    - Handmade, cozy.
  `,

  // --- HAND DRAWN & ORGANIC ---
  crayon: `
    Style: Crayon Drawing.
    - Rough, waxy texture.
    - Broken edges, uneven pressure.
    - Innocent, playful.
  `,
  ink_sketch: `
    Style: Ink Sketch.
    - Fast pen strokes.
    - Loose gestural lines, ink bleed.
    - Human, artisanal.
  `,
  sketch: `
    Style: Hand-Drawn Sketch.
    - Imperfect, variable width lines.
    - Slightly wobbly.
    - Casual.
  `,
  doodle: `
    Style: Notebook Doodle.
    - Casual, loopy, ballpoint.
    - Thin lines, multiple pass strokes.
    - Informal, creative.
  `,
  chalk: `
    Style: Chalk.
    - Dusty, grainy edges.
    - Stipple texture. (Black on White).
    - Rustic, handmade.
  `,
  marker: `
    Style: Permanent Marker.
    - Thick, bold, slight bleed.
    - Heavy constant width lines.
    - Bold, loud.
  `,

  // --- ABSTRACT & ARTISTIC ---
  geometric: `
    Style: Geometric Abstract.
    - Primitives (circles, triangles, squares).
    - Clean lines, mathematical.
    - Modern art, structured.
  `,
  fluid: `
    Style: Fluid Organic.
    - Amoeba-like shapes, no straight lines.
    - Smooth flowing curves.
    - Natural, soft.
  `,
  glitch: `
    Style: Glitch Art.
    - Digital corruption.
    - Horizontal slicing, pixel displacement.
    - Cyber, edgy.
  `,
  single_line: `
    Style: Single Line.
    - Continuous line drawing.
    - One unbroken stroke.
    - Elegant, connected.
  `,
  splatter: `
    Style: Splatter.
    - Chaotic splashes.
    - Shape defined by negative space or splashes.
    - Expressive, messy.
  `,
  negative_space: `
    Style: Negative Space.
    - Subject defined by what is NOT drawn.
    - Solid black block with white cutout.
    - Clever, bold.
  `,

  // --- ART MOVEMENTS & THEMATIC ---
  bauhaus: `
    Style: Bauhaus.
    - Geometric primitives, asymmetrical.
    - Mix of heavy blocks and fine lines.
  `,
  swiss: `
    Style: Swiss International.
    - Grid-based, mathematical.
    - Very heavy bold strokes.
    - Corporate.
  `,
  art_deco: `
    Style: Art Deco.
    - Sunbursts, parallel lines.
    - Elegant curves.
    - Luxury.
  `,
  brutalist: `
    Style: Brutalist.
    - Raw, blocky, exaggerated.
    - Thick jagged lines.
    - Aggressive.
  `,
  mid_century: `
    Style: Mid-Century Modern.
    - Organic kidney shapes, starbursts.
    - Fluid rhythmic lines.
    - Optimistic.
  `,
  japanese: `
    Style: Japanese Minimalist.
    - Zen simplicity.
    - Brush strokes or crest design.
  `,
  cyberpunk: `
    Style: Cyberpunk.
    - Circuitry, glitches, angular cuts.
    - High-tech.
  `,
  art_nouveau: `
    Style: Art Nouveau.
    - Flowing organic lines, plant forms.
    - Sinuous varying thickness.
    - Romantic.
  `,
  de_stijl: `
    Style: De Stijl.
    - Horizontal/vertical lines only.
    - Thick black grids.
    - Order.
  `,
  pixel: `
    Style: Pixel Art.
    - Low-res, stepped edges.
    - Blocky squares.
    - Retro.
  `,
  tribal: `
    Style: Tribal.
    - Indigenous patterns.
    - Bold angular lines.
  `,
  origami: `
    Style: Origami.
    - Faceted planes, creases.
    - Angular straight lines.
    - Precise.
  `,
  stencil: `
    Style: Stencil.
    - Bridges, broken lines.
    - Thick segments.
    - Urban.
  `,
  victorian: `
    Style: Victorian Woodcut.
    - Intricate fine engraved look.
    - Hatching lines.
    - Vintage.
  `,
  steampunk: `
    Style: Steampunk.
    - Gears, brass aesthetics.
    - Detailed ornamental lines.
  `,
  gothic: `
    Style: Gothic.
    - Sharp arches, spikes.
    - Angular vertical stress.
    - Dark.
  `
};

// Helper to extract base64 from response
const extractImage = (response: any): string => {
    const candidate = response.candidates?.[0];
    
    if (!candidate) {
        throw new Error("Gemini API returned no candidates. This usually implies a filter block.");
    }

    if (candidate.finishReason && candidate.finishReason !== "STOP") {
        console.warn("Gemini finish reason:", candidate.finishReason);
        if (!candidate.content) {
             throw new Error(`Generation stopped. Reason: ${candidate.finishReason}`);
        }
    }

    let base64Image: string | null = null;
    let mimeType: string = "image/png";
    let failureText = "";

    const parts = candidate.content?.parts;
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
      // Check if it looks like an empty code block which often signifies a model confusion/refusal
      if (failureText.includes("```")) {
         console.warn("Model returned code block instead of image:", failureText);
         throw new Error("The model refused to generate an image (returned text/code block). Please try simpler terms.");
      }
      
      console.warn("Gemini returned text instead of image:", failureText);
      const errorMessage = failureText 
        ? `Model Output Text: ${failureText.slice(0, 200)}` 
        : `Failed to generate image. Finish Reason: ${candidate.finishReason || 'Unknown'}`;
      throw new Error(errorMessage);
    }

    return `data:${mimeType};base64,${base64Image}`;
}

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
    
    // Fallback to lucid if style not found
    const styleInstruction = STYLE_PROMPTS[style] || STYLE_PROMPTS['lucid'];

    // Simplified prompt to avoid model confusion/refusal
    const imagePrompt = `
      Generate an icon image.
      
      Subject: ${name}
      ${description ? `Context: ${description}` : ""}
      Style: ${style}
      
      Visual Rules:
      ${styleInstruction}

      Constraints:
      - Output: Image only.
      - Color: Black shapes on White background.
      - Content: Visual representation only.
      - Negative Constraint: Do not include the text "${name}" or any words in the image.
      - No gradients, no greyscale.
    `;

    const imageResponse = await ai.models.generateContent({
      model: imageModel,
      contents: { parts: [{ text: imagePrompt }] },
    });

    const fullBase64 = extractImage(imageResponse);

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

export const generateIconFromReference = async (
    name: string,
    description: string,
    referenceImageBase64: string, // Raw base64 string
    mimeType: string,
    onStatusUpdate?: (status: string) => void,
    style: IconStyle = 'lucid'
  ): Promise<GenerationResult> => {
      
      try {
        if (onStatusUpdate) onStatusUpdate(`Analyzing reference & applying ${style}...`);
        
        const imageModel = "gemini-2.5-flash-image";
        const styleInstruction = STYLE_PROMPTS[style] || STYLE_PROMPTS['lucid'];
    
        const imagePrompt = `
          Role: Icon Artist.
          
          Task: Restyle the reference image into an icon.
          Target Style: ${style}
          Subject: ${name}
          Context: ${description}

          Instructions:
          1. Use the reference for pose and composition only.
          2. IGNORE realistic textures and shading.
          3. Re-draw everything using the "${style}" style rules.
          4. If people are present, caricature them to match the style (e.g. adjust proportions, simplify faces).

          Visual Rules:
          ${styleInstruction}

          Output Requirements:
          - Pure Black & White (No Greyscale).
          - Flat vector illustration style (No Gradients).
          - Visuals only. Do not write the text "${name}" inside the image.
          - RETURN IMAGE ONLY.
        `;
    
        // Order changed: Image first, then prompt, to help model context.
        const imageResponse = await ai.models.generateContent({
          model: imageModel,
          contents: {
              parts: [
                  { 
                      inlineData: {
                          mimeType: mimeType,
                          data: referenceImageBase64
                      }
                  },
                  { text: imagePrompt }
              ]
          },
        });
    
        const fullBase64 = extractImage(imageResponse);
    
        return {
          svg: "",
          name: name,
          rasterImage: fullBase64
        };
    
      } catch (error) {
        console.error("Photo transformation failed:", error);
        throw error;
      }
  };