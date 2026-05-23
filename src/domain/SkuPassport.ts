import type { EvidenceDTO, PassportDTO, PassportSummary, RequirementDTO, SkuInput } from '@/types/passport';
import { IdFactory } from './IdFactory';

export class SkuPassport {
  constructor(
    public readonly sku: SkuInput,
    public readonly requirements: RequirementDTO[],
    public readonly evidence: EvidenceDTO[],
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly id: string = IdFactory.create('pass'),
  ) {}

  getSummary(): PassportSummary {
    const total = Math.max(this.requirements.length, 1);
    const completeCount = this.requirements.filter((item) => item.status === 'complete').length;
    const missingCount = this.requirements.filter((item) => item.status === 'missing').length;
    const reviewCount = this.requirements.filter((item) => item.status === 'review').length;
    const criticalCount = this.requirements.filter((item) => item.risk === 'critical' && item.status !== 'complete').length;
    const readinessScore = Math.max(0, Math.round((completeCount / total) * 100 - criticalCount * 8 - reviewCount * 3));

    return { readinessScore, criticalCount, missingCount, reviewCount, completeCount };
  }

  withEvidence(evidence: EvidenceDTO): SkuPassport {
    return new SkuPassport(
      this.sku,
      this.requirements.map((requirement) =>
        requirement.id === evidence.requirementId ? { ...requirement, status: 'review' } : requirement,
      ),
      [evidence, ...this.evidence],
      this.createdAt,
      new Date(),
      this.id,
    );
  }

  toDTO(): PassportDTO {
    return {
      id: this.id,
      sku: this.sku,
      requirements: this.requirements,
      evidence: this.evidence,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      summary: this.getSummary(),
    };
  }
}
