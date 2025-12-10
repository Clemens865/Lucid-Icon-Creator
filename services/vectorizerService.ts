// Declare the global ImageTracer object added via CDN
declare global {
  interface Window {
    ImageTracer: any;
  }
}

export const traceImageToSvg = (base64Image: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.ImageTracer) {
      reject(new Error("ImageTracer library not loaded."));
      return;
    }

    // Configuration optimized for clean, single-color icon tracing
    const options = {
      // Tracing
      // ltres/qtres: Higher values (e.g. 1.0) smooth out the curves, ignoring small pixel irregularities.
      ltres: 1.0, 
      qtres: 1.0, 
      pathomit: 10, // Ignore speckles smaller than 10 pixels
      
      // Color
      colorsampling: 0, // Disable sampling, use palette
      numberofcolors: 2, // Force black and white
      mincolorratio: 0,
      colorquantcycles: 1,
      
      // Output
      scale: 1,
      simplifytolerance: 0,
      roundcoords: 1, // Round coordinates to 1 decimal place
      lcpr: 0,
      qcpr: 0,
      desc: false, // No description
      viewbox: true, // Use viewBox instead of width/height
      
      // Blur helps denoise the AI image before tracing, resulting in cleaner lines
      // Note: If blurradius is too high it might cause issues on some browsers, keeping it low (2).
      blurradius: 2,
      blurdelta: 20 
    };

    try {
      window.ImageTracer.imageToSVG(
        base64Image,
        (svgString: string) => {
          if (!svgString) {
            console.warn("ImageTracer returned empty string");
            reject(new Error("Tracing returned empty SVG"));
            return;
          }
          
          try {
            // Post-processing to clean up the SVG string
            const parser = new DOMParser();
            const doc = parser.parseFromString(svgString, "image/svg+xml");
            
            // Check for parsing errors
            if (doc.querySelector('parsererror')) {
                console.warn("DOMParser failed to parse SVG");
                // Fallback to returning raw string if we can't parse it
                resolve(svgString);
                return;
            }

            const svg = doc.querySelector('svg');
            
            if (svg) {
              // Enforce standard icon size
              svg.setAttribute('width', '24');
              svg.setAttribute('height', '24');
              
              // Set fill to currentColor for better CSS integration
              const paths = svg.querySelectorAll('path');
              paths.forEach(path => {
                const fill = path.getAttribute('fill');
                // Remove white backgrounds (approximate white values)
                if (fill && (fill === 'rgb(255,255,255)' || fill.toLowerCase() === '#ffffff' || fill.toLowerCase() === '#fff')) {
                  path.remove();
                } else {
                  path.setAttribute('fill', 'currentColor');
                  path.removeAttribute('stroke-width'); // Traced shapes are fills, not strokes
                }
              });
              
              resolve(svg.outerHTML);
            } else {
              resolve(svgString);
            }
          } catch (processError) {
             console.error("Error processing SVG", processError);
             // If processing fails, resolve with original string rather than crashing
             resolve(svgString);
          }
        },
        options
      );
    } catch (e) {
      console.error("ImageTracer.imageToSVG threw exception", e);
      reject(e);
    }
  });
};
