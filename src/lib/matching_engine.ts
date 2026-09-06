import { Grant, CompanyProfile, MatchScoreResult } from '../types/grant';

/**
 * Deterministic Compatibility Matching Engine for GovGrant Radar.
 * Evaluates company technical profiles against statutory government call parameters.
 */
export function calculateGrantCompatibility(
  grant: Grant,
  profile: CompanyProfile
): MatchScoreResult {
  let score = 0;
  const reasons: string[] = [];

  // 1. Geographic Territorial Eligibility (Hard Check)
  const isGeoEligible =
    grant.eligibleCountries.includes(profile.country) ||
    grant.eligibleCountries.includes('EU_ALL') ||
    grant.eligibleCountries.includes('GLOBAL');

  if (!isGeoEligible) {
    return {
      grant,
      compatibilityScore: 0,
      matchReasons: [`Disqualified: Must be incorporated in ${grant.eligibleCountries.join(', ')}`],
      isHardDisqualified: true,
      disqualificationReason: 'Geographic territory mismatch'
    };
  }

  score += 30;
  reasons.push(`${grant.agency.country} Territorial Match (+30)`);

  // 2. Technology Readiness Level (TRL) Alignment (35 points)
  if (profile.currentTrl >= grant.minTrl && profile.currentTrl <= grant.maxTrl) {
    score += 35;
    reasons.push(`TRL ${profile.currentTrl} falls within target range TRL ${grant.minTrl}–${grant.maxTrl} (+35)`);
  } else if (
    Math.abs(profile.currentTrl - grant.minTrl) === 1 ||
    Math.abs(profile.currentTrl - grant.maxTrl) === 1
  ) {
    score += 15;
    reasons.push(`TRL ${profile.currentTrl} is adjacent to target window (+15)`);
  } else {
    // Large TRL mismatch
    score += 0;
  }

  // 3. Sector & Technology Focus Match (25 points)
  if (grant.sectors.includes(profile.sector)) {
    score += 25;
    reasons.push(`Primary sector [${profile.sector.toUpperCase()}] matches agency solicitation (+25)`);
  } else {
    score += 8;
    reasons.push(`Cross-disciplinary consideration (+8)`);
  }

  // 4. Target Funding Fit (10 points)
  if (grant.awardCeilingUsd >= profile.targetFundingUsd * 0.7) {
    score += 10;
    reasons.push(`Funding pool matches capital requirement (+10)`);
  }

  return {
    grant,
    compatibilityScore: Math.min(score, 100),
    matchReasons: reasons,
    isHardDisqualified: false
  };
}

/**
 * Ranks and sorts an array of grants for a given profile.
 */
export function rankGrantsForProfile(
  grants: Grant[],
  profile: CompanyProfile
): MatchScoreResult[] {
  return grants
    .map(grant => calculateGrantCompatibility(grant, profile))
    .filter(result => !result.isHardDisqualified)
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}
