export interface Agency {
  name: string;
  country: string;
  flag?: string;
  level: 'Federal' | 'National' | 'State' | 'European Union' | 'International';
}

export interface Grant {
  id: string;
  externalId: string;
  title: string;
  agency: Agency;
  summary: string;
  awardCeilingUsd: number;
  awardFloorUsd?: number;
  totalPoolUsd?: number;
  costSharingRequired?: boolean;
  costSharingPercent?: number;
  minTrl: number;
  maxTrl: number;
  eligibleCountries: string[];
  eligibleEntityTypes?: string[];
  sectors: string[];
  postedDate?: string;
  closeDate: string;
  status: 'active' | 'forecasted' | 'closed';
  officialUrl: string;
  isFeatured?: boolean;
  competitionLevel?: string;
  disbursementType?: string;
}

export interface CompanyProfile {
  country: string;
  sector: string;
  currentTrl: number;
  targetFundingUsd: number;
  entityType?: string;
}

export interface MatchScoreResult {
  grant: Grant;
  compatibilityScore: number; // 0 to 100
  matchReasons: string[];
  isHardDisqualified: boolean;
  disqualificationReason?: string;
}
