#!/usr/bin/env python3
"""
GovGrant Radar - Public Grant Ingestion & Normalization Engine
Fetches, cleans, and normalizes public innovation and research grants into standard schema.
"""

import json
import os
import sys
from datetime import datetime

# Standard sector taxonomy mapping
SECTOR_TAXONOMY = {
    "artificial intelligence": "ai_ml",
    "machine learning": "ai_ml",
    "deep learning": "ai_ml",
    "robotics": "robotics",
    "autonomous": "robotics",
    "clean energy": "cleantech",
    "solar": "cleantech",
    "battery": "cleantech",
    "carbon": "cleantech",
    "biotechnology": "biotech",
    "genomics": "biotech",
    "digital health": "healthtech",
    "medical device": "healthtech",
    "agriculture": "agritech",
    "farming": "agritech",
    "software": "software",
    "cloud": "software",
    "cybersecurity": "cybersecurity"
}

def infer_trl(text: str) -> tuple[int, int]:
    """Infers the Technology Readiness Level (TRL) range from text keywords."""
    text_lower = text.lower()
    min_trl = 3
    max_trl = 7

    if any(k in text_lower for k in ["basic research", "feasibility", "proof of concept", "early stage", "phase i"]):
        min_trl = 2
        max_trl = 5
    elif any(k in text_lower for k in ["prototype", "bench-scale", "pilot demonstration", "phase ii"]):
        min_trl = 4
        max_trl = 7
    elif any(k in text_lower for k in ["commercialization", "scale-up", "market entry", "deployment"]):
        min_trl = 6
        max_trl = 9

    return min_trl, max_trl

def infer_sectors(text: str) -> list[str]:
    """Classifies text into standard sector codes."""
    text_lower = text.lower()
    sectors = set()
    for keyword, sector_code in SECTOR_TAXONOMY.items():
        if keyword in text_lower:
            sectors.add(sector_code)
    
    if not sectors:
        sectors.add("software")
    return sorted(list(sectors))

def normalize_raw_grant(raw: dict) -> dict:
    """Transforms raw announcement dictionary into GovGrant Radar schema."""
    title = raw.get("title", "").strip()
    description = raw.get("description", "").strip()
    full_text = f"{title} {description}"

    min_trl, max_trl = infer_trl(full_text)
    sectors = infer_sectors(full_text)

    return {
        "id": raw.get("id"),
        "externalId": raw.get("opportunity_number", "GOV-GENERIC-2026"),
        "title": title,
        "agency": {
            "name": raw.get("agency_name", "Government Agency"),
            "country": raw.get("country_code", "USA"),
            "flag": raw.get("country_flag", "🌐"),
            "level": raw.get("jurisdiction", "Federal")
        },
        "summary": description[:280] + "..." if len(description) > 280 else description,
        "awardCeilingUsd": raw.get("max_award_usd", 250000),
        "awardFloorUsd": raw.get("min_award_usd", 50000),
        "totalPoolUsd": raw.get("total_pool_usd", 10000000),
        "costSharingRequired": raw.get("cost_sharing", False),
        "costSharingPercent": raw.get("cost_sharing_pct", 0),
        "minTrl": min_trl,
        "maxTrl": max_trl,
        "eligibleCountries": raw.get("eligible_countries", ["USA"]),
        "eligibleEntityTypes": raw.get("entity_types", ["startup", "for_profit"]),
        "sectors": sectors,
        "postedDate": raw.get("posted_date", datetime.now().strftime("%Y-%m-%d")),
        "closeDate": raw.get("close_date", "2026-12-31"),
        "status": "active",
        "officialUrl": raw.get("url", "https://grants.gov"),
        "isFeatured": raw.get("is_featured", False),
        "disbursementType": raw.get("disbursement_type", "100% Non-Dilutive Grant")
    }

def main():
    print("=" * 60)
    print("GovGrant Radar: Multi-Source Public Grant Ingestion Pipeline")
    print("=" * 60)
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(os.path.dirname(script_dir), "data")
    seed_file = os.path.join(data_dir, "grants_seed.json")

    if os.path.exists(seed_file):
        with open(seed_file, "r", encoding="utf-8") as f:
            grants = json.load(f)
        print(f"[SUCCESS] Loaded {len(grants)} normalized grants from {seed_file}")
        
        # Display summary statistics
        total_funding = sum(g.get("awardCeilingUsd", 0) for g in grants)
        countries = set(g["agency"]["country"] for g in grants)
        print(f"[STATS] Total grant funding represented: ${total_funding:,.2f} USD")
        print(f"[STATS] Jurisdictions covered: {', '.join(sorted(countries))}")
    else:
        print(f"[WARNING] Seed file not found at {seed_file}")

if __name__ == "__main__":
    main()
