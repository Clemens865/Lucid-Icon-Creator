import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import { generateIcon, generateIconFromReference } from './services/geminiService';
import { traceImageToSvg } from './services/vectorizerService';
import { GeneratedIcon, IconStyle } from './types';
import { Button } from './components/Button';
import { GeneratedIconCard } from './components/GeneratedIconCard';

// Main App Icon
const AppLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
    <path d="M2 2l7.586 7.586"></path>
    <circle cx="11" cy="11" r="2"></circle>
  </svg>
);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Style Options Definition
const STYLES: { value: IconStyle; label: string; group: string }[] = [
  // Default
  { value: 'lucid', label: 'Lucid (Default)', group: 'Essentials' },

  // Technical & Schematic (New)
  { value: 'blueprint', label: 'Blueprint / Schematic', group: 'Technical & Schematic' },
  { value: 'architectural', label: 'Architectural Sketch', group: 'Technical & Schematic' },
  { value: 'circuit', label: 'Circuit Board (PCB)', group: 'Technical & Schematic' },
  { value: 'neon', label: 'Neon Sign', group: 'Technical & Schematic' },

  // Logo & Professional (Updated)
  { value: 'logo_mark', label: 'Logo Mark', group: 'Logo & Professional' },
  { value: 'mascot', label: 'Esports Mascot', group: 'Logo & Professional' },
  { value: 'monogram', label: 'Luxury Monogram', group: 'Logo & Professional' },
  { value: 'material', label: 'Material Design', group: 'Logo & Professional' },
  { value: 'fluent', label: 'Fluent Design', group: 'Logo & Professional' },
  { value: 'corporate', label: 'Corporate Minimal', group: 'Logo & Professional' },
  { value: 'startup', label: 'Tech Startup', group: 'Logo & Professional' },
  { value: 'flat_25d', label: 'Flat 2.5D', group: 'Logo & Professional' },
  { value: 'duotone', label: 'Duotone Split', group: 'Logo & Professional' },
  { value: 'badge', label: 'Outlined Badge', group: 'Logo & Professional' },

  // Fun & Comic
  { value: 'kawaii', label: 'Kawaii (Cute)', group: 'Fun & Comic' },
  { value: 'classic_animation', label: 'Classic Animation (Disney)', group: 'Fun & Comic' },
  { value: 'rubber_hose', label: 'Vintage 1930s (Rubber Hose)', group: 'Fun & Comic' },
  { value: 'tv_cartoon', label: 'TV Cartoon (Simpsons Style)', group: 'Fun & Comic' },
  { value: 'superhero', label: 'Superhero Comic', group: 'Fun & Comic' },
  { value: 'graffiti', label: 'Graffiti / Street Art', group: 'Fun & Comic' },
  { value: 'sticker', label: 'Sticker Art', group: 'Fun & Comic' },
  { value: 'retro_anime', label: 'Retro Anime (90s)', group: 'Fun & Comic' },
  { value: 'comic', label: 'Comic Book', group: 'Fun & Comic' },
  { value: 'pop_art', label: 'Pop Art', group: 'Fun & Comic' },

  // Craft & Texture (New)
  { value: 'paper_cutout', label: 'Paper Cutout Art', group: 'Craft & Texture' },
  { value: 'embroidery', label: 'Embroidery / Stitch', group: 'Craft & Texture' },

  // 3D Styles
  { value: 'photorealistic', label: 'Photorealistic 3D', group: '3D Styles' },
  { value: 'photorealistic_angled', label: 'Photorealistic 3D (Angled)', group: '3D Styles' },
  { value: 'isometric_3d', label: 'Isometric 3D', group: '3D Styles' },
  { value: 'isometric_rounded', label: 'Rounded Isometric (45°)', group: '3D Styles' },
  { value: 'clay_3d', label: 'Smooth Clay 3D', group: '3D Styles' },
  { value: 'low_poly', label: 'Low Poly 3D', group: '3D Styles' },
  { value: 'glossy_3d', label: 'Glossy Plastic 3D', group: '3D Styles' },
  { value: 'metallic_3d', label: 'Metallic 3D', group: '3D Styles' },
  { value: 'glass_3d', label: 'Glass Transparent 3D', group: '3D Styles' },
  { value: 'voxel_3d', label: 'Voxel Cubic 3D', group: '3D Styles' },
  { value: 'balloon_3d', label: 'Inflated Balloon 3D', group: '3D Styles' },
  { value: 'liquid_3d', label: 'Melting Liquid 3D', group: '3D Styles' },

  // Hand-drawn & Organic
  { value: 'sketch', label: 'Sketch (Hand-Drawn)', group: 'Hand-drawn & Organic' },
  { value: 'crayon', label: 'Kids Crayon Drawing', group: 'Hand-drawn & Organic' },
  { value: 'doodle', label: 'Doodle Style', group: 'Hand-drawn & Organic' },
  { value: 'chalk', label: 'Chalk Texture', group: 'Hand-drawn & Organic' },
  { value: 'marker', label: 'Marker Drawing', group: 'Hand-drawn & Organic' },

  // Abstract & Artistic
  { value: 'geometric', label: 'Geometric Abstract', group: 'Abstract & Artistic' },
  { value: 'fluid', label: 'Fluid Organic', group: 'Abstract & Artistic' },
  { value: 'glitch', label: 'Glitch Art', group: 'Abstract & Artistic' },
  { value: 'single_line', label: 'Minimalist Single Line', group: 'Abstract & Artistic' },
  { value: 'splatter', label: 'Splatter Paint', group: 'Abstract & Artistic' },
  { value: 'negative_space', label: 'Negative Space', group: 'Abstract & Artistic' },

  // Art Movements (User Requested List)
  { value: 'bauhaus', label: 'Bauhaus', group: 'Art Movements' },
  { value: 'swiss', label: 'Swiss International', group: 'Art Movements' },
  { value: 'art_deco', label: 'Art Deco', group: 'Art Movements' },
  { value: 'brutalist', label: 'Brutalist', group: 'Art Movements' },
  { value: 'mid_century', label: 'Mid-Century Modern', group: 'Art Movements' },
  { value: 'japanese', label: 'Japanese Minimalist', group: 'Art Movements' },
  { value: 'art_nouveau', label: 'Art Nouveau', group: 'Art Movements' },
  { value: 'de_stijl', label: 'De Stijl', group: 'Art Movements' },
  { value: 'tribal', label: 'Tribal / Aztec', group: 'Art Movements' },
  { value: 'origami', label: 'Origami / Folded', group: 'Art Movements' },
  { value: 'stencil', label: 'Industrial Stencil', group: 'Art Movements' },
  { value: 'victorian', label: 'Victorian / Woodcut', group: 'Art Movements' },
  
  // Thematic
  { value: 'cyberpunk', label: 'Cyberpunk', group: 'Thematic' },
  { value: 'pixel', label: 'Pixel Art (8-Bit)', group: 'Thematic' },
  { value: 'steampunk', label: 'Steampunk', group: 'Thematic' },
  { value: 'gothic', label: 'Gothic', group: 'Thematic' },
];

const App: React.FC = () => {
  // Single Mode State
  const [prompt, setPrompt] = useState('');
  const [description, setDescription] = useState('');
  
  // UI State
  const [mode, setMode] = useState<'single' | 'batch' | 'photo'>('single');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Generating...');
  const [zipping, setZipping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedIcon[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<IconStyle>('lucid');

  // Batch Mode State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [batchFile, setBatchFile] = useState<File | null>(null);
  const [batchProgress, setBatchProgress] = useState<{current: number, total: number} | null>(null);
  const [batchLogs, setBatchLogs] = useState<string[]>([]);

  // Photo Mode State
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('icon-history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
        localStorage.removeItem('icon-history');
      }
    }
  }, []);

  useEffect(() => {
    try {
      const optimizedHistory = history.map(icon => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { rasterImage, ...rest } = icon;
        return rest;
      });
      
      localStorage.setItem('icon-history', JSON.stringify(optimizedHistory));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
      if (history.length > 20) {
         try {
            const trimmed = history.slice(0, 20).map(icon => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { rasterImage, ...rest } = icon;
                return rest;
            });
            localStorage.setItem('icon-history', JSON.stringify(trimmed));
         } catch (retryError) {
             console.error("Critical storage failure", retryError);
         }
      }
    }
  }, [history]);

  // Helper to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
          if (typeof reader.result === 'string') {
               // Remove data header for API
               const result = reader.result as string;
               const base64 = result.split(',')[1]; 
               resolve(base64);
          } else {
              reject(new Error("Failed to read file"));
          }
      };
      reader.onerror = error => reject(error);
    });
  };

  // Core generation logic reused by both modes
  const processGeneration = async (name: string, desc: string): Promise<GeneratedIcon> => {
    // Step 1: Generate Image
    const result = await generateIcon(name, desc, (status) => {
      // Only update global loading text if in single mode
      if (mode === 'single') setLoadingText(status);
    }, selectedStyle);

    if (!result.rasterImage) {
      throw new Error("No image generated.");
    }

    // Step 2: Trace
    if (mode === 'single') setLoadingText('Tracing Vectors...');
    const svgContent = await traceImageToSvg(result.rasterImage);
    
    return {
      id: crypto.randomUUID(),
      name: result.name || name,
      description: desc,
      style: selectedStyle, // Save the style used
      svgContent: svgContent,
      rasterImage: result.rasterImage,
      createdAt: Date.now()
    };
  };

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setLoadingText('Initializing...');
    setError(null);

    try {
      const newIcon = await processGeneration(prompt, description);
      setHistory(prev => [newIcon, ...prev]);
      setPrompt(''); // Clear input on success
      setDescription('');
    } catch (err: any) {
      setError("Failed to generate icon. " + (err.message || ''));
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingText('Generating...');
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
      setError(null);
    }
  };

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile || !prompt.trim()) return;

    setLoading(true);
    setLoadingText('Uploading...');
    setError(null);

    try {
        const base64 = await fileToBase64(photoFile);
        
        // Step 1: Generate Transform
        const result = await generateIconFromReference(
            prompt, 
            description, 
            base64, 
            photoFile.type,
            (status) => setLoadingText(status),
            selectedStyle
        );

        if (!result.rasterImage) {
            throw new Error("No image generated.");
        }

        // Step 2: Trace
        setLoadingText('Tracing Vectors...');
        const svgContent = await traceImageToSvg(result.rasterImage);

        const newIcon: GeneratedIcon = {
            id: crypto.randomUUID(),
            name: result.name || prompt,
            description: description,
            style: selectedStyle,
            svgContent: svgContent,
            rasterImage: result.rasterImage,
            createdAt: Date.now()
        };

        setHistory(prev => [newIcon, ...prev]);
        // Reset Inputs
        setPrompt('');
        setDescription('');
        setPhotoFile(null);
        if (photoInputRef.current) photoInputRef.current.value = '';

    } catch (err: any) {
        setError("Failed to transform photo. " + (err.message || ''));
        console.error(err);
    } finally {
        setLoading(false);
        setLoadingText('Generating...');
    }
  };

  // --- Batch Logic ---

  const downloadTemplate = () => {
    const headers = "Icon Name,Details (Optional)\n";
    const rows = "Rocket,A simple rocket ship taking off\nLeaf,A minimal oak leaf\nSettings,A gear icon";
    const content = headers + rows;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "icon_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBatchFile(e.target.files[0]);
      setError(null);
    }
  };

  const parseCSV = async (file: File): Promise<{name: string, desc: string}[]> => {
    const text = await file.text();
    const lines = text.split(/\r\n|\n/);
    const items: {name: string, desc: string}[] = [];

    // Simple parser: assumes header is row 0
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const parts = line.split(',');
      const name = parts[0]?.trim();
      const desc = parts.slice(1).join(',')?.trim() || "";

      if (name) {
        items.push({ name, desc });
      }
    }
    return items;
  };

  const handleBatchSubmit = async () => {
    if (!batchFile) {
      setError("Please upload a CSV file first.");
      return;
    }

    setLoading(true);
    setBatchLogs([]);
    setError(null);

    try {
      const items = await parseCSV(batchFile);
      if (items.length === 0) {
        throw new Error("No valid rows found in CSV.");
      }
      
      setBatchProgress({ current: 0, total: items.length });
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        setBatchProgress({ current: i + 1, total: items.length });
        setBatchLogs(prev => [`Generating "${item.name}" (${selectedStyle})...`, ...prev]);

        try {
          const newIcon = await processGeneration(item.name, item.desc);
          setHistory(prev => [newIcon, ...prev]);
          setBatchLogs(prev => [`✓ Success: "${item.name}"`, ...prev]);
        } catch (err) {
          console.error(err);
          setBatchLogs(prev => [`✕ Failed: "${item.name}"`, ...prev]);
        }

        if (i < items.length - 1) {
          setBatchLogs(prev => [`⏳ Cooling down (5s) for API limits...`, ...prev]);
          await delay(5000); 
        }
      }

      setBatchLogs(prev => [`🎉 Batch Complete!`, ...prev]);

    } catch (err: any) {
      setError("Batch failed: " + err.message);
    } finally {
      setLoading(false);
      setBatchProgress(null);
    }
  };

  const handleDownloadZip = async () => {
    if (history.length === 0) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      const rootFolder = zip.folder("lucidgen-icons");
      
      // Track file names to avoid collisions within folders
      const usedPaths: Record<string, number> = {};

      history.forEach((icon) => {
         if (icon.svgContent) {
           // Structure: /lucidgen-icons/[StyleName]/[IconName]_[Date].svg
           const styleFolder = icon.style ? icon.style : 'misc';
           const cleanName = icon.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'icon';
           
           // Use YYYY-MM-DD for sorting
           const date = new Date(icon.createdAt).toISOString().split('T')[0];
           
           const baseName = `${cleanName}_${date}`;
           let filePath = `${styleFolder}/${baseName}.svg`;

           // Handle duplicates
           if (usedPaths[filePath]) {
              usedPaths[filePath]++;
              filePath = `${styleFolder}/${baseName}-${usedPaths[filePath]}.svg`;
           } else {
              usedPaths[filePath] = 1;
           }
           
           rootFolder?.file(filePath, icon.svgContent);
         }
      });

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = "lucidgen-icons.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Zip failed", e);
      setError("Failed to create zip file.");
    } finally {
      setZipping(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('icon-history');
  };

  const StyleSelector = () => (
    <div>
      <label htmlFor="styleSelect" className="block text-sm font-medium text-slate-400 mb-1">
        Icon Style
      </label>
      <div className="relative">
        <select
          id="styleSelect"
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value as IconStyle)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-3 pr-10 py-2 text-white appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all cursor-pointer"
          disabled={loading}
        >
          {STYLES.map((style, index) => {
             // Basic grouping logic by rendering a disabled option as a header if the group changes
             const prevGroup = index > 0 ? STYLES[index - 1].group : null;
             const isNewGroup = prevGroup !== style.group;
             
             // Since standard <select> groups are <optgroup>, let's just do that proper way
             return null;
          })}
          
          {/* Grouping Implementation */}
          {[...new Set(STYLES.map(s => s.group))].map(group => (
            <optgroup key={group} label={group} className="bg-slate-900 text-slate-400 font-semibold">
              {STYLES.filter(s => s.group === group).map(style => (
                 <option key={style.value} value={style.value} className="text-white">
                    {style.label}
                 </option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-slate-200 selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AppLogo />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              LucidGen
            </h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Powered by Gemini 2.5 Flash + ImageTracer
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Generator Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          
          {/* Input Panel */}
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            <div className="bg-surface rounded-xl border border-slate-700 shadow-xl overflow-hidden">
              
              {/* Tabs */}
              <div className="flex border-b border-slate-700">
                <button 
                  onClick={() => { setMode('single'); setError(null); }}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'single' ? 'bg-slate-800 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
                >
                  Single
                </button>
                <button 
                  onClick={() => { setMode('batch'); setError(null); }}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'batch' ? 'bg-slate-800 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
                >
                  Batch
                </button>
                <button 
                  onClick={() => { setMode('photo'); setError(null); }}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'photo' ? 'bg-slate-800 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
                >
                  Photo Transform
                </button>
              </div>

              <div className="p-6">
                {mode === 'single' ? (
                  <form onSubmit={handleSingleSubmit} className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                      New Icon
                    </h2>
                    
                    <StyleSelector />

                    <div>
                      <label htmlFor="iconName" className="block text-sm font-medium text-slate-400 mb-1">
                        Icon Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="iconName"
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., Coffee Cup"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label htmlFor="iconDesc" className="block text-sm font-medium text-slate-400 mb-1">
                        Details (Optional)
                      </label>
                      <textarea
                        id="iconDesc"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g., Simple silhouette of a cup with steam"
                        rows={3}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                        disabled={loading}
                      />
                    </div>

                    <Button type="submit" isLoading={loading} className="w-full mt-2 shadow-lg shadow-indigo-500/20">
                        {loading ? (
                            <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {loadingText}
                            </span>
                        ) : "Generate & Trace"}
                    </Button>
                  </form>
                ) : mode === 'batch' ? (
                  <div className="flex flex-col gap-4">
                     <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
                      Batch Generator
                    </h2>

                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3 text-xs text-indigo-200">
                      Upload a CSV file to generate multiple icons automatically.
                    </div>

                    <StyleSelector />

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-400">Step 1: Get Template</label>
                      <Button variant="secondary" onClick={downloadTemplate} className="w-full text-xs h-9">
                         Download CSV Template
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-400">Step 2: Upload CSV</label>
                      <input 
                        type="file" 
                        accept=".csv"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600 cursor-pointer"
                        disabled={loading}
                      />
                    </div>

                    {batchFile && (
                       <div className="text-xs text-green-400 font-mono flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          {batchFile.name} ready
                       </div>
                    )}

                    <Button 
                      onClick={handleBatchSubmit} 
                      disabled={!batchFile || loading}
                      isLoading={loading} 
                      className="w-full mt-2 shadow-lg shadow-indigo-500/20"
                    >
                        {loading ? (
                          <span className="flex items-center gap-2">
                             Processing... {batchProgress ? `(${batchProgress.current}/${batchProgress.total})` : ''}
                          </span>
                        ) : "Start Batch Process"}
                    </Button>
                  </div>
                ) : (
                    // Photo Transform Mode
                    <form onSubmit={handlePhotoSubmit} className="flex flex-col gap-4">
                        <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        Photo Transform
                        </h2>

                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3 text-xs text-indigo-200">
                            Upload a photo to restyle it into an icon or illustration.
                        </div>
                        
                        <StyleSelector />

                        <div>
                        <label htmlFor="photoName" className="block text-sm font-medium text-slate-400 mb-1">
                            Scene Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="photoName"
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., Two People"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            required
                            disabled={loading}
                        />
                        </div>

                        <div>
                        <label htmlFor="photoDesc" className="block text-sm font-medium text-slate-400 mb-1">
                            Transformation Instructions <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            id="photoDesc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g., Make them Christmas themed in Simpsons style"
                            rows={3}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                            required
                            disabled={loading}
                        />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-400">Reference Image</label>
                            <div className="relative border-2 border-dashed border-slate-700 rounded-lg hover:border-indigo-500/50 transition-colors bg-slate-900/50">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    ref={photoInputRef}
                                    onChange={handlePhotoChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    disabled={loading}
                                />
                                <div className="p-6 flex flex-col items-center justify-center text-slate-500">
                                    {photoFile ? (
                                        <>
                                            <div className="text-indigo-400 mb-1 flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                Selected:
                                            </div>
                                            <span className="text-sm font-mono truncate max-w-[200px]">{photoFile.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-8 h-8 mb-2 opacity-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm">Click to upload photo</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Button type="submit" isLoading={loading} className="w-full mt-2 shadow-lg shadow-indigo-500/20">
                            {loading ? (
                                <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {loadingText}
                                </span>
                            ) : "Transform & Trace"}
                        </Button>
                    </form>
                )}

                {/* Error Display */}
                {error && (
                  <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-200 text-sm">
                    {error}
                  </div>
                )}
                
                {/* Batch Logs */}
                {mode === 'batch' && batchLogs.length > 0 && (
                   <div className="mt-4 bg-slate-950 rounded-lg border border-slate-800 p-3 h-32 overflow-y-auto text-xs font-mono text-slate-400">
                      {batchLogs.map((log, i) => (
                        <div key={i} className="mb-1 border-b border-slate-800/50 pb-1 last:border-0">{log}</div>
                      ))}
                   </div>
                )}
              </div>
            </div>

            <div className="bg-surface/50 p-6 rounded-xl border border-slate-700/50 text-sm text-slate-400">
               <h3 className="font-semibold text-slate-300 mb-2">Workflow Info:</h3>
               <ul className="list-disc pl-4 space-y-2">
                 <li><strong>Standard:</strong> Instant generation & tracing.</li>
                 <li><strong>Batch:</strong> Processes one by one with a 5s delay between items to respect API limits.</li>
                 <li><strong>Photo Transform:</strong> Uploads a reference image and restyles it based on your description and selected style.</li>
                 <li><strong>Styles:</strong> Apply to all batch items.</li>
                 <li><strong>Privacy:</strong> Files are processed locally in your browser.</li>
               </ul>
            </div>
          </div>

          {/* Latest Result / Hero */}
          <div className="w-full md:w-2/3">
             {history.length > 0 ? (
                <div className="h-full flex flex-col">
                   <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-white">
                        {loading && mode === 'batch' ? 'Processing Batch...' : 'Latest Result'}
                      </h2>
                   </div>
                   <div className="flex-1">
                      <GeneratedIconCard icon={history[0]} />
                   </div>
                </div>
             ) : (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/20 p-12 text-center">
                   <div className="max-w-xs">
                     <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                     </div>
                     <h3 className="text-lg font-medium text-slate-300">No icons yet</h3>
                     <p className="text-slate-500 mt-2">Enter a name, upload a CSV, or transform a photo. We'll generate images and trace them to SVG.</p>
                   </div>
                </div>
             )}
          </div>
        </div>

        {/* History Grid */}
        {history.length > 1 && (
          <div className="mt-16 border-t border-slate-800 pt-8">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold text-white">Previous Generations</h2>
               <div className="flex gap-2">
                  <Button variant="secondary" onClick={handleDownloadZip} disabled={zipping} className="text-xs h-8">
                    {zipping ? (
                        <span className="flex items-center gap-1">
                            <svg className="animate-spin h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Zipping...
                        </span>
                    ) : (
                        <span className="flex items-center gap-1">
                             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                             Download All (ZIP)
                        </span>
                    )}
                  </Button>
                  <Button variant="ghost" onClick={clearHistory} className="text-xs h-8 hover:bg-red-900/20 hover:text-red-300">
                    Clear History
                  </Button>
               </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.slice(1).map((icon) => (
                <GeneratedIconCard key={icon.id} icon={icon} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;