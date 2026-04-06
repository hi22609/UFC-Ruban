const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const WEBSITE_DIR = path.join(__dirname, 'website');

app.use(express.static(WEBSITE_DIR));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'ruban-railway-site',
    timestamp: new Date().toISOString(),
    charts_available: fs.existsSync(path.join(WEBSITE_DIR, 'elite-dashboard.html'))
  });
});

app.get('/api/predictions/teaser', (req, res) => {
  res.json({
    available: true,
    event_name: 'UFC White House',
    event_date: 'April 19, 2026',
    main_event: {
      fighter1: 'Ilia Topuria',
      fighter2: 'Justin Gaethje',
      lean: 'Ilia Topuria',
      confidence: 68,
      volatility: 'MEDIUM'
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(WEBSITE_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`RUBAN railway-site running on port ${PORT}`);
});
