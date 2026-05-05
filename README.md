# ⚡ Aran | Transformer Datasheet Analyzer

Aran is a high-performance engineering prototype designed to bridge the gap between unstructured electrical datasheets and deterministic safety compliance. 

Drag a transformer PDF onto the dashboard, and Aran instantly extracts technical specifications using AI, runs a deterministic NEC audit, and generates a professional wiring schematic.

![Aran Prototype](https://img.shields.io/badge/Status-Prototype_v0.1-indigo)
![Stack](https://img.shields.io/badge/Stack-Next.js_15_|_TS_|_Tailwind_4-blue)
![Engine](https://img.shields.io/badge/Logic-NEC_450.3-emerald)

## 🚀 Key Features

- **Neural Ingestion**: Uses Claude 3.5 Sonnet to parse messy, multi-manufacturer PDF datasheets into structured JSON.
- **Deterministic Auditing**: A dedicated TypeScript math engine validates the transformer against NEC 450.3 (Overcurrent Protection) and continuous loading rules (NEC 215.2).
- **Dynamic Schematics**: Powered by React Flow, it generates real-time wiring diagrams showing primary/secondary connections and kVA ratings.
- **Cinematic UI**: A premium, dark-mode engineering dashboard featuring glassmorphism, live audit consoles, and Framer Motion animations.

## 🛠️ The Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Diagramming**: React Flow (@xyflow/react)
- **AI Orchestration**: Anthropic SDK (Claude 3.5 Sonnet)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📂 Architecture: "Fuzzy vs. Deterministic"

Aran follows a strict separation of concerns to ensure safety in engineering:
1.  **Fuzzy Zone (AI)**: Claude handles the unstructured PDF data and extracts key parameters (kVA, Voltage, Phase, Impedance).
2.  **Deterministic Zone (Logic)**: Our local `lib/audit.ts` takes the structured data and runs reproducible arithmetic based on the National Electrical Code.

*This ensures that while the reading is assisted by AI, the safety decision is always calculated by hard-coded engineering rules.*

## ⚙️ Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/FahadNafeesAhmed/waltwise.git
cd waltwise
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root and add your Anthropic API key:
```env
ANTHROPIC_API_KEY=your_sk_key_here
```

### 3. Run Development
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to start the engine.

---
Built with ⚡ by Aran Engineering Tools
