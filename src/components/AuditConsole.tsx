'use client';

import React from 'react';
import { AuditResult } from '@/types';
import { CheckCircle2, XCircle, ShieldCheck, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

interface AuditConsoleProps {
  result: AuditResult;
}

export function AuditConsole({ result }: AuditConsoleProps) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden">
      <div className={clsx(
        "px-6 py-4 flex items-center justify-between border-b border-slate-800",
        result.passed ? "bg-emerald-500/10" : "bg-rose-500/10"
      )}>
        <div className="flex items-center gap-3">
          <ShieldCheck className={clsx("w-6 h-6", result.passed ? "text-emerald-400" : "text-rose-400")} />
          <h2 className="text-lg font-bold text-slate-100 uppercase tracking-tight">Engineering Audit</h2>
        </div>
        <div className={clsx(
          "px-3 py-1 rounded-full text-xs font-black uppercase",
          result.passed ? "bg-emerald-500 text-emerald-950" : "bg-rose-500 text-rose-950"
        )}>
          {result.status}
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {result.rules.map((rule) => (
            <div key={rule.id} className="group p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{rule.id}</span>
                    <h3 className="font-semibold text-slate-200">{rule.description}</h3>
                  </div>
                  <p className="text-xs text-slate-500 italic">Reference: {rule.citation}</p>
                </div>
                {rule.status === 'PASS' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500" />
                )}
              </div>
              
              <div className="mt-4 flex gap-8">
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Measured</div>
                  <div className={clsx("font-mono text-sm", rule.status === 'PASS' ? "text-emerald-400" : "text-rose-400")}>
                    {rule.actual}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Limit (Max)</div>
                  <div className="font-mono text-sm text-slate-300">{rule.limit}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {result.recommendations.length > 0 && (
          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Recommendations</span>
            </div>
            <ul className="space-y-2">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-slate-400 flex gap-2">
                  <span className="text-amber-500/50">•</span> {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
