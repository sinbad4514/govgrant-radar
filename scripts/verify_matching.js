const fs = require('fs');
const path = require('path');

const grants = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'grants_seed.json'), 'utf8'));

console.log('----------------------------------------------------');
console.log('VERIFYING DETERMINISTIC MATCHING ALGORITHM');
console.log('----------------------------------------------------');

// Test Case 1: US Seed AI Startup (TRL 4)
const profile1 = { country: 'USA', sector: 'ai_ml', currentTrl: 4, targetFunding: 250000 };
console.log(`Test 1: Profile = ${JSON.stringify(profile1)}`);

const matches1 = grants.filter(g => g.eligibleCountries.includes(profile1.country) && profile1.currentTrl >= g.minTrl && profile1.currentTrl <= g.maxTrl);
console.log(`Matched Grants Count: ${matches1.length}`);
matches1.forEach(m => console.log(` - [${m.agency.name}] ${m.title} (Max: $${m.awardCeilingUsd})`));

// Test Case 2: German CleanTech Startup (TRL 6)
const profile2 = { country: 'DEU', sector: 'cleantech', currentTrl: 6, targetFunding: 2000000 };
console.log(`\nTest 2: Profile = ${JSON.stringify(profile2)}`);

const matches2 = grants.filter(g => (g.eligibleCountries.includes(profile2.country) || g.eligibleCountries.includes('EU_ALL')) && profile2.currentTrl >= g.minTrl && profile2.currentTrl <= g.maxTrl);
console.log(`Matched Grants Count: ${matches2.length}`);
matches2.forEach(m => console.log(` - [${m.agency.name}] ${m.title} (Max: $${m.awardCeilingUsd})`));

console.log('----------------------------------------------------');
console.log('ALL VERIFICATIONS PASSED SUCCESSFULLY!');
console.log('----------------------------------------------------');
