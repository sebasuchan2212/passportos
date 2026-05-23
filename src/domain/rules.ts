import type { RequirementDTO, SkuInput } from '@/types/passport';
import { ComplianceRequirement } from './ComplianceRequirement';

export interface ComplianceRule {
  evaluate(sku: SkuInput, now: Date): RequirementDTO;
}

const addDays = (date: Date, days: number): Date => {
  const output = new Date(date);
  output.setDate(output.getDate() + days);
  return output;
};

export class GpsrResponsiblePersonRule implements ComplianceRule {
  evaluate(sku: SkuInput, now: Date): RequirementDTO {
    return new ComplianceRequirement(
      'EU/UK責任者情報',
      'EU/UK向け販売では、商品情報・ラベル・販売ページ上で責任者情報を明確に管理する必要があります。',
      sku.hasResponsiblePerson ? 'complete' : 'blocked',
      sku.hasResponsiblePerson ? 'low' : 'critical',
      addDays(now, 14),
      'EU GPSR / Marketplace policy',
      'https://eur-lex.europa.eu/eli/reg/2023/988/oj/eng',
      '責任者情報を登録する',
    ).toDTO();
  }
}

export class SafetyDocumentationRule implements ComplianceRule {
  evaluate(sku: SkuInput, now: Date): RequirementDTO {
    return new ComplianceRequirement(
      '安全性・技術文書の証跡',
      '製品安全、製造者情報、リスク評価、取扱説明など、販売停止時に提示できる証跡パケットを保存します。',
      sku.hasSafetyDocumentation ? 'complete' : 'missing',
      sku.hasSafetyDocumentation ? 'low' : sku.category === 'electronics' ? 'critical' : 'high',
      addDays(now, 21),
      'Internal launch pack policy',
      'https://www.jetro.go.jp/world/qa/F-220812.html',
      '証跡ドキュメントをアップロードする',
    ).toDTO();
  }
}

export class LocalizedLabelRule implements ComplianceRule {
  evaluate(sku: SkuInput, now: Date): RequirementDTO {
    return new ComplianceRequirement(
      '現地向けラベル・表示',
      '販売国に合わせた商品名、事業者情報、注意表示、トレーサビリティ情報を確認します。',
      sku.hasLocalizedLabel ? 'complete' : 'missing',
      sku.hasLocalizedLabel ? 'low' : 'high',
      addDays(now, 10),
      'Marketplace listing readiness',
      'https://www.ebay.com/sellercenter/resources/general-product-safety-regulation',
      'ラベル表示を確認する',
    ).toDTO();
  }
}

export class IossVatRule implements ComplianceRule {
  evaluate(sku: SkuInput, now: Date): RequirementDTO {
    return new ComplianceRequirement(
      'IOSS / VAT運用番号',
      'EU向け小口輸入では、税務番号・通関電子データ・販売チャネル側の設定をSKUと紐付けて管理します。',
      sku.hasIossOrVat ? 'complete' : 'review',
      sku.hasIossOrVat ? 'low' : 'medium',
      addDays(now, 30),
      'IOSS / VAT operational guidance',
      'https://www.post.japanpost.jp/int/information/2022/0825_01.html',
      '税務・通関設定をレビューする',
    ).toDTO();
  }
}

export class TraceabilityRule implements ComplianceRule {
  evaluate(sku: SkuInput, now: Date): RequirementDTO {
    return new ComplianceRequirement(
      'トレーサビリティ情報',
      'SKUコード、製造者、ロット、原産国、販売チャネルを関連付け、後から監査できる状態にします。',
      sku.hasTraceabilityInfo ? 'complete' : 'missing',
      sku.hasTraceabilityInfo ? 'low' : 'high',
      addDays(now, 7),
      'Audit evidence best practice',
      'https://www.jetro.go.jp/biz/areareports/2025/c13613e3ff11e482.html',
      'SKU証跡を補完する',
    ).toDTO();
  }
}

export class CategorySpecificRule implements ComplianceRule {
  evaluate(sku: SkuInput, now: Date): RequirementDTO {
    const categoryText = {
      cosmetics: '化粧品は成分・表示・責任者・安全性資料の確認が必要です。',
      electronics: '電子機器は安全基準、技術文書、表示、CE関連の確認が必要になる可能性があります。',
      food: '食品は成分、アレルゲン、原産国、現地表示、輸入要件の確認が必要です。',
      apparel: 'アパレルは素材表示、原産国、包装、EPR関連の確認が必要になる可能性があります。',
      general: '一般雑貨はGPSR、表示、責任者、証跡保管を中心に確認します。',
    }[sku.category];

    return new ComplianceRequirement(
      'カテゴリ固有レビュー',
      categoryText,
      'review',
      sku.category === 'general' ? 'medium' : 'high',
      addDays(now, 18),
      'Category compliance review',
      'https://www.jetro.go.jp/theme/export/js-links/2025/204.html',
      '専門家レビュー候補に追加する',
    ).toDTO();
  }
}

export class RuleEngine {
  private readonly rules: ComplianceRule[];

  constructor(rules: ComplianceRule[] = [
    new GpsrResponsiblePersonRule(),
    new SafetyDocumentationRule(),
    new LocalizedLabelRule(),
    new IossVatRule(),
    new TraceabilityRule(),
    new CategorySpecificRule(),
  ]) {
    this.rules = rules;
  }

  evaluate(sku: SkuInput, now: Date = new Date()): RequirementDTO[] {
    return this.rules.map((rule) => rule.evaluate(sku, now));
  }
}
