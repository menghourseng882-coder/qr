/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Link as LinkIcon, 
  Settings, 
  RotateCcw, 
  Check, 
  Copy, 
  QrCode,
  ExternalLink,
  ChevronRight,
  Palette,
  Maximize
} from 'lucide-react';
import confetti from 'canvas-confetti';

type ECLevel = 'L' | 'M' | 'Q' | 'H';

interface QRConfig {
  value: string;
  size: number;
  fgColor: string;
  bgColor: string;
  level: ECLevel;
  includeMargin: boolean;
}

export default function App() {
  const [config, setConfig] = useState<QRConfig>({
    value: '',
    size: 512,
    fgColor: '#000000',
    bgColor: '#ffffff',
    level: 'M',
    includeMargin: true,
  });

  const [isCopied, setIsCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleDownload = () => {
    if (!config.value) return;
    
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [config.fgColor, '#3b82f6', '#10b981']
    });
  };

  const handleCopy = async () => {
    if (!config.value) return;
    await navigator.clipboard.writeText(config.value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const resetConfig = () => {
    setConfig({
      value: '',
      size: 512,
      fgColor: '#000000',
      bgColor: '#ffffff',
      level: 'M',
      includeMargin: true,
    });
  };

  if (!isReady) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center p-4 md:p-8">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 font-mono text-sm tracking-widest uppercase">
            <QrCode size={16} />
            <span>Open Source Utility</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900">
            Quick<span className="text-blue-600">QR</span>
          </h1>
          <p className="text-neutral-500 max-w-md text-lg">
            Professional-grade QR code generation. Precise, customizable, and instantly ready.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            id="reset-button"
            onClick={resetConfig}
            className="flex items-center gap-2 px-4 py-2 text-neutral-500 hover:text-neutral-900 transition-colors font-medium text-sm"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </motion.header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input & Controls */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Main Input Card */}
          <div id="input-card" className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 uppercase tracking-wider">
                <LinkIcon size={14} className="text-blue-500" />
                Your Content
              </label>
              <div className="relative group">
                <input 
                  id="qr-input"
                  type="text"
                  value={config.value}
                  onChange={(e) => setConfig({ ...config, value: e.target.value })}
                  placeholder="Paste URL or type text here..."
                  className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-neutral-400 font-sans"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {config.value && (
                    <button 
                      id="copy-text-button"
                      onClick={handleCopy}
                      className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors rounded-lg bg-white shadow-sm border border-neutral-100"
                    >
                      {isCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 uppercase tracking-wider">
                  <Palette size={14} className="text-purple-500" />
                  Code Color
                </label>
                <div className="flex gap-3">
                  <input 
                    id="fg-color-picker"
                    type="color"
                    value={config.fgColor}
                    onChange={(e) => setConfig({ ...config, fgColor: e.target.value })}
                    className="w-12 h-12 rounded-lg cursor-pointer border border-neutral-200 p-1 bg-white"
                  />
                  <input 
                    type="text"
                    value={config.fgColor.toUpperCase()}
                    readOnly
                    className="flex-1 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-sm uppercase text-neutral-600"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 uppercase tracking-wider">
                  <div className="w-3 h-3 bg-white border border-neutral-400 rounded-sm" />
                  Background
                </label>
                <div className="flex gap-3">
                  <input 
                    id="bg-color-picker"
                    type="color"
                    value={config.bgColor}
                    onChange={(e) => setConfig({ ...config, bgColor: e.target.value })}
                    className="w-12 h-12 rounded-lg cursor-pointer border border-neutral-200 p-1 bg-white"
                  />
                  <input 
                    type="text"
                    value={config.bgColor.toUpperCase()}
                    readOnly
                    className="flex-1 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-sm uppercase text-neutral-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Controls Card */}
          <div id="advanced-card" className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-200 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center gap-2 font-bold text-neutral-800">
                  <Settings size={18} className="text-neutral-400" />
                  Advanced Parameters
                </h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-semibold text-neutral-500 uppercase">
                    <span>Resolution</span>
                    <span className="text-blue-600 px-2 py-0.5 bg-blue-50 rounded-full font-mono">{config.size}px</span>
                  </div>
                  <input 
                    id="size-range"
                    type="range"
                    min="128"
                    max="1024"
                    step="16"
                    value={config.size}
                    onChange={(e) => setConfig({ ...config, size: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                    <span>128px</span>
                    <span>1024px</span>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Error Correction
                  </div>
                  <div className="flex p-1 bg-neutral-100 rounded-xl gap-1">
                    {(['L', 'M', 'Q', 'H'] as ECLevel[]).map((level) => (
                      <button
                        key={level}
                        id={`ec-level-${level}`}
                        onClick={() => setConfig({ ...config, level })}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                          config.level === level 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-neutral-400 hover:text-neutral-600'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-neutral-400 italic">
                    {config.level === 'L' && '7% recovery (Low)'}
                    {config.level === 'M' && '15% recovery (Medium)'}
                    {config.level === 'Q' && '25% recovery (Quartile)'}
                    {config.level === 'H' && '30% recovery (High)'}
                  </p>
               </div>
             </div>
          </div>
        </motion.div>

        {/* Right: Preview & Actions */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-5 sticky top-8"
        >
          <div id="preview-card" className="bg-white rounded-[2rem] p-4 md:p-6 border border-neutral-200 shadow-xl qr-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative flex flex-col gap-6">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Live Preview</span>
                {config.value && (
                   <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold bg-green-50 px-2 py-0.5 rounded-full uppercase">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Valid
                  </div>
                )}
              </div>

              <div id="qr-container" className="aspect-square w-full bg-neutral-50 rounded-3xl flex items-center justify-center p-8 border border-neutral-100 group-hover:border-blue-100 transition-colors" ref={qrRef}>
                <AnimatePresence mode="wait">
                  {config.value ? (
                    <motion.div
                      key="qrcode"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative"
                    >
                      <QRCodeCanvas
                        value={config.value}
                        size={Math.min(config.size, 300)}
                        fgColor={config.fgColor}
                        bgColor={config.bgColor}
                        level={config.level}
                        includeMargin={config.includeMargin}
                      />
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="empty"
                      className="text-neutral-300 flex flex-col items-center gap-3"
                    >
                      <QrCode size={64} strokeWidth={1.5} className="animate-pulse" />
                      <span className="text-sm font-medium">Enter a link to generate</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  id="download-button"
                  onClick={handleDownload}
                  disabled={!config.value}
                  className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all shadow-lg active:scale-95 ${
                    config.value 
                      ? 'bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/30' 
                      : 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200 shadow-none'
                  }`}
                >
                  <Download size={22} />
                  Download Code
                </button>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                   <button 
                    id="visit-link-button"
                    disabled={!config.value}
                    onClick={() => config.value && window.open(config.value, '_blank')}
                    className="py-3 px-4 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                  >
                    <ExternalLink size={16} />
                    Visit Link
                  </button>
                   <button 
                    id="copy-image-button"
                    disabled={!config.value}
                    className="py-3 px-4 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                    onClick={() => {
                        const canvas = qrRef.current?.querySelector('canvas');
                        if (canvas) {
                            canvas.toBlob((blob) => {
                                if (blob) {
                                  try {
                                    const item = new ClipboardItem({ "image/png": blob });
                                    navigator.clipboard.write([item]).then(() => {
                                        setIsCopied(true);
                                        setTimeout(() => setIsCopied(false), 2000);
                                    });
                                  } catch (e) {
                                    console.error("Clipboard API error", e);
                                  }
                                }
                            });
                        }
                    }}
                  >
                    {isCopied ? <Check size={16} className="text-green-500" /> : <Maximize size={16} />}
                    {isCopied ? 'Copied' : 'Copy Image'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 px-6 space-y-4">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <ChevronRight size={14} className="text-neutral-300" />
              Usage Tips
            </h4>
            <ul className="text-sm text-neutral-500 space-y-3 font-medium">
              <li className="flex gap-3 text-left">
                <span className="text-blue-500 flex-shrink-0">•</span>
                Use high contrast colors for better scan reliability.
              </li>
              <li className="flex gap-3 text-left">
                <span className="text-blue-500 flex-shrink-0">•</span>
                Pick 'H' error correction to ensure the code scans even if slightly damaged.
              </li>
              <li className="flex gap-3 border-t border-neutral-100 pt-3 italic text-neutral-400 font-normal text-left">
                Perfect for menus, business cards, Wi-Fi stickers, and social media.
              </li>
            </ul>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mt-20 pb-12 border-t border-neutral-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2 text-neutral-400 text-sm font-medium">
          <div className="w-1.5 h-1.5 bg-neutral-300 rounded-full" />
          QuickQR Studio
          <div className="w-1.5 h-1.5 bg-neutral-300 rounded-full" />
          Universal Code Standard
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#" className="text-xs font-bold text-neutral-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Privacy</a>
          <a href="#" className="text-xs font-bold text-neutral-400 hover:text-blue-600 transition-colors uppercase tracking-widest">Terms</a>
          <div className="px-3 py-1 bg-neutral-900 rounded-md text-[10px] text-white font-mono uppercase font-bold">Safe & Private</div>
        </div>
      </footer>
    </div>
  );
}
