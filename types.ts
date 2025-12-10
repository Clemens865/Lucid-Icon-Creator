export interface IconRequest {
  name: string;
  description?: string;
}

export interface GeneratedIcon {
  id: string;
  name: string;
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