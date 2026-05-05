'use client';

import React, { useMemo } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Handle, 
  Position,
  NodeProps,
  Edge,
  Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TransformerSpecs } from '@/types';
import { Zap, Activity } from 'lucide-react';

const TransformerNode = ({ data }: NodeProps<{ specs: TransformerSpecs }>) => {
  return (
    <div className="px-4 py-3 shadow-xl rounded-xl bg-slate-900 border-2 border-indigo-500 min-w-[200px]">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
        <Zap className="w-5 h-5 text-indigo-400" />
        <span className="font-bold text-slate-100 uppercase text-sm tracking-widest">Transformer</span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Capacity</span>
          <span className="text-indigo-300 font-mono">{data.specs.kva} kVA</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Primary</span>
          <span className="text-slate-200 font-mono">{data.specs.primaryVoltage}V</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Secondary</span>
          <span className="text-slate-200 font-mono">{data.specs.secondaryVoltage}V</span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-indigo-500" />
    </div>
  );
};

const LoadNode = ({ data }: NodeProps<{ loadKva: number }>) => {
  return (
    <div className="px-4 py-3 shadow-xl rounded-xl bg-slate-900 border-2 border-emerald-500 min-w-[180px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-emerald-500" />
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
        <Activity className="w-5 h-5 text-emerald-400" />
        <span className="font-bold text-slate-100 uppercase text-sm tracking-widest">Connected Load</span>
      </div>
      <div className="text-center py-2">
        <span className="text-2xl font-mono font-bold text-emerald-400">{data.loadKva} kVA</span>
      </div>
    </div>
  );
};

const nodeTypes = {
  transformer: TransformerNode,
  load: LoadNode,
};

interface DiagramCanvasProps {
  specs: TransformerSpecs;
  loadKva: number;
}

export function DiagramCanvas({ specs, loadKva }: DiagramCanvasProps) {
  const nodes: Node[] = useMemo(() => [
    {
      id: 'transformer',
      type: 'transformer',
      position: { x: 250, y: 50 },
      data: { specs },
    },
    {
      id: 'load',
      type: 'load',
      position: { x: 260, y: 250 },
      data: { loadKva },
    },
  ], [specs, loadKva]);

  const edges: Edge[] = useMemo(() => [
    {
      id: 'e1-2',
      source: 'transformer',
      target: 'load',
      animated: true,
      style: { stroke: '#6366f1', strokeWidth: 3 },
    },
  ], []);

  return (
    <div className="h-full w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        colorMode="dark"
      >
        <Background color="#1e293b" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
