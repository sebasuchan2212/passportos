import type { RequirementDTO, RequirementStatus, RiskLevel } from '@/types/passport';
import { IdFactory } from './IdFactory';

export class ComplianceRequirement {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly status: RequirementStatus,
    public readonly risk: RiskLevel,
    public readonly dueDate: Date,
    public readonly sourceName: string,
    public readonly sourceUrl: string,
    public readonly actionLabel: string,
    public readonly id: string = IdFactory.create('req'),
  ) {}

  isActionRequired(): boolean {
    return this.status === 'missing' || this.status === 'blocked' || this.status === 'review';
  }

  toDTO(): RequirementDTO {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      risk: this.risk,
      dueDate: this.dueDate.toISOString(),
      sourceName: this.sourceName,
      sourceUrl: this.sourceUrl,
      actionLabel: this.actionLabel,
    };
  }
}
