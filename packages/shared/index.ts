export type ScopeKind = 'PROJECT'|'EPIC'|'STORY';
export type StoryStatus = 'DRAFT'|'ANALYST_REVIEWED'|'PO_REVIEW'|'NEEDS_REVISION'|'AWAITING_HUMAN'|'APPROVED'|'REJECTED'|'RUNNING'|'DONE'|'FAILED';

export interface DoRResult {
  decision: 'APPROVE'|'REVISE'|'REJECT';
  rubric: {
    acceptanceCriteria: boolean;
    atomicScope: boolean;
    dataContractsLinked: boolean;
    dependenciesResolved: boolean;
    goalClear: boolean;
    nonFunctionalNoted: boolean;
    ownerNamed: boolean;
    rollbackPlan: boolean;
  };
  notes?: string;
  risk: 'LOW'|'MEDIUM'|'HIGH';
  size: 'XS'|'S'|'M'|'L'|'XL';
}