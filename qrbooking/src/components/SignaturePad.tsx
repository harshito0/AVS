import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Eraser, Type, PenTool } from 'lucide-react';

interface SignaturePadProps {
  value: string;
  onChange: (dataUrl: string, type: 'draw' | 'type') => void;
  hasError?: boolean;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ value, onChange, hasError }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [mode, setMode] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState('');

  // Setup canvas high-DPI
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0F382C'; // Elegant deep forest green ink
    ctx.lineWidth = 2.2;
  }, []);

  useEffect(() => {
    initCanvas();
    const handleResize = () => initCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onChange(dataUrl, 'draw');
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onChange('', mode);
  };

  const handleTypedSignatureChange = (text: string) => {
    setTypedName(text);
    if (!text.trim()) {
      onChange('', 'type');
      return;
    }

    // Render typed cursive signature to an off-screen canvas to get dataUrl
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 600;
    tempCanvas.height = 160;
    const ctx = tempCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0F382C';
      ctx.font = 'italic 42px "Playfair Display", "Brush Script MT", "Great Vibes", cursive, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text.trim(), 300, 80);
      const dataUrl = tempCanvas.toDataURL('image/png');
      onChange(dataUrl, 'type');
    }
  };

  return (
    <div className="space-y-2">
      {/* Mode Switcher & Clear Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-[#F0F5F2] p-1 rounded-lg border border-[#D5E3DB]">
          <button
            type="button"
            onClick={() => {
              setMode('draw');
              if (!hasDrawn && typedName) {
                // switch to draw mode
              }
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'draw'
                ? 'bg-forest-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-3 h-3" />
            <span>Draw Signature</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('type');
              if (typedName) handleTypedSignatureChange(typedName);
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'type'
                ? 'bg-forest-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Type className="w-3 h-3" />
            <span>Type Signature</span>
          </button>
        </div>

        {mode === 'draw' && hasDrawn && (
          <button
            type="button"
            onClick={clearCanvas}
            className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Signature Area */}
      {mode === 'draw' ? (
        <div
          className={`relative w-full h-32 sm:h-36 bg-[#FCFDFC] rounded-xl border-2 border-dashed transition-all touch-none select-none overflow-hidden ${
            hasError
              ? 'border-rose-400 bg-rose-50/20'
              : 'border-[#CBDAD0] hover:border-forest-700 focus-within:border-forest-800'
          }`}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full cursor-crosshair block"
          />

          {!hasDrawn && !value && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-slate-400">
              <PenTool className="w-5 h-5 mb-1 text-slate-300" />
              <span className="text-xs font-medium italic text-slate-400">
                Sign here with finger or mouse
              </span>
            </div>
          )}

          {/* Legal baseline rule */}
          <div className="pointer-events-none absolute bottom-5 left-8 right-8 border-b border-slate-200" />
          <span className="pointer-events-none absolute bottom-1.5 right-8 text-[9px] text-slate-300 font-mono tracking-wider">
            AVS DIGITAL SIGNATURE LINE
          </span>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Type your legal full name to sign..."
            value={typedName}
            onChange={(e) => handleTypedSignatureChange(e.target.value)}
            className={`w-full px-4 py-3 bg-white rounded-xl border text-sm font-medium outline-none transition-all ${
              hasError
                ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                : 'border-[#CBDAD0] focus:border-forest-900 focus:ring-2 focus:ring-forest-900/10'
            }`}
          />
          {typedName && (
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gold-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                Signature Preview:
              </span>
              <p className="font-serif italic text-2xl text-forest-950 font-normal">
                {typedName}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
