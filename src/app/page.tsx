'use client';

import React, { useState } from 'react';
import { Dropzone } from '@/components/Dropzone';
import { DiagramCanvas } from '@/components/DiagramCanvas';
import { AuditConsole } from '@/components/AuditConsole';
import { ExtractionResponse } from '@/types';
import { Zap, Cpu, Terminal, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState<ExtractionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (pdfBase64: string) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfBase64, loadKva: 45 }), // 45kVA as sample load
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process datasheet');
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500 rounded-lg">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">
              Aran <span className="text-indigo-500 font-normal not-italic tracking-normal lowercase">prototype</span>
            </h1>
          </div>
          <p className="text-slate-400 max-w-md text-sm leading-relaxed">
            AI-powered transformer datasheet analyzer. Extract specs and run deterministic NEC audits in seconds.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono text-slate-400">Logic: NEC 450.3</span>
          </div>
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-mono text-slate-400">AI: Claude 3.5 Sonnet</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Upload & Audit */}
        <div className="lg:col-span-5 space-y-8">
          {!data ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Dropzone onFileSelect={handleFileUpload} isProcessing={isProcessing} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Extraction Complete</h2>
                <button 
                  onClick={() => setData(null)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4"
                >
                  Analyze New Datasheet
                </button>
              </div>
              <AuditConsole result={data.auditResult} />
            </motion.div>
          )}

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex gap-3 items-center">
              <Zap className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Right Panel: Diagram */}
        <div className="lg:col-span-7 h-[600px] lg:h-[700px] sticky top-12">
          <AnimatePresence mode="wait">
            {data ? (
              <motion.div
                key="diagram"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <DiagramCanvas specs={data.specs} loadKva={45} />
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-12"
              >
                <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-6">
                  <Cpu className="w-10 h-10 text-slate-700" />
                </div>
                <h3 className="text-xl font-semibold text-slate-500 mb-2">Wiring Diagram Preview</h3>
                <p className="text-slate-600 max-w-xs text-sm">
                  Upload a transformer datasheet to generate a real-time engineering diagram and safety audit.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-24 pt-8 border-t border-slate-900 flex justify-between items-center text-slate-600 text-xs uppercase tracking-widest font-medium">
        <span>© 2024 Aran Engineering Tools</span>
        <span>PE-Stampable Logic Engine v0.1</span>
      </footer>
    </main>
  );
}
