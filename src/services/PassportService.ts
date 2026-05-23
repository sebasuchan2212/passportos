import { Evidence } from '@/domain/Evidence';
import { Result } from '@/domain/Result';
import { RuleEngine } from '@/domain/rules';
import { SkuPassport } from '@/domain/SkuPassport';
import type { EvidenceDTO, EvidenceType, PassportDTO, SkuInput } from '@/types/passport';

export class PassportService {
  constructor(private readonly ruleEngine = new RuleEngine()) {}

  createPassport(input: SkuInput): Result<PassportDTO> {
    const validation = this.validateSku(input);
    if (!validation.ok) return Result.failure(validation.error ?? '入力値が不正です。');

    const passport = new SkuPassport(input, this.ruleEngine.evaluate(input), []);
    return Result.success(passport.toDTO());
  }

  addEvidence(passport: PassportDTO, requirementId: string, type: EvidenceType, fileName: string, note: string): Result<PassportDTO> {
    if (!passport.requirements.some((requirement) => requirement.id === requirementId)) {
      return Result.failure('対象の要件が見つかりません。');
    }
    if (fileName.trim().length < 3) {
      return Result.failure('ファイル名は3文字以上で入力してください。');
    }

    const evidence = new Evidence(requirementId, type, fileName.trim(), 'Demo User', note.trim()).toDTO();
    const entity = new SkuPassport(
      passport.sku,
      passport.requirements,
      passport.evidence,
      new Date(passport.createdAt),
      new Date(passport.updatedAt),
      passport.id,
    );
    return Result.success(entity.withEvidence(evidence).toDTO());
  }

  regeneratePassport(passport: PassportDTO): PassportDTO {
    const regenerated = new SkuPassport(
      passport.sku,
      this.ruleEngine.evaluate(passport.sku),
      passport.evidence,
      new Date(passport.createdAt),
      new Date(),
      passport.id,
    );
    return regenerated.toDTO();
  }

  exportLaunchPack(passport: PassportDTO): string {
    const payload = {
      exportedAt: new Date().toISOString(),
      disclaimer: 'This export is an operational readiness packet, not final legal advice.',
      passport,
    };
    return JSON.stringify(payload, null, 2);
  }

  private validateSku(input: SkuInput): Result<true> {
    if (input.name.trim().length < 2) return Result.failure('商品名を2文字以上で入力してください。');
    if (input.skuCode.trim().length < 2) return Result.failure('SKUコードを2文字以上で入力してください。');
    if (!input.originCountry.trim()) return Result.failure('原産国を入力してください。');
    return Result.success(true);
  }
}

export class PassportAnalyticsService {
  calculatePortfolio(passports: PassportDTO[]) {
    const total = passports.length;
    const averageReadiness = total === 0
      ? 0
      : Math.round(passports.reduce((sum, item) => sum + item.summary.readinessScore, 0) / total);
    const blocked = passports.filter((item) => item.summary.criticalCount > 0).length;
    const dueSoon = passports.flatMap((item) => item.requirements).filter((req) => {
      const due = new Date(req.dueDate).getTime();
      const limit = Date.now() + 1000 * 60 * 60 * 24 * 14;
      return due <= limit && req.status !== 'complete';
    }).length;

    return { total, averageReadiness, blocked, dueSoon };
  }

  getLatestEvidence(passport: PassportDTO): EvidenceDTO[] {
    return [...passport.evidence].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }
}
