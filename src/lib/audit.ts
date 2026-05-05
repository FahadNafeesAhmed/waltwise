import { TransformerSpecs, AuditResult } from '../types';

/**
 * Deterministic audit logic for transformer safety and compliance.
 * This is the "Truth" layer of the application.
 */
export function auditTransformer(specs: TransformerSpecs, loadKva: number): AuditResult {
  const rules: AuditResult['rules'] = [];
  const recommendations: string[] = [];
  
  // Rule 1: Capacity Check
  const loadPercentage = (loadKva / specs.kva) * 100;
  const capacityPassed = loadPercentage <= 80; // 80% rule for continuous load
  
  rules.push({
    id: 'CAP-001',
    description: 'Continuous Loading Capacity',
    status: capacityPassed ? 'PASS' : 'FAIL',
    citation: 'NEC 215.2(A)(1)',
    actual: `${loadPercentage.toFixed(1)}%`,
    limit: '80%',
  });

  if (!capacityPassed) {
    recommendations.push(`Transformer is overloaded for continuous use. Consider a larger unit or reducing load.`);
  }

  // Rule 2: Phase Match (Simplified)
  // In a real app, we'd check if the load is 3-phase or 1-phase
  
  // Rule 3: Impedance Check
  // Standard impedance is typically 2-6%. High impedance might cause voltage drop.
  const impedanceWarning = specs.impedance > 7;
  rules.push({
    id: 'IMP-001',
    description: 'Standard Impedance Range',
    status: impedanceWarning ? 'FAIL' : 'PASS',
    citation: 'IEEE C57.12.00',
    actual: `${specs.impedance}%`,
    limit: '2-7%',
  });

  if (impedanceWarning) {
    recommendations.push('High impedance detected. Verify voltage regulation and fault current requirements.');
  }

  const allPassed = rules.every(r => r.status === 'PASS');

  return {
    passed: allPassed,
    status: allPassed ? 'OK' : 'FAIL',
    loadPercentage,
    rules,
    recommendations,
  };
}
