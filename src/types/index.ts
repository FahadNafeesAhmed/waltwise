export interface TransformerSpecs {
  kva: number;
  primaryVoltage: number;
  secondaryVoltage: number;
  phase: 1 | 3;
  impedance: number; // percentage, e.g., 5.75
  windingMaterial?: 'Copper' | 'Aluminum';
  temperatureRise?: number;
  frequency?: number;
}

export interface AuditResult {
  passed: boolean;
  status: 'OK' | 'FAIL';
  loadPercentage: number;
  rules: {
    id: string;
    description: string;
    status: 'PASS' | 'FAIL';
    citation: string;
    actual: string;
    limit: string;
  }[];
  recommendations: string[];
}

export interface ExtractionResponse {
  specs: TransformerSpecs;
  auditResult: AuditResult;
}
