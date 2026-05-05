'use client';

import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Cpu, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

interface DropzoneProps {
  onFileSelect: (base64: string) => void;
  isProcessing: boolean;
}

export function Dropzone({ onFileSelect, isProcessing }: DropzoneProps) {
  const [isOver, setIsOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (file.type !== 'application/pdf') {
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      onFileSelect(base64);
    };
    reader.readAsDataURL(file);
  }, [onFileSelect]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full"
    >
      <div
        onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
        onDragLeave={() => setIsOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsOver(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        className={clsx(
          "relative overflow-hidden rounded-3xl p-1 transition-all duration-500",
          isOver ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_40px_rgba(99,102,241,0.3)]" : "bg-slate-800/50"
        )}
      >
        <div className={clsx(
          "relative flex flex-col items-center justify-center rounded-[22px] py-16 px-8 transition-all duration-500",
          isOver ? "bg-slate-950/90" : "bg-slate-900/40 border-2 border-dashed border-slate-800 hover:border-slate-700"
        )}>
          {/* Background Glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={clsx(
              "absolute -top-[50%] -left-[50%] w-[200%] h-[200%] transition-opacity duration-1000",
              isOver ? "opacity-20" : "opacity-0"
            )}>
              <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.5)_0%,transparent_70%)] animate-pulse" />
            </div>
          </div>

          <input
            type="file"
            accept=".pdf"
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />

          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center text-center space-y-6"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-t-2 border-indigo-500 animate-spin" />
                  <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Ingesting Data...</h3>
                  <p className="text-slate-400 text-sm mt-2 max-w-[240px]">
                    Claude is mapping the datasheet parameters to NEC code sections
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center text-center space-y-6"
              >
                <div className={clsx(
                  "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500",
                  isOver ? "bg-indigo-500 text-white rotate-12 scale-110" : "bg-slate-800 text-slate-400"
                )}>
                  <Upload className="w-10 h-10" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-100 tracking-tight">
                    {isOver ? "Let it go!" : "Upload Datasheet"}
                  </h3>
                  <p className="text-slate-400 text-sm max-w-[280px]">
                    Drag and drop a transformer PDF to instantly run a safety audit
                  </p>
                </div>

                <div className="flex items-center gap-3 py-2 px-4 rounded-full bg-slate-950/50 border border-slate-800 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  AI-Powered Extraction
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* File Hint */}
      <AnimatePresence>
        {fileName && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center justify-center gap-2 text-xs font-mono text-indigo-400"
          >
            <FileText className="w-3 h-3" />
            {fileName}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
