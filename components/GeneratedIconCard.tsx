import React, { useState } from 'react';
import { GeneratedIcon } from '../types';
import { Button } from './Button';

interface GeneratedIconCardProps {
  icon: GeneratedIcon;
  onDelete?: (id: string) => void;
  className?: string;
}

// UI Icons helper
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
);

export const GeneratedIconCard: React.FC<GeneratedIconCardProps> = ({ icon, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'vector' | 'raster'>('vector');

  if (!icon) return null;

  const handleCopy = async () => {
    try {
      if (icon.svgContent) {
        await navigator.clipboard.writeText(icon.svgContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = () => {
    if (!icon.svgContent) return;
    const blob = new Blob([icon.svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Naming Convention: [Style]_[IconName]_[YYYY-MM-DD].svg
    const stylePrefix = icon.style ? `${icon.style}_` : '';
    const dateSuffix = new Date(icon.createdAt).toISOString().split('T')[0];
    const cleanName = icon.name.toLowerCase().replace(/\s+/g, '-');
    
    a.download = `${stylePrefix}${cleanName}_${dateSuffix}.svg`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Safe access to SVG content
  const svgContentSafe = icon.svgContent || '<svg></svg>';
  const displaySvg = svgContentSafe.replace(/>\s+</g, '><').trim();

  // Inject responsive attributes safely
  const injectedSvg = svgContentSafe
    .replace(/width=".*?"/, 'width="100%"')
    .replace(/height=".*?"/, 'height="100%"');

  return (
    <div className={`bg-surface rounded-xl border border-slate-700 overflow-hidden flex flex-col hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 ${className}`}>
      
      {/* Canvas Area */}
      <div className="aspect-square flex items-center justify-center bg-slate-900 border-b border-slate-700 relative group p-8">
         {/* Toggle View Button */}
         {icon.rasterImage && (
             <button 
                onClick={() => setViewMode(viewMode === 'vector' ? 'raster' : 'vector')}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-10"
                title={viewMode === 'vector' ? "Show Original Image" : "Show Vector SVG"}
             >
                {viewMode === 'vector' ? <EyeIcon /> : <CodeIcon />}
             </button>
         )}

         {/* Grid Pattern */}
         <div className="absolute inset-0 opacity-[0.07] pointer-events-none" 
              style={{ 
                  backgroundImage: `
                      linear-gradient(to right, #ffffff 1px, transparent 1px),
                      linear-gradient(to bottom, #ffffff 1px, transparent 1px)
                  `, 
                  backgroundSize: '24px 24px',
                  maskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)'
              }}>
         </div>
         
         {/* The Content - Responsive Size now (50% of container) instead of fixed w-16 */}
         <div className="relative w-1/2 h-1/2 flex items-center justify-center transition-all duration-500">
            {viewMode === 'vector' ? (
                <div 
                className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] w-full h-full transform transition-all duration-300"
                dangerouslySetInnerHTML={{ __html: injectedSvg }} 
                />
            ) : (
                <img 
                    src={icon.rasterImage} 
                    alt="Original AI Generation" 
                    className="w-full h-full object-contain opacity-90 grayscale contrast-125"
                />
            )}
         </div>
         
         {viewMode === 'raster' && (
             <div className="absolute bottom-3 left-0 right-0 text-center">
                 <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full border border-indigo-500/30">
                     Original AI Reference
                 </span>
             </div>
         )}
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1 bg-surface">
        <div className="flex items-start justify-between">
            <div className="overflow-hidden">
              <h3 className="font-semibold text-slate-100 truncate" title={icon.name}>{icon.name}</h3>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1 font-bold">
                 {viewMode === 'vector' ? 'Vector • 24px' : 'Raster • Source'}
              </p>
            </div>
        </div>

        <div className="bg-slate-950 rounded p-2 border border-slate-800 relative group/code">
            <code className="text-[10px] text-slate-400 font-mono block h-8 overflow-hidden whitespace-nowrap mask-linear-fade">
                {displaySvg}
            </code>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-950 pointer-events-none" />
        </div>
        
        <div className="flex gap-2 mt-auto pt-2">
            <Button 
                variant="secondary" 
                className="flex-1 gap-1.5 text-xs py-1.5 h-8 px-2"
                onClick={handleCopy}
            >
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button 
                variant="secondary"
                className="flex-1 gap-1.5 text-xs py-1.5 h-8 px-2"
                onClick={handleDownload}
            >
                <DownloadIcon />
                SVG
            </Button>
        </div>
      </div>
    </div>
  );
};