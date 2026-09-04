export type CauseCategory = 'education' | 'health' | 'climate' | 'poverty' | 'disability-support';

export interface Cause {
  id: string;
  name: string;
  category: CauseCategory;
  location: string;
  description: string;
  fundingGoalSol: number;
  fundedSol: number;
  imageUrl: string;
  treasuryAddress: string;
}

export interface Donation {
  signature: string;
  causeId: string;
  amountSol: number;
  donorName?: string;
  timestamp: string;
  narrative: string;
}

export interface MatchResult {
  causeId: string;
  reason: string;
}

export interface ImpactReportData {
  summary: string;
  categoryTotals: Record<string, number>;
  source: 'snowflake' | 'mock';
}
