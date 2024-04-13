require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser")
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended:true}))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
const urlDatabase = {};
let shortUrlCounter = 1; // Start counter for short URLs from 1

// Utility function to validate URLs
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// API endpoint for shortening a URL
app.post('/api/shorturl', function(req, res) {
  // Extract the submitted URL from the request body
  const submittedUrl = req.body.url;

  // Check if the submitted URL is present and is a string
  if (!submittedUrl || typeof submittedUrl !== 'string') {
      return res.json({ error: 'invalid url' });
  }

  // Validate the URL
  try {
      const urlObject = new URL(submittedUrl);

      // Additional check to verify the URL is an HTTP or HTTPS URL
      if (urlObject.protocol !== 'http:' && urlObject.protocol !== 'https:') {
          return res.json({ error: 'invalid url' });
      }
  } catch (e) {
      // If the URL is invalid, return an error
      return res.json({ error: 'invalid url' });
  }

  // The rest of the existing code
  let shortUrl = Object.keys(urlDatabase).find(key => urlDatabase[key] === submittedUrl);

  if (!shortUrl) {
      shortUrl = shortUrlCounter++;
      urlDatabase[shortUrl] = submittedUrl;
  }

  res.json({
      original_url: submittedUrl,
      short_url: shortUrl
  });
});


// API endpoint for redirecting to the original URL
app.get('/api/shorturl/:code', (req, res) => {
  const code = parseInt(req.params.code, 10);

  // Check if the code is valid
  if (isNaN(code)) {
    res.json({ error: 'invalid short URL code' });
    return;
  }

  // Find the original URL corresponding to the given short URL code
  const originalUrl = urlDatabase[code];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
