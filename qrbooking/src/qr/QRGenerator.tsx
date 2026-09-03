import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Download,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Printer,
  Sparkles,
  QrCode
} from 'lucide-react';

export const QRGenerator: React.FC = () => {
  const targetUrl = 'https://auravitalstar.ca/book';
  const [copied, setCopied] = useState(false);
  const [qrPngUrl, setQrPngUrl] = useState<string>('');
  const [qrSvgString, setQrSvgString] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);
  const printCardRef = useRef<HTMLDivElement>(null);

  // Generate crisp, high-contrast QR codes (PNG 1200px and Vector SVG)
  useEffect(() => {
    const generateCodes = async () => {
      try {
        setIsGenerating(true);

        // 1. High-Resolution PNG (1200x1200px with contrast and quiet zone)
        const pngDataUrl = await QRCode.toDataURL(targetUrl, {
          width: 1200,
          margin: 2,
          color: {
            dark: '#0F5B47', // AVS Deep Forest Green for premium aesthetic & scan contrast
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        });
        setQrPngUrl(pngDataUrl);

        // 2. Pure Vector SVG String
        const svgString = await QRCode.toString(targetUrl, {
          type: 'svg',
          margin: 2,
          color: {
            dark: '#0F5B47',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        });
        setQrSvgString(svgString);
      } catch (err) {
        console.error('Failed to generate QR code:', err);
      } finally {
        setIsGenerating(false);
      }
    };

    generateCodes();
  }, [targetUrl]);

  // Copy URL to clipboard
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = targetUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Download High-Res PNG
  const handleDownloadPng = () => {
    if (!qrPngUrl) return;
    const link = document.createElement('a');
    link.href = qrPngUrl;
    link.download = 'AVS_Booking_QR_HighRes.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Vector SVG
  const handleDownloadSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AVS_Booking_QR_Vector.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download Branded Print Ready Card (Flyer/Standee layout via Canvas)
  const handleDownloadBrandedCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 2200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle border
    ctx.strokeStyle = '#E2ECE6';
    ctx.lineWidth = 16;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Inner gold border accent
    ctx.strokeStyle = '#C9A227';
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

    // 2. Header Text
    ctx.fillStyle = '#0F5B47';
    ctx.font = 'bold 56px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AURA VITAL STAR', canvas.width / 2, 230);

    ctx.fillStyle = '#C9A227';
    ctx.font = '600 32px sans-serif';
    ctx.fillText('REJUVENATION CENTRE', canvas.width / 2, 290);

    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 74px serif';
    ctx.fillText('SCAN TO BOOK', canvas.width / 2, 450);
    ctx.font = 'bold 64px serif';
    ctx.fillText('YOUR APPOINTMENT', canvas.width / 2, 540);

    ctx.fillStyle = '#6B7280';
    ctx.font = '36px sans-serif';
    ctx.fillText('Open camera on your phone to scan code', canvas.width / 2, 630);

    // 3. Draw QR Code
    const qrImg = new Image();
    qrImg.onload = () => {
      const qrSize = 920;
      const qrX = (canvas.width - qrSize) / 2;
      const qrY = 740;

      // QR container box
      ctx.fillStyle = '#F8FAF9';
      ctx.fillRect(qrX - 30, qrY - 30, qrSize + 60, qrSize + 60);
      ctx.strokeStyle = '#D1DCD5';
      ctx.lineWidth = 4;
      ctx.strokeRect(qrX - 30, qrY - 30, qrSize + 60, qrSize + 60);

      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

      // 4. Footer URL
      ctx.fillStyle = '#0F5B47';
      ctx.font = 'bold 48px sans-serif';
      ctx.fillText('auravitalstar.ca/book', canvas.width / 2, 1820);

      ctx.fillStyle = '#9CA3AF';
      ctx.font = '32px sans-serif';
      ctx.fillText('157 Queen St W, Brampton • (647) 987-5451', canvas.width / 2, 1920);

      // Trigger download
      const exportLink = document.createElement('a');
      exportLink.href = canvas.toDataURL('image/png');
      exportLink.download = 'AVS_Standee_Poster_Card.png';
      document.body.appendChild(exportLink);
      exportLink.click();
      document.body.removeChild(exportLink);
    };
    qrImg.src = qrPngUrl;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Utility Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-50 border border-forest-200/80 text-forest-850 text-xs font-bold uppercase tracking-wider">
          <QrCode className="w-3.5 h-3.5 text-gold-500" />
          AVS Marketing Utility
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif mt-2">
          Appointment Booking QR Generator
        </h1>
        <p className="text-sm text-slate-500 mt-1.5 max-w-lg mx-auto leading-relaxed">
          High-resolution scannable QR code linking directly to the mobile booking portal for flyers, standees, business cards, and reception desks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Branded QR Card Preview */}
        <div className="lg:col-span-7 flex justify-center">
          <div
            ref={printCardRef}
            className="w-full max-w-sm bg-white rounded-3xl border-2 border-[#E2ECE6] shadow-[0_16px_45px_-12px_rgba(15,91,71,0.15)] p-6 sm:p-8 text-center relative overflow-hidden"
          >
            {/* Corner Gold Accents */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-gold-500 rounded-tl-sm" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-gold-500 rounded-tr-sm" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-gold-500 rounded-bl-sm" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-gold-500 rounded-br-sm" />

            {/* Header Brand */}
            <div className="mb-4">
              <div className="w-14 h-14 rounded-xl bg-forest-50 border border-forest-100 p-1.5 mx-auto mb-2 flex items-center justify-center">
                <img
                  src="/avs_logo.png"
                  alt="AVS Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-xs font-bold tracking-[0.2em] text-forest-950 uppercase">
                Aura Vital Star
              </h2>
              <p className="text-[9px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
                Rejuvenation Centre
              </p>
            </div>

            {/* Title */}
            <div className="mb-4">
              <h3 className="text-lg font-black text-slate-900 tracking-tight font-serif uppercase">
                SCAN TO BOOK
              </h3>
              <p className="text-sm font-black text-forest-900 tracking-tight font-serif uppercase">
                YOUR APPOINTMENT
              </p>
            </div>

            {/* QR Code Container */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E9E2D5] shadow-inner inline-block my-1">
              {isGenerating ? (
                <div className="w-52 h-52 flex items-center justify-center bg-white rounded-xl">
                  <div className="w-8 h-8 rounded-full border-2 border-forest-900 border-t-transparent animate-spin" />
                </div>
              ) : (
                <img
                  src={qrPngUrl}
                  alt="Aura Vital Star Booking QR Code"
                  className="w-52 h-52 sm:w-56 sm:h-56 rounded-xl bg-white shadow-sm object-contain"
                />
              )}
            </div>

            {/* Bottom URL */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-forest-900 tracking-wide block">
                auravitalstar.ca/book
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Point your phone camera to open booking form
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Production Formats */}
        <div className="lg:col-span-5 space-y-5">
          {/* Target URL Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#E3EAE5] shadow-sm space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Direct Booking Destination URL
            </span>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-semibold text-slate-800 truncate">
                {targetUrl}
              </span>
              <a
                href={targetUrl}
                target="_blank"
                rel="noreferrer"
                className="text-forest-800 hover:text-forest-950 shrink-0 p-1"
                title="Preview URL"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <button
              type="button"
              onClick={handleCopyUrl}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-800'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Booking Link</span>
                </>
              )}
            </button>
          </div>

          {/* Download Options Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#E3EAE5] shadow-sm space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Export Production Files
            </span>

            <div className="space-y-2.5">
              {/* Download High-Res PNG */}
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={isGenerating}
                className="w-full py-3.5 px-4 rounded-xl bg-forest-900 hover:bg-forest-850 text-white text-xs font-bold flex items-center justify-between shadow-sm transition-all active:scale-[0.99] cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-gold-400" />
                  Download High-Res PNG (1200px)
                </span>
                <span className="text-[10px] bg-forest-950/80 px-2 py-0.5 rounded text-emerald-300 font-mono">
                  PNG
                </span>
              </button>

              {/* Download Vector SVG */}
              <button
                type="button"
                onClick={handleDownloadSvg}
                disabled={isGenerating}
                className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-forest-800" />
                  Download Infinite Vector SVG
                </span>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">
                  SVG
                </span>
              </button>

              {/* Download Branded Standee / Poster Card */}
              <button
                type="button"
                onClick={handleDownloadBrandedCard}
                disabled={isGenerating}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-forest-950 text-xs font-bold flex items-center justify-between shadow-sm transition-all active:scale-[0.99] cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  Download Printable Standee Card (300 DPI)
                </span>
                <span className="text-[10px] bg-forest-950/15 px-2 py-0.5 rounded font-mono">
                  Print
                </span>
              </button>
            </div>
          </div>

          {/* Quick Guidance Box */}
          <div className="p-4 rounded-xl bg-forest-50/70 border border-forest-100 text-xs text-forest-900 space-y-1.5">
            <p className="font-bold flex items-center gap-1.5 text-forest-950">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              Optimal Print Specifications
            </p>
            <p className="text-[11px] leading-relaxed text-slate-600">
              Tested for high contrast readability. Suitable for counter acrylic stands, table tents, service menus, window stickers, and direct mail flyers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};