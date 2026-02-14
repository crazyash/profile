const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));

// Load profile data
async function loadProfileData() {
  try {
    const data = await fs.readFile(path.join(__dirname, 'profile.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading profile data:', error);
    return null;
  }
}

// Routes
app.get('/', async (req, res) => {
  try {
    const profileData = await loadProfileData();
    if (!profileData) {
      return res.status(500).send('Error loading profile data');
    }
    
    res.render('index', { 
      profile: profileData,
      title: `${profileData.personalInfo.name} - ${profileData.personalInfo.title}`
    });
  } catch (error) {
    console.error('Error rendering page:', error);
    res.status(500).send('Server error');
  }
});

// API endpoint for profile data
app.get('/api/profile', async (req, res) => {
  try {
    const profileData = await loadProfileData();
    if (!profileData) {
      return res.status(500).json({ error: 'Error loading profile data' });
    }
    res.json(profileData);
  } catch (error) {
    console.error('Error serving profile data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Professional Profile Server running on http://localhost:${PORT}`);
  console.log(`Dashboard available at http://localhost:${PORT}`);
});
