import { GoogleGenAI } from "@google/genai";
import { GenerationResult, IconStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    Style: Photorealistic 3D / Engraving style.
    - Visuals: Detailed lighting simulation using lines.
    - Technique: Use woodcut-style hatching or engraved lines to represent shading. Do not use gradients.
    - Vibe: Premium, detailed, classic 3D.
  `,
  photorealistic_angled: `
    Style: Photorealistic 3D (Angled View).
    - Visuals: Object shown in a 3/4 perspective or dynamic angle. Detailed lighting.
    - Technique: Woodcut-style hatching or engraved lines to represent shading and depth. Deep contrast.
    - Vibe: Cinematic, premium, classic 3D engraving.
  `,
  clay_3d: `
    Style: Smooth Clay 3D (Soft Monochrome).
    - Visuals: Soft, rounded, organic forms.
    - Technique: Thick, soft black outlines. Use blob-like black shadows to indicate depth.
    - Vibe: Friendly, tactile, modern.
  `,
  low_poly: `
    Style: Low Poly 3D (Wireframe/Faceted).
    - Visuals: Faceted geometric triangles, angular meshes.
    - Technique: CRITICAL: Draw black outlines for EVERY edge of the polygons. Do not use solid fills. It must look like a wireframe or stained glass.
    - Vibe: Digital, structural, modern gaming.
  `,
  glossy_3d: `
    Style: Glossy Plastic 3D.
    - Visuals: Shiny surfaces, distinct specular highlights.
    - Technique: Black surfaces with large, sharp WHITE shapes to represent reflection. High contrast light and dark.
    - Vibe: Toy-like, sleek, modern.
  `,
  isometric_3d: `
    Style: Isometric 3D (Line Art).
    - Visuals: 30-degree angles, dimensional structures, cubes, spatial depth.
    - Technique: Uniform line weight, clean technical drawing.
    - Vibe: Structural, engineering, precise.
  `,
  isometric_photoreal: `
    Style: Photorealistic Isometric (45° Technical).
    - Visuals: 45-degree high-angle orthographic projection.
    - Technique: Extremely clean, fine, technical line art. Realistic proportions.
    - Vibe: Architectural, product design, engineering, premium realism.
  `,
  metallic_3d: `
    Style: Metallic 3D.
    - Visuals: Chrome/Brushed Metal.
    - Technique: High contrast horizon lines. Use bands of black and white to simulate cylindrical reflections.
    - Vibe: Industrial, premium, strong.
  `,
  glass_3d: `
    Style: Glass / Transparent 3D.
    - Visuals: Refraction, transparency, see-through layers.
    - Technique: Thin outlines, refraction lines, overlap indicators.
    - Vibe: Airy, light, futuristic.
  `,
  voxel_3d: `
    Style: Voxel Cubic 3D (Outlined).
    - Visuals: Stacked 3D cubes (Minecraft style).
    - Technique: Draw THICK BLACK OUTLINES for every individual cube. Distinct separation between blocks is required.
    - Vibe: Digital construction, retro-3D.
  `,
  balloon_3d: `
    Style: Inflated Balloon 3D.
    - Visuals: Puffy, tight seams, high internal pressure.
    - Technique: Round forms with pinch points. Use white circular highlights on black forms to show gloss.
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
    Style: Ink Sketch (Legacy).
    - Visuals: Fast pen strokes, varying line width.
    - Technique: Loose gestural lines, ink bleed effect, imperfections.
    - Vibe: Human, artisanal, brainstorming.
  `,
  sketch: `
    Style: Hand-Drawn / Ink Sketch.
    - Visuals: Imperfect, organic, variable width lines.
    - Technique: Slightly wobbly (wabi-sabi) lines.
    - Vibe: Artisanal, casual.
  `,
  doodle: `
    Style: Notebook Doodle.
    - Visuals: Casual, loopy, ballpoint pen style.
    - Technique: Thin lines, multiple pass strokes, casual shading.
    - Vibe: Informal, creative, rough.
  `,
  comic: `
    Style: Comic Book / Pop (Legacy).
    - Visuals: Dynamic, bold.
    - Technique: Heavy outlines, "Kirby dots" or speed lines for energy.
    - Vibe: Action, energetic, story.
  `,
  pop_art: `
    Style: Pop Art.
    - Visuals: Comic book style, high contrast, dynamic explosive shapes.
    - Technique: Very thick outlines.
    - Vibe: Energetic, loud.
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

  // --- ART MOVEMENTS & THEMATIC (User Requested List) ---
  bauhaus: `
    Style: Bauhaus / Constructivist.
    - Visuals: Basic geometric primitives (circles, squares, triangles), asymmetrical balance.
    - Technique: Mix of heavy blocks and fine lines.
  `,
  swiss: `
    Style: Swiss International Style.
    - Visuals: Grid-based, mathematical, right angles, perfect circles.
    - Technique: Very heavy bold strokes.
    - Vibe: Corporate, reliable.
  `,
  art_deco: `
    Style: Art Deco / Streamline Moderne.
    - Visuals: Sunburst motifs, parallelism, symmetrical, elegant curves.
    - Technique: Thick/thin parallel lines.
    - Vibe: Sophisticated, luxury.
  `,
  brutalist: `
    Style: Brutalist / Neo-Brutalist.
    - Visuals: Raw, unpolished, exaggerated proportions, bold shadows.
    - Technique: Thick jagged/blocky lines.
    - Vibe: Aggressive, web3.
  `,
  mid_century: `
    Style: Mid-Century Modern (Atomic Age).
    - Visuals: Organic kidney shapes, starbursts, boomerangs, fluid rhythmic lines.
    - Vibe: 1950s optimism.
  `,
  japanese: `
    Style: Japanese Minimalist (Hanko/Brush).
    - Visuals: Zen simplicity, negative space.
    - Technique: Sumi-e brush strokes OR precise Kamon crest design.
  `,
  cyberpunk: `
    Style: Cyberpunk / Tech Interface.
    - Visuals: Circuitry patterns, glitches, data points, angular 45-degree cuts.
    - Vibe: Dystopian, high-tech.
  `,
  art_nouveau: `
    Style: Art Nouveau (Jugendstil).
    - Visuals: Flowing organic lines, whiplash curves, plant-like forms.
    - Technique: Sinuous varying thickness.
    - Vibe: Natural, romantic.
  `,
  de_stijl: `
    Style: De Stijl / Neoplasticism.
    - Visuals: Strictly horizontal/vertical lines, rectangular blocks.
    - Technique: Thick black grids.
    - Vibe: Order, harmony.
  `,
  pixel: `
    Style: Pixel Art / 8-Bit.
    - Visuals: Low-resolution digital aesthetic, stepped edges.
    - Technique: Blocky, grid-aligned squares.
    - Vibe: Retro gaming.
  `,
  tribal: `
    Style: Tribal / Aztec Geometric.
    - Visuals: Indigenous patterns, steps, repetitive motifs.
    - Technique: Bold angular lines, diamonds/triangles/stairs.
  `,
  origami: `
    Style: Origami / Paper Fold.
    - Visuals: Faceted planes, sharp creases, polygons.
    - Technique: Angular straight lines.
    - Vibe: Sharp, precise.
  `,
  stencil: `
    Style: Industrial Stencil.
    - Visuals: Spray-paint aesthetic.
    - Technique: Broken lines (bridges), thick disconnected segments.
    - Vibe: Urban, industrial.
  `,
  victorian: `
    Style: Victorian / Woodcut.
    - Visuals: Etching style, intricate fine engraved look.
    - Technique: Hatching lines for shading.
    - Vibe: Classic, vintage scientific.
  `,
  steampunk: `
    Style: Steampunk / Victorian Sci-Fi.
    - Visuals: Gears, cogs, brass aesthetics, mechanical complexity.
    - Technique: Detailed ornamental lines.
  `,
  gothic: `
    Style: Gothic / Blackletter.
    - Visuals: Sharp arches, spikes, dense detail, calligraphy influence.
    - Technique: Angular vertical stress.
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
    
    // Fallback to lucid if style not found
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
      - If style is 3D, ensure outlines are black and inner volumes are white or clearly separated.
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