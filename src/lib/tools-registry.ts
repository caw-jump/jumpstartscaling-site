/**
 * Tools Registry - Maps calculator slug to React component
 * Add new calculators here when extending the tools collection
 */
import type { ComponentType } from 'react';

export const TOOLS_REGISTRY: Record<string, () => Promise<{ default: ComponentType }>> = {
  'startup-valuation-calculator': () => import('../components/tools/StartupValuationCalculator.tsx'),
  'ecommerce-sales-projector': () => import('../components/tools/EcommerceSalesProjector.tsx'),
  'company-sales-comparison': () => import('../components/tools/CompanySalesComparison.tsx'),
  'loyalty-rewards-optimizer': () => import('../components/tools/LoyaltyRewardsOptimizer.tsx'),
  'unemployment-impact-simulator': () => import('../components/tools/UnemploymentImpactSimulator.tsx'),
  'acquisition-value-estimator': () => import('../components/tools/AcquisitionValueEstimator.tsx'),
  'interest-rate-cut-calculator': () => import('../components/tools/InterestRateCutCalculator.tsx'),
  'labor-dispute-risk-analyzer': () => import('../components/tools/LaborDisputeRiskAnalyzer.tsx'),
  'ai-music-royalty-calculator': () => import('../components/tools/AIMusicRoyaltyCalculator.tsx'),
  'ai-ip-risk-estimator': () => import('../components/tools/AIIPRiskEstimator.tsx'),
};

export type ToolSlug = keyof typeof TOOLS_REGISTRY;

export function getToolComponent(slug: string) {
  return TOOLS_REGISTRY[slug] ?? null;
}
