// GovGrant Radar - Client-Side Matching Engine & Directory Controller

let allGrants = [];
let currentCountryFilter = 'all';
let currentSectorFilter = 'all';
let currentSearchQuery = '';

// Wizard State
const wizardState = {
  country: 'USA',
  sector: 'ai_ml',
  trl: 5,
  targetFunding: 750000
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  await loadGrants();
  lucide.createIcons();
});

// Load Grants from API or fallback
async function loadGrants() {
  try {
    const response = await fetch('/api/grants');
    if (response.ok) {
      allGrants = await response.json();
    } else {
      throw new Error('API route unavailable');
    }
  } catch (err) {
    console.warn('Loading seed grants from fallback...', err);
    // Embedded fallback if API is not directly hit
    allGrants = [
      {
        id: "grant-us-nsf-sbir-p1",
        title: "NSF SBIR Phase I: DeepTech & AI Commercialization",
        agency: { name: "National Science Foundation (NSF)", country: "USA", flag: "🇺🇸", level: "Federal" },
        summary: "Non-dilutive funding for early-stage startups conducting high-risk, high-reward research with strong commercial potential in AI, robotics, and advanced software.",
        awardCeilingUsd: 275000,
        minTrl: 2,
        maxTrl: 5,
        eligibleCountries: ["USA"],
        sectors: ["ai_ml", "robotics", "deeptech", "software"],
        closeDate: "2026-11-04",
        officialUrl: "https://seedfund.nsf.gov/",
        disbursementType: "100% Non-Dilutive Grant"
      },
      {
        id: "grant-eu-eic-accelerator",
        title: "EIC Accelerator: Breakthrough DeepTech & Scale-Ups",
        agency: { name: "European Innovation Council (EIC)", country: "EU", flag: "🇪🇺", level: "European Union" },
        summary: "Flagship EU funding combining non-dilutive grant funding (up to €2.5M) with optional direct equity investment for breakthrough innovations ready to scale.",
        awardCeilingUsd: 2700000,
        minTrl: 5,
        maxTrl: 8,
        eligibleCountries: ["DEU", "FRA", "ESP", "ITA", "NLD", "SWE", "POL", "EU_ALL"],
        sectors: ["cleantech", "biotech", "ai_ml", "hardware", "deeptech", "healthtech"],
        closeDate: "2026-10-18",
        officialUrl: "https://eic.ec.europa.eu/",
        disbursementType: "Grant (€2.5M) + Equity"
      },
      {
        id: "grant-uk-innovate-smart",
        title: "Innovate UK Smart Grants: Disruptive Innovation",
        agency: { name: "Innovate UK (UKRI)", country: "GBR", flag: "🇬🇧", level: "National" },
        summary: "Funding for disruptive, commercially viable research and development projects from UK-based micro and small businesses across all tech sectors.",
        awardCeilingUsd: 625000,
        minTrl: 3,
        maxTrl: 6,
        eligibleCountries: ["GBR"],
        sectors: ["software", "ai_ml", "fintech", "cleantech"],
        closeDate: "2026-10-25",
        officialUrl: "https://www.ukri.org/councils/innovate-uk/",
        disbursementType: "Co-funded Grant (70%)"
      },
      {
        id: "grant-us-doe-clean-energy",
        title: "DOE SBIR: Clean Energy, Battery & Carbon Tech",
        agency: { name: "US Department of Energy (DOE)", country: "USA", flag: "🇺🇸", level: "Federal" },
        summary: "Federal research grants supporting commercial prototypes in battery chemistry, industrial decarbonization, and smart electrical grid software.",
        awardCeilingUsd: 1600000,
        minTrl: 3,
        maxTrl: 7,
        eligibleCountries: ["USA"],
        sectors: ["cleantech", "energy", "hardware"],
        closeDate: "2026-11-19",
        officialUrl: "https://science.osti.gov/sbir",
        disbursementType: "100% Non-Dilutive Grant"
      },
      {
        id: "grant-sg-startup-tech",
        title: "Startup SG Tech: Proof-of-Value Commercialization",
        agency: { name: "Enterprise Singapore", country: "SGP", flag: "🇸🇬", level: "National" },
        summary: "Fast-track non-dilutive grant for Singapore-incorporated deeptech startups validating breakthrough technology with enterprise pilot customers.",
        awardCeilingUsd: 375000,
        minTrl: 4,
        maxTrl: 7,
        eligibleCountries: ["SGP"],
        sectors: ["ai_ml", "biotech", "fintech", "deeptech"],
        closeDate: "2026-12-31",
        officialUrl: "https://www.startupsg.gov.sg/",
        disbursementType: "Milestone-based Grant (70%)"
      },
      {
        id: "grant-us-nih-healthtech",
        title: "NIH STTR: Digital Health & Diagnostics Innovation",
        agency: { name: "National Institutes of Health (NIH)", country: "USA", flag: "🇺🇸", level: "Federal" },
        summary: "Funding for collaborative R&D between early-stage digital health startups and university research institutions for novel therapeutic tools.",
        awardCeilingUsd: 400000,
        minTrl: 2,
        maxTrl: 6,
        eligibleCountries: ["USA"],
        sectors: ["healthtech", "biotech", "ai_ml"],
        closeDate: "2026-12-05",
        officialUrl: "https://seed.nih.gov/",
        disbursementType: "100% Non-Dilutive Grant"
      },
      {
        id: "grant-th-nia-open-innovation",
        title: "NIA Open Innovation Seed: DeepTech & Creative Fund",
        agency: { name: "National Innovation Agency (NIA Thailand)", country: "THA", flag: "🇹🇭", level: "National" },
        summary: "Non-dilutive grant supporting Thai innovative enterprises and regional startups developing market-ready tech solutions.",
        awardCeilingUsd: 45000,
        minTrl: 4,
        maxTrl: 8,
        eligibleCountries: ["THA"],
        sectors: ["ai_ml", "agritech", "healthtech", "software"],
        closeDate: "2026-11-30",
        officialUrl: "https://www.nia.or.th/",
        disbursementType: "Co-funding grant (75%)"
      }
    ];
  }
  renderDirectory(allGrants);
}

// Render Directory Cards
function renderDirectory(grants) {
  const container = document.getElementById('grants-grid');
  if (!container) return;

  if (grants.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-16 glass rounded-2xl border border-slate-800">
        <i data-lucide="inbox" class="w-10 h-10 text-slate-500 mx-auto mb-3"></i>
        <h4 class="text-base font-bold text-white">No grants matched your active filters</h4>
        <p class="text-xs text-slate-400 mt-1">Try resetting your country or sector filters above.</p>
        <button onclick="resetFilters()" class="mt-4 px-4 py-2 rounded-lg bg-emerald-500 text-dark-950 font-bold text-xs">Reset All Filters</button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = grants.map(grant => {
    const formattedAmount = Number(grant.awardCeilingUsd).toLocaleString('en-US');
    return `
      <div class="glass p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between group hover:shadow-xl hover:shadow-emerald-950/20">
        <div>
          <!-- Top Row: Agency & Flag -->
          <div class="flex items-start justify-between gap-2 mb-3">
            <div class="flex items-center gap-2">
              <span class="text-lg">${grant.agency.flag || '🌐'}</span>
              <span class="text-xs font-mono font-semibold text-slate-400 truncate max-w-[180px]">${grant.agency.name}</span>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              TRL ${grant.minTrl}–${grant.maxTrl}
            </span>
          </div>

          <!-- Title -->
          <h3 class="text-base font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug mb-2">
            ${grant.title}
          </h3>

          <!-- Summary -->
          <p class="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
            ${grant.summary}
          </p>
        </div>

        <div>
          <!-- Amount & Terms -->
          <div class="pt-4 border-t border-slate-800/80 flex items-end justify-between mb-4">
            <div>
              <div class="text-[10px] text-slate-500 uppercase font-mono">Maximum Award</div>
              <div class="text-lg font-black text-emerald-400 font-mono">$${formattedAmount} USD</div>
            </div>
            <div class="text-right">
              <div class="text-[10px] text-slate-500 uppercase font-mono">Deadline</div>
              <div class="text-xs font-mono font-semibold text-slate-300">${grant.closeDate}</div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2">
            <a href="${grant.officialUrl}" target="_blank" rel="noopener noreferrer" class="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5">
              <span>Agency Portal</span>
              <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
            </a>
            <button onclick="checkSpecificGrant('${grant.id}')" class="px-3.5 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center gap-1">
              <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
              <span>Match</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

// Search & Filtering Logic
function handleSearch(query) {
  currentSearchQuery = query.toLowerCase().trim();
  applyFilters();
}

function filterBySector(sector) {
  currentSectorFilter = sector;
  document.querySelectorAll('.sector-chip').forEach(btn => {
    if (btn.dataset.filter === sector) {
      btn.className = 'sector-chip px-3 py-1.5 rounded-lg border border-emerald-500 bg-emerald-500/20 text-emerald-400';
    } else {
      btn.className = 'sector-chip px-3 py-1.5 rounded-lg border border-slate-800 glass text-slate-300 hover:border-slate-700';
    }
  });
  applyFilters();
}

function filterByCountry(country) {
  currentCountryFilter = currentCountryFilter === country ? 'all' : country;
  document.querySelectorAll('.country-chip').forEach(btn => {
    if (btn.dataset.countryFilter === currentCountryFilter) {
      btn.className = 'country-chip px-3 py-1.5 rounded-lg border border-emerald-500 bg-emerald-500/20 text-emerald-400';
    } else {
      btn.className = 'country-chip px-3 py-1.5 rounded-lg border border-slate-800 glass text-slate-300 hover:border-slate-700';
    }
  });
  applyFilters();
}

function applyFilters() {
  let filtered = allGrants.filter(g => {
    // Search query match
    if (currentSearchQuery) {
      const haystack = `${g.title} ${g.summary} ${g.agency.name} ${g.sectors.join(' ')}`.toLowerCase();
      if (!haystack.includes(currentSearchQuery)) return false;
    }
    // Sector filter
    if (currentSectorFilter !== 'all') {
      if (!g.sectors.includes(currentSectorFilter)) return false;
    }
    // Country filter
    if (currentCountryFilter !== 'all') {
      if (!g.eligibleCountries.includes(currentCountryFilter) && !g.eligibleCountries.includes('EU_ALL')) {
        return false;
      }
    }
    return true;
  });
  renderDirectory(filtered);
}

function resetFilters() {
  currentSearchQuery = '';
  currentSectorFilter = 'all';
  currentCountryFilter = 'all';
  document.getElementById('grant-search-input').value = '';
  filterBySector('all');
  filterByCountry('all');
}

// Wizard Interactive Controls
function nextStep(stepNumber) {
  document.querySelectorAll('.wizard-step').forEach(step => step.classList.add('hidden'));
  const targetStep = document.getElementById(`wizard-step-${stepNumber}`);
  if (targetStep) targetStep.classList.remove('hidden');

  const progressBar = document.getElementById('progress-bar');
  const stepLabel = document.getElementById('step-label');
  const stepPercentage = document.getElementById('step-percentage');

  const titles = [
    'Step 1 of 4: Operating Location',
    'Step 2 of 4: Technological Sector',
    'Step 3 of 4: Technology Readiness Level (TRL)',
    'Step 4 of 4: Capital Requirement'
  ];

  progressBar.style.width = `${stepNumber * 25}%`;
  stepLabel.innerText = titles[stepNumber - 1];
  stepPercentage.innerText = `${stepNumber * 25}% Complete`;
  lucide.createIcons();
}

function selectCountry(country) {
  wizardState.country = country;
  document.querySelectorAll('.country-btn').forEach(b => {
    if (b.dataset.country === country) {
      b.className = 'country-btn p-4 rounded-xl border border-emerald-500 bg-emerald-950/30 text-left transition-all';
    } else {
      b.className = 'country-btn p-4 rounded-xl border border-slate-700 hover:border-emerald-500 text-left transition-all bg-slate-900/60';
    }
  });
}

function selectSector(sector) {
  wizardState.sector = sector;
  document.querySelectorAll('.sector-btn').forEach(b => {
    if (b.dataset.sector === sector) {
      b.className = 'sector-btn p-4 rounded-xl border border-emerald-500 bg-emerald-950/30 text-left transition-all';
    } else {
      b.className = 'sector-btn p-4 rounded-xl border border-slate-700 hover:border-emerald-500 text-left transition-all bg-slate-900/60';
    }
  });
}

function selectTrl(trl) {
  wizardState.trl = trl;
  document.querySelectorAll('.trl-btn').forEach(b => {
    if (Number(b.dataset.trl) === trl) {
      b.className = 'trl-btn w-full p-4 rounded-xl border border-emerald-500 bg-emerald-950/30 text-left transition-all flex items-start justify-between';
    } else {
      b.className = 'trl-btn w-full p-4 rounded-xl border border-slate-700 hover:border-emerald-500 text-left transition-all bg-slate-900/60 flex items-start justify-between';
    }
  });
}

function selectFunding(amount) {
  wizardState.targetFunding = amount;
  document.querySelectorAll('.funding-btn').forEach(b => {
    if (Number(b.dataset.funding) === amount) {
      b.className = 'funding-btn p-4 rounded-xl border border-emerald-500 bg-emerald-950/30 text-left transition-all';
    } else {
      b.className = 'funding-btn p-4 rounded-xl border border-slate-700 hover:border-emerald-500 text-left transition-all bg-slate-900/60';
    }
  });
}

// Deterministic Compatibility Algorithm
function runMatching() {
  document.querySelectorAll('.wizard-step').forEach(s => s.classList.add('hidden'));
  const resultsContainer = document.getElementById('wizard-results');
  resultsContainer.classList.remove('hidden');

  const matchedGrantsContainer = document.getElementById('matched-grants-container');

  // Compute scores for each grant
  const scored = allGrants.map(grant => {
    let score = 0;
    let reasons = [];

    // 1. Geography (30 pts)
    const geoMatch = grant.eligibleCountries.includes(wizardState.country) || grant.eligibleCountries.includes('EU_ALL');
    if (geoMatch) {
      score += 30;
      reasons.push(`${grant.agency.country} Territorial Match`);
    } else {
      score += 5; // consortium / international fallback
    }

    // 2. TRL Alignment (35 pts)
    if (wizardState.trl >= grant.minTrl && wizardState.trl <= grant.maxTrl) {
      score += 35;
      reasons.push(`TRL ${wizardState.trl} Exact Stage Window`);
    } else if (Math.abs(wizardState.trl - grant.minTrl) <= 1 || Math.abs(wizardState.trl - grant.maxTrl) <= 1) {
      score += 20;
      reasons.push(`TRL Close Proximity`);
    } else {
      score += 5;
    }

    // 3. Sector (25 pts)
    if (grant.sectors.includes(wizardState.sector)) {
      score += 25;
      reasons.push(`${wizardState.sector.toUpperCase()} High-Priority Call`);
    } else {
      score += 10;
    }

    // 4. Funding fit (10 pts)
    if (grant.awardCeilingUsd >= wizardState.targetFunding * 0.5) {
      score += 10;
      reasons.push('Funding Pool Cap Qualified');
    }

    return {
      grant,
      score: Math.min(score, 98),
      reasons
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Render top 3 matches
  const topMatches = scored.slice(0, 3);
  matchedGrantsContainer.innerHTML = topMatches.map(item => `
    <div class="glass p-5 rounded-xl border border-emerald-500/40 hover:border-emerald-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-start gap-3">
        <div class="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono font-black text-sm flex items-center justify-center shrink-0">
          ${item.score}%
        </div>
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-mono text-slate-400">${item.grant.agency.name}</span>
            <span class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">${item.grant.disbursementType}</span>
          </div>
          <h4 class="text-sm font-bold text-white">${item.grant.title}</h4>
          <div class="flex flex-wrap gap-1.5 mt-2">
            ${item.reasons.map(r => `<span class="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">✓ ${r}</span>`).join('')}
          </div>
        </div>
      </div>

      <div class="flex sm:flex-col items-end justify-between shrink-0">
        <div class="text-right">
          <div class="text-[10px] text-slate-500 uppercase font-mono">Max Grant</div>
          <div class="text-base font-black text-emerald-400 font-mono">$${Number(item.grant.awardCeilingUsd).toLocaleString()} USD</div>
        </div>
        <a href="${item.grant.officialUrl}" target="_blank" class="mt-2 text-xs font-bold text-slate-200 hover:text-emerald-400 flex items-center gap-1">
          View Call &rarr;
        </a>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

function resetWizard() {
  document.getElementById('wizard-results').classList.add('hidden');
  nextStep(1);
}

function checkSpecificGrant(id) {
  scrollToMatcher();
}

function scrollToMatcher() {
  const el = document.getElementById('matcher');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// PayPal Payment Link Configuration
const PAYPAL_PAYMENT_LINK = 'https://paypal.me/NANTANUTNIMMANARANON/49USD';

// Modal Checkout Controls
function openCheckoutModal(tier = 'audit') {
  document.getElementById('checkout-modal').classList.remove('hidden');
}

function closeCheckoutModal() {
  document.getElementById('checkout-modal').classList.add('hidden');
}

function handleCheckout(e) {
  e.preventDefault();
  
  // Show redirecting status on button
  const submitBtn = document.getElementById('checkout-submit-btn');
  if (submitBtn) {
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-dark-950 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      Redirecting to PayPal ($49)...
    `;
  }
  
  // Redirect to user's PayPal.Me link
  setTimeout(() => {
    window.location.href = PAYPAL_PAYMENT_LINK;
  }, 400);
}



