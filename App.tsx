import React, { useState, useEffect } from 'react';
import { generateIcon } from './services/geminiService';
import { traceImageToSvg } from './services/vectorizerService';
import { GeneratedIcon } from './types';
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

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Generating...');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedIcon[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('icon-history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
        // If data is corrupt, clear it
        localStorage.removeItem('icon-history');
      }
    }
  }, []);

  useEffect(() => {
    try {
      // CRITICAL FIX: LocalStorage has a size limit (usually 5MB).
      // Storing base64 raster images will crash the app very quickly.
      // We strip 'rasterImage' from the data before saving to persistence.
      // The user keeps rasterImage for the current session in memory, but it's lost on reload.
      // This is a necessary trade-off to allow unlimited SVG history.
      const optimizedHistory = history.map(icon => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { rasterImage, ...rest } = icon;
        return rest;
      });
      
      localStorage.setItem('icon-history', JSON.stringify(optimizedHistory));
    } catch (e) {
      console.error("Failed to save to localStorage (likely quota exceeded):", e);
      // If we still fail (e.g. thousands of SVGs), we try to keep just the last 20
      if (history.length > 20) {
         try {
            const trimmed = history.slice(0, 20).map(icon => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { rasterImage, ...rest } = icon;
                return rest;
            });
            localStorage.setItem('icon-history', JSON.stringify(trimmed));
         } catch (retryError) {
             console.error("Critical storage failure even after trimming", retryError);
         }
      }
    }
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setLoadingText('Initializing...');
    setError(null);

    try {
      // Step 1: Generate the Image via Gemini
      const result = await generateIcon(prompt, description, (status) => {
          setLoadingText(status);
      });

      if (!result.rasterImage) {
        throw new Error("No image generated to trace.");
      }

      // Step 2: Trace the image locally using ImageTracerJS
      setLoadingText('Tracing Vectors...');
      const svgContent = await traceImageToSvg(result.rasterImage);
      
      const newIcon: GeneratedIcon = {
        id: crypto.randomUUID(),
        name: result.name || prompt,
        svgContent: svgContent,
        rasterImage: result.rasterImage, // Kept in memory for this session
        createdAt: Date.now()
      };

      setHistory(prev => [newIcon, ...prev]);
    } catch (err: any) {
      setError("Failed to generate icon. " + (err.message || ''));
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingText('Generating...');
    }
  };

  const clearHistory = () => {
    // Removed window.confirm to ensure it works in all environments
    // and to fix the "button doesn't work" issue.
    setHistory([]);
    localStorage.removeItem('icon-history');
  };

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
          
          {/* Input Form */}
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            <div className="bg-surface p-6 rounded-xl border border-slate-700 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                New Icon
              </h2>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-200 text-sm">
                    {error}
                  </div>
                )}

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
            </div>

            <div className="bg-surface/50 p-6 rounded-xl border border-slate-700/50 text-sm text-slate-400">
               <h3 className="font-semibold text-slate-300 mb-2">Hybrid Workflow:</h3>
               <ol className="list-decimal pl-4 space-y-2">
                 <li><strong>Visual Generation:</strong> Gemini creates a high-contrast black/white silhouette.</li>
                 <li><strong>Vector Tracing:</strong> ImageTracer.js converts the image into editable SVG paths (filled shapes) directly in your browser.</li>
               </ol>
            </div>
          </div>

          {/* Latest Result / Hero */}
          <div className="w-full md:w-2/3">
             {history.length > 0 ? (
                <div className="h-full flex flex-col">
                   <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-white">Latest Result</h2>
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
                     <p className="text-slate-500 mt-2">Enter a name and description. We'll generate an image and trace it to SVG instantly.</p>
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
               <Button variant="ghost" onClick={clearHistory} className="text-xs hover:bg-red-900/20 hover:text-red-300">
                 Clear History
               </Button>
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