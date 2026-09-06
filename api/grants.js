const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const dataPath = path.join(process.cwd(), 'data', 'grants_seed.json');
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8');
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).send(data);
    } else {
      return res.status(500).json({ error: 'Seed data file not found' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
