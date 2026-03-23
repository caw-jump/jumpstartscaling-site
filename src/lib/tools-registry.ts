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
  'options-profit-calculator': () => import('../components/tools/OptionsProfitCalculator.tsx'),
  'optionstrat': () => import('../components/tools/OptionStrat.tsx'),
  'myfxbook-position-size-calculator': () => import('../components/tools/MyfxbookPositionSizeCalculator.tsx'),
  'impermanent-loss-calculator': () => import('../components/tools/ImpermanentLossCalculator.tsx'),
  'servicetitan-roi-calculator': () => import('../components/tools/ServiceTitanROICalculator.tsx'),
  'belkins-roi-calculator': () => import('../components/tools/BelkinsROICalculator.tsx'),
  'laman7-roi-calculator': () => import('../components/tools/Laman7ROICalculator.tsx'),
  'clickfunnels-roi-calculator': () => import('../components/tools/ClickFunnelsROICalculator.tsx'),
  'green-leads-roi-calculator': () => import('../components/tools/GreenLeadsROICalculator.tsx'),
  'omni-marketing-roi-calculator': () => import('../components/tools/OmniMarketingROICalculator.tsx'),
  'binance-liquidation-calculator': () => import('../components/tools/BinanceLiquidationCalculator.tsx'),
  'kelly-criterion-calculator': () => import('../components/tools/KellyCriterionCalculator.tsx'),
  'saas-ltv-to-cac-calculator': () => import('../components/tools/SaaSLTVtoCACCalculator.tsx'),
  'saas-net-revenue-retention-calculator': () => import('../components/tools/SaaSNetRevenueRetentionCalculator.tsx'),
  'real-estate-wholesaling-mao-calculator': () => import('../components/tools/RealEstateWholesalingMAOCalculator.tsx'),
  'mortgage-recast-vs-refinance-calculator': () => import('../components/tools/MortgageRecastVsRefinanceCalculator.tsx'),
  'cap-rate-noi-calculator': () => import('../components/tools/CapRateNOICalculator.tsx'),
  'ecommerce-roas-target-calculator': () => import('../components/tools/EcommerceROASTargetCalculator.tsx'),
  'seo-keyword-value-calculator': () => import('../components/tools/SEOKeywordValueCalculator.tsx'),
  'call-center-cpl-calculator': () => import('../components/tools/CallCenterCPLCalculator.tsx'),
};

export type ToolSlug = keyof typeof TOOLS_REGISTRY;

export function getToolComponent(slug: string) {
  return TOOLS_REGISTRY[slug] ?? null;
}
