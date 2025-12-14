export type IconStyle = 
  // Base
  | 'lucid' 
  // 3D
  | 'photorealistic' | 'photorealistic_angled' | 'clay_3d' | 'low_poly' | 'glossy_3d' | 'isometric_3d' | 'isometric_rounded'
  | 'metallic_3d' | 'glass_3d' | 'voxel_3d' | 'balloon_3d' | 'liquid_3d'
  // Logo & Professional (Renamed from Modern Professional)
  | 'material' | 'fluent' | 'logo_mark' | 'corporate' | 'startup' 
  | 'flat_25d' | 'duotone' | 'badge' | 'mascot' | 'monogram'
  // Technical & Schematic
  | 'blueprint' | 'architectural' | 'circuit' | 'neon'
  // Fun & Comic
  | 'comic' | 'pop_art' | 'kawaii' | 'retro_anime' | 'sticker' 
  | 'classic_animation' | 'rubber_hose' | 'tv_cartoon' | 'superhero' | 'graffiti'
  // Craft & Texture
  | 'paper_cutout' | 'embroidery'
  // Hand-Drawn & Organic
  | 'crayon' | 'ink_sketch' | 'doodle' | 'chalk' | 'marker'
  // Abstract & Artistic
  | 'geometric' | 'fluid' | 'glitch' | 'single_line' | 'splatter' | 'negative_space'
  // Legacy / Specific Art Movements
  | 'bauhaus' | 'swiss' | 'art_deco' | 'brutalist' | 'mid_century' 
  | 'japanese' | 'cyberpunk' | 'sketch' | 'art_nouveau' | 'de_stijl' 
  | 'pixel' | 'tribal' | 'origami' | 'stencil' | 'victorian' 
  | 'steampunk' | 'gothic';

export interface IconRequest {
  name: string;
  description?: string;
}

export interface GeneratedIcon {
  id: string;
  name: string;
  description?: string;
  style?: IconStyle; // Track the style used
  svgContent: string;
  rasterImage?: string; // Base64 PNG of the original generated image
  createdAt: number;
}

export interface GenerationResult {
  svg: string;
  name: string;
  rasterImage?: string;
}

// Simple icons for the UI itself
export interface UiIconProps {
  className?: string;
  size?: number;
}