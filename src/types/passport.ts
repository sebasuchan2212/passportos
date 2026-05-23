export type MarketCode = 'EU' | 'UK';
export type SalesChannel = 'Amazon' | 'Shopify' | 'eBay' | 'OwnStore';
export type ProductCategory = 'cosmetics' | 'electronics' | 'food' | 'apparel' | 'general';
export type RequirementStatus = 'complete' | 'missing' | 'review' | 'blocked';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type EvidenceType = 'document' | 'label' | 'certificate' | 'responsiblePerson' | 'tax' | 'other';

export interface SkuInput {
  name: string;
  skuCode: string;
  category: ProductCategory;
  originCountry: string;
  targetMarket: MarketCode;
  channel: SalesChannel;
  hasResponsiblePerson: boolean;
  hasSafetyDocumentation: boolean;
  hasLocalizedLabel: boolean;
  hasIossOrVat: boolean;
  hasTraceabilityInfo: boolean;
}

export interface PassportSummary {
  readinessScore: number;
  criticalCount: number;
  missingCount: number;
  reviewCount: number;
  completeCount: number;
}

export interface RequirementDTO {
  id: string;
  title: string;
  description: string;
  status: RequirementStatus;
  risk: RiskLevel;
  dueDate: string;
  sourceName: string;
  sourceUrl: string;
  actionLabel: string;
}

export interface EvidenceDTO {
  id: string;
  requirementId: string;
  type: EvidenceType;
  fileName: string;
  uploadedAt: string;
  uploadedBy: string;
  version: number;
  note: string;
}

export interface PassportDTO {
  id: string;
  sku: SkuInput;
  createdAt: string;
  updatedAt: string;
  requirements: RequirementDTO[];
  evidence: EvidenceDTO[];
  summary: PassportSummary;
}
