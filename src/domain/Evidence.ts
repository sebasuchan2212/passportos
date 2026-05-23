import type { EvidenceDTO, EvidenceType } from '@/types/passport';
import { IdFactory } from './IdFactory';

export class Evidence {
  constructor(
    public readonly requirementId: string,
    public readonly type: EvidenceType,
    public readonly fileName: string,
    public readonly uploadedBy: string,
    public readonly note: string,
    public readonly version = 1,
    public readonly uploadedAt: Date = new Date(),
    public readonly id: string = IdFactory.create('evd'),
  ) {}

  nextVersion(fileName: string, note: string): Evidence {
    return new Evidence(
      this.requirementId,
      this.type,
      fileName,
      this.uploadedBy,
      note,
      this.version + 1,
    );
  }

  toDTO(): EvidenceDTO {
    return {
      id: this.id,
      requirementId: this.requirementId,
      type: this.type,
      fileName: this.fileName,
      uploadedAt: this.uploadedAt.toISOString(),
      uploadedBy: this.uploadedBy,
      version: this.version,
      note: this.note,
    };
  }
}
