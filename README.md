<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>
 # Lucid Icon Creator

  A web application that generates custom icons using AI and converts them to scalable vector graphics (SVG).

  ## What it does

  Lucid Icon Creator lets you describe an icon in plain text, and it will:

  1. **Generate an image** using Gemini Nano based on your description
  2. **Convert it to SVG** using imagetracerjs for clean, scalable vector output

  This gives you resolution-independent icons that can be used at any size without losing quality.

  ## Tech Stack

  - **Vite + React** with TypeScript
  - **Gemini Nano** for AI image generation
  - **imagetracerjs** for bitmap-to-vector conversion

  - 
# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1DW5We2QD9d22S8P3uInHC81JSBcV3bAK

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
