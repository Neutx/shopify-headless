import type { ExperimentResults, VariantMetrics } from '@/types/experiments';

/**
 * Calculate statistical significance using chi-square test
 */
export function calculateStatisticalSignificance(
  variantA: VariantMetrics,
  variantB: VariantMetrics
): number {
  const n1 = variantA.impressions;
  const n2 = variantB.impressions;
  const p1 = variantA.conversionRate;
  const p2 = variantB.conversionRate;

  if (n1 === 0 || n2 === 0) {
    return 1; // No significance if no data
  }

  const pooledP = ((p1 * n1) + (p2 * n2)) / (n1 + n2);
  const standardError = Math.sqrt(pooledP * (1 - pooledP) * (1 / n1 + 1 / n2));

  if (standardError === 0) {
    return 1;
  }

  const zScore = (p1 - p2) / standardError;
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));

  return pValue;
}

/**
 * Calculate confidence interval for conversion rate
 */
export function calculateConfidenceInterval(
  conversions: number,
  impressions: number,
  confidenceLevel: number
): [number, number] {
  if (impressions === 0) {
    return [0, 0];
  }

  const p = conversions / impressions;
  const z = getZScore(confidenceLevel);
  const standardError = Math.sqrt((p * (1 - p)) / impressions);

  const lower = Math.max(0, p - z * standardError);
  const upper = Math.min(1, p + z * standardError);

  return [lower, upper];
}

/**
 * Determine winner based on statistical significance
 */
export function determineWinner(results: ExperimentResults): string | null {
  const variants = Object.values(results.variantResults);

  if (variants.length < 2) {
    return null;
  }

  // Check if enough data collected
  const minImpressions = 1000; // Configurable threshold
  if (variants.some((v) => v.impressions < minImpressions)) {
    return null;
  }

  // Find best performer
  const best = variants.reduce((a, b) =>
    a.conversionRate > b.conversionRate ? a : b
  );

  // Check statistical significance against all others
  const isSignificant = variants
    .filter((v) => v.variantId !== best.variantId)
    .every((v) => {
      const pValue = calculateStatisticalSignificance(best, v);
      return pValue < 0.05; // 95% confidence
    });

  return isSignificant ? best.variantId : null;
}

/**
 * Normal cumulative distribution function
 */
function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  const prob =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

  return x > 0 ? 1 - prob : prob;
}

/**
 * Get z-score for confidence level
 */
function getZScore(confidenceLevel: number): number {
  const zScores: Record<number, number> = {
    90: 1.645,
    95: 1.96,
    99: 2.576,
  };

  return zScores[confidenceLevel] || 1.96;
}

/**
 * Calculate recommended action based on results
 */
export function getRecommendedAction(results: ExperimentResults): 'continue' | 'declare_winner' | 'stop' {
  const winner = determineWinner(results);

  if (winner) {
    return 'declare_winner';
  }

  const variants = Object.values(results.variantResults);
  const maxImpressions = Math.max(...variants.map((v) => v.impressions));

  // If we have enough data but no clear winner, might need to stop
  if (maxImpressions > 10000) {
    return 'stop';
  }

  return 'continue';
}

