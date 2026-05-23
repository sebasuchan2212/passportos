import { PassportService } from '@/services/PassportService';
import type { PassportDTO, SkuInput } from '@/types/passport';

const service = new PassportService();

const seedInputs: SkuInput[] = [
  {
    name: 'Minimal Ceramic Aroma Diffuser',
    skuCode: 'JP-AROMA-001',
    category: 'general',
    originCountry: 'Japan',
    targetMarket: 'EU',
    channel: 'Shopify',
    hasResponsiblePerson: false,
    hasSafetyDocumentation: true,
    hasLocalizedLabel: false,
    hasIossOrVat: true,
    hasTraceabilityInfo: true,
  },
  {
    name: 'Kyoto Botanical Skin Balm',
    skuCode: 'JP-COS-042',
    category: 'cosmetics',
    originCountry: 'Japan',
    targetMarket: 'UK',
    channel: 'Amazon',
    hasResponsiblePerson: true,
    hasSafetyDocumentation: false,
    hasLocalizedLabel: true,
    hasIossOrVat: false,
    hasTraceabilityInfo: false,
  },
  {
    name: 'Compact Smart Kitchen Timer',
    skuCode: 'JP-ELC-018',
    category: 'electronics',
    originCountry: 'Japan',
    targetMarket: 'EU',
    channel: 'eBay',
    hasResponsiblePerson: true,
    hasSafetyDocumentation: false,
    hasLocalizedLabel: false,
    hasIossOrVat: true,
    hasTraceabilityInfo: true,
  },
];

export const createSeedPassports = (): PassportDTO[] => seedInputs.map((input) => service.createPassport(input).unwrap());
