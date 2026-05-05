'use client';

import React, { useState, useEffect } from 'react';
import { Dropzone } from '@/components/Dropzone';
import { DiagramCanvas } from '@/components/DiagramCanvas';
import { AuditConsole } from '@/components/AuditConsole';
import { ExtractionResponse } from '@/types';
import { Zap, Cpu, Terminal, ShieldCheck, Activity, Layers, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState<ExtractionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusLog, setStatusLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setStatusLog(prev => [...prev.slice(-4), msg]);
  };

  const handleFileUpload = async (pdfBase64: string) => {
    setIsProcessing(true);
    setError(null);
    setStatusLog(["Initializing ingestion engine...", "Waiting for Claude 3.5 Sonnet..."]);
    
    try {
      addLog("Sending PDF document to extraction pipeline...");
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfBase64, loadKva: 45 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process datasheet');
      }

      addLog("Extraction successful. Running NEC audits...");
      const result = await response.json();
      
      setTimeout(() => {
        setData(result);
        addLog("Audit complete. Status: " + result.auditResult.status);
      }, 800);
      
    } catch (err: any) {
      setError(err.message);
      addLog("ERROR: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <main className="relative max-w-[1600px] mx-auto p-6 lg:p-10">
        {/* Navigation / Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative p-3 bg-slate-900 rounded-2xl border border-slate-800">
                <Cpu className="w-8 h-8 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-black tracking-tighter uppercase italic italic">
                  ARAN <span className="text-indigo-500 font-normal not-italic tracking-normal lowercase">v0.1</span>
                </h1>
                <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Prototype</span>
              </div>
              <p className="text-slate-500 text-sm font-medium tracking-tight">Transformer Compliance & Design Engine</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <StatBadge icon={<Terminal className="w-3 h-3" />} label="Logic" value="NEC 450.3" color="emerald" />
            <StatBadge icon={<ShieldCheck className="w-3 h-3" />} label="AI" value="Claude 3.5" color="indigo" />
            <StatBadge icon={<Activity className="w-3 h-3" />} label="Status" value={isProcessing ? "Analyzing" : "Standby"} color={isProcessing ? "amber" : "slate"} />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Input & Audit */}
          <div className="lg:col-span-5 space-y-10">
            <AnimatePresence mode="wait">
              {!data ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Step 01</h2>
                    <h3 className="text-2xl font-bold text-white tracking-tight">Ingest Datasheet</h3>
                  </div>
                  <Dropzone onFileSelect={handleFileUpload} isProcessing={isProcessing} />
                  
                  {/* Console Log */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 font-mono text-xs overflow-hidden">
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-900">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                      <span className="text-slate-500 font-bold uppercase tracking-widest">Audit Console</span>
                    </div>
                    <div className="space-y-2">
                      {statusLog.length === 0 ? (
                        <span className="text-slate-700 italic">Waiting for input...</span>
                      ) : (
                        statusLog.map((log, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: -5 }} 
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-3"
                          >
                            <span className="text-slate-600">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                            <span className={clsx(log.startsWith("ERROR") ? "text-rose-400" : "text-slate-400")}>{log}</span>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="audit"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-xs font-bold text-indigo-500 uppercase tracking-[0.2em]">Step 02</h2>
                      <h3 className="text-2xl font-bold text-white tracking-tight">Audit Results</h3>
                    </div>
                    <button 
                      onClick={() => { setData(null); setStatusLog([]); }}
                      className="group flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors"
                    >
                      Reset Engine <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  <AuditConsole result={data.auditResult} />
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-rose-400 text-sm flex gap-3 items-center"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </div>

          {/* Right Column: Visualization */}
          <div className="lg:col-span-7 space-y-8 h-[700px] lg:h-[800px] sticky top-10">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <Layers className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Engineering Diagram</h3>
            </div>
            
            <div className="relative h-[calc(100%-48px)]">
              <AnimatePresence mode="wait">
                {data ? (
                  <motion.div
                    key="diagram"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
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
                    className="h-full bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[32px] flex flex-col items-center justify-center text-center p-12 overflow-hidden"
                  >
                    {/* Decorative Background Elements */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-slate-700 rounded-full" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-slate-700 rounded-full" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-slate-700 rounded-full" />
                    </div>
                    
                    <div className="relative">
                      <div className="w-24 h-24 rounded-3xl bg-slate-800/40 flex items-center justify-center mb-8 border border-slate-700/50 backdrop-blur-sm">
                        <Zap className="w-10 h-10 text-slate-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-400 mb-3 tracking-tight">System Ready</h3>
                      <p className="text-slate-600 max-w-sm text-sm leading-relaxed">
                        The neural design engine is on standby. Upload a datasheet to generate technical schematics and safety audits.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      
      {/* Technical Footer */}
      <footer className="max-w-[1600px] mx-auto px-10 py-12 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-600">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Logic Engine Stable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500/50" />
            <span className="text-[10px] font-bold uppercase tracking-widest">AI Extraction Active</span>
          </div>
        </div>
        <div className="text-[10px] font-mono tracking-tighter uppercase opacity-50">
          waltwise // aran-prototype // build_id: 8e145992
        </div>
      </footer>
    </div>
  );
}

function StatBadge({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: 'emerald' | 'indigo' | 'amber' | 'slate' }) {
  const colors = {
    emerald: 'text-emerald-400 bg-emerald-400/5 border-emerald-400/20',
    indigo: 'text-indigo-400 bg-indigo-400/5 border-indigo-400/20',
    amber: 'text-amber-400 bg-amber-400/5 border-amber-400/20',
    slate: 'text-slate-500 bg-slate-500/5 border-slate-500/20',
  };

  return (
    <div className={clsx("flex items-center gap-3 px-4 py-2 border rounded-xl backdrop-blur-sm", colors[color])}>
      {icon}
      <div className="flex flex-col">
        <span className="text-[8px] font-black uppercase tracking-[0.15em] opacity-60">{label}</span>
        <span className="text-xs font-bold font-mono tracking-tight">{value}</span>
      </div>
    </div>
  );
}
