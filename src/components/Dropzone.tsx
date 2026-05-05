'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface DropzoneProps {
  onFileSelect: (base64: string) => void;
  isProcessing: boolean;
}

export function Dropzone({ onFileSelect, isProcessing }: DropzoneProps) {
  const [isOver, setIsOver] = useState(false);

  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      onFileSelect(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
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
        "relative group cursor-pointer border-2 border-dashed rounded-2xl p-12 transition-all duration-300",
        isOver ? "border-indigo-500 bg-indigo-500/10" : "border-slate-700 bg-slate-900/50 hover:border-slate-600",
        isProcessing && "opacity-50 pointer-events-none"
      )}
    >
      <input
        type="file"
        accept=".pdf"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={clsx(
          "w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300",
          isOver ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400 group-hover:text-slate-300"
        )}>
          {isProcessing ? (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-current" />
          ) : (
            <Upload className="w-8 h-8" />
          )}
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-slate-100">
            {isProcessing ? "Analyzing Datasheet..." : "Drop Transformer Datasheet"}
          </h3>
          <p className="text-slate-400 mt-1">
            {isProcessing ? "Claude is reading the PDF and running NEC audits" : "Drag and drop the PDF here or click to browse"}
          </p>
        </div>

        <div className="flex gap-4 text-xs font-medium uppercase tracking-wider text-slate-500">
          <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> PDF Only</span>
          <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Automatic Extraction</span>
        </div>
      </div>
    </div>
  );
}
