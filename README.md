<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# LucidGen Icon Creator

**AI-Powered SVG Icon Generator**

Generate beautiful, scalable vector icons from text descriptions using Google's Gemini AI.

[View Demo](https://ai.studio/apps/drive/1DW5We2QD9d22S8P3uInHC81JSBcV3bAK) | [Report Bug](https://github.com/Clemens865/Lucid-Icon-Creator/issues)

</div>

---

## What is LucidGen?

LucidGen is an AI-powered icon generator that creates scalable vector graphics (SVG) from simple text descriptions. It uses **Google Gemini 2.5 Flash** to generate high-contrast black & white images, then automatically traces them to clean SVG format using **ImageTracerJS**.

## How It Works

1. **Describe** - Enter an icon name (e.g., "Rocket") and optional details
2. **Generate** - Gemini AI creates a high-contrast black & white raster image
3. **Trace** - ImageTracerJS converts the image to clean vector paths
4. **Download** - Export as SVG, ready for use in your projects

All processing happens locally in your browser after the AI generation step.

## Features

- **Single Icon Mode** - Generate icons one at a time with real-time preview
- **Batch Mode** - Upload a CSV file to generate multiple icons automatically
- **20 Artistic Styles** - From minimalist to elaborate, across 6 style categories
- **Instant SVG Export** - Download individual icons or bulk export as ZIP
- **Local History** - Your generations are saved in browser storage
- **Privacy First** - Files processed locally, nothing stored on servers

## Available Styles

### Modern UI
| Style | Description |
|-------|-------------|
| `lucid` | Minimalist with uniform lines, rounded caps, clean geometry |
| `swiss` | Grid-based, mathematical, heavy bold strokes |
| `bauhaus` | Geometric primitives, asymmetrical balance |

### Art Movements
| Style | Description |
|-------|-------------|
| `art_nouveau` | Flowing organic lines, whiplash curves, plant-like forms |
| `art_deco` | Sunburst motifs, parallelism, elegant curves |
| `de_stijl` | Strictly horizontal/vertical lines, black grids |
| `mid_century` | Organic shapes, starbursts, 1950s optimism |
| `pop_art` | Comic book style, very thick outlines, high contrast |
| `brutalist` | Raw, unpolished, thick jagged blocky lines |

### Technical
| Style | Description |
|-------|-------------|
| `isometric` | 30-degree angles, dimensional 3D structures |
| `pixel` | 8-bit low-resolution, stepped edges, blocky |
| `stencil` | Spray-paint aesthetic, broken lines, industrial |
| `origami` | Faceted planes, sharp creases, polygons |

### Thematic
| Style | Description |
|-------|-------------|
| `cyberpunk` | Circuitry patterns, glitches, angular cuts |
| `steampunk` | Gears, cogs, mechanical complexity |
| `gothic` | Sharp arches, spikes, dense detail |

### Artistic
| Style | Description |
|-------|-------------|
| `sketch` | Hand-drawn ink, variable width, organic lines |
| `victorian` | Etching style, hatching, engraved look |

### Cultural
| Style | Description |
|-------|-------------|
| `japanese` | Zen simplicity, sumi-e brush or Kamon crest |
| `tribal` | Indigenous patterns, diamonds, triangles, stairs |

## Batch Upload

Generate multiple icons at once using CSV upload:

1. **Download Template** - Get the CSV template with the correct format
2. **Fill In Your Icons** - Add rows with `Icon Name,Details (Optional)`
3. **Upload & Process** - The system processes each icon with a 5-second cooldown between requests (API rate limiting)
4. **Download All** - Export all generated icons as a ZIP file

**CSV Format:**
```csv
Icon Name,Details (Optional)
Rocket,A simple rocket ship taking off
Leaf,A minimal oak leaf
Settings,A gear icon
```

## Download Options

- **Single Icon** - Click the download button on any generated icon card
- **Download All (ZIP)** - Bulk export all icons in your history as a ZIP file
- **Copy SVG** - Copy the raw SVG code to clipboard

---

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

3. Run the app:
   ```bash
   npm run dev
   ```

## View in AI Studio

View your app in AI Studio: https://ai.studio/apps/drive/1DW5We2QD9d22S8P3uInHC81JSBcV3bAK

---

## Tech Stack

- **React** + **TypeScript** - Frontend framework
- **Vite** - Build tool
- **Google Gemini 2.5 Flash** - AI image generation
- **ImageTracerJS** - Raster to vector conversion
- **JSZip** - ZIP file creation for batch downloads
- **Tailwind CSS** - Styling

## License

MIT
