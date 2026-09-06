# GovGrant Radar | Global Non-Dilutive Capital Search & Matching Engine

**GovGrant Radar** is a vertical data intelligence platform that solves the severe global problem of government grant fragmentation. It indexes, normalizes, and deterministically matches early-stage startups and R&D labs to non-dilutive government grants across the US, UK, EU, Singapore, and Thailand without giving up company equity.

---

## Quickstart

### 1. Launch the Live Application (Zero Dependencies Required)
Run the built-in HTTP server using Node.js:

```bash
node server.js
```

Or using standard npm:
```bash
npm start
```

Open your browser and navigate to:
👉 **`http://localhost:3000`**

### 2. Run the Data Normalization Pipeline
Fetch and verify the normalized grant opportunities:

```bash
python3 scripts/ingest_grants.py
```

---

## Project Structure

```
├── data/
│   └── grants_seed.json              # Normalized database of active high-value global tech grants
├── public/
│   ├── index.html                    # Interactive Production-Ready Web App (TRL Matcher, Directory, Modal)
│   └── app.js                        # Deterministic matching algorithm, live filters & modal controller
├── src/
│   ├── types/
│   │   └── grant.ts                  # TypeScript data contracts & schema
│   └── lib/
│       └── matching_engine.ts        # Pure TypeScript deterministic matching engine
├── scripts/
│   └── ingest_grants.py              # Automated data ingestion & TRL classification pipeline
├── distribution/
│   └── FOUNDER_VIDEO_SCRIPTS.md      # Battle-tested video scripts (TikTok/Reels/Shorts) & outreach templates
├── server.js                         # Production-grade zero-dependency Node.js HTTP server
├── package.json                      # Scripts & metadata
└── README.md                         # Documentation
```

---

## Core Value Proposition

1. **Free 60-Second TRL Matcher:** Founders answer 4 quick questions (Location, Sector, TRL Stage, Target Funding) to see their compatibility score (0–100%) and instant grant recommendations.
2. **Faceted Grant Directory:** Filter active funding calls by Country, Technology Sector, TRL stage, and Deadline.
3. **The \$49 Concierge Audit:** A high-converting one-time entry offer generating immediate revenue while validating recurring customer demand.
4. **Founder Video Launch Kit:** 3 ready-to-shoot video scripts designed to leverage the Founder's distribution strengths on YouTube, TikTok, and LinkedIn.
