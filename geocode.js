// Geocoding script to convert location names to lat/lng
const fs = require('fs');
const https = require('https');

const images = require('./images.json');

// Nominatim API (OpenStreetMap) - free geocoding service
// Rate limit: 1 request per second
function geocode(locationName) {
  return new Promise((resolve, reject) => {
    const encodedLocation = encodeURIComponent(locationName);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedLocation}&format=json&limit=1`;

    https.get(url, {
      headers: {
        'User-Agent': 'SimulationSnapshots/1.0'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const results = JSON.parse(data);
          if (results && results.length > 0) {
            resolve({
              lat: parseFloat(results[0].lat),
              lng: parseFloat(results[0].lon)
            });
          } else {
            console.log(`No results for: ${locationName}`);
            resolve(null);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function geocodeAll() {
  const results = [];

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    console.log(`Geocoding ${i + 1}/${images.length}: ${image.location}`);

    try {
      const coords = await geocode(image.location);
      results.push({
        file: image.file,
        title: image.location,
        date: image.date,
        lat: coords ? coords.lat : null,
        lng: coords ? coords.lng : null,
        originalLocation: image.location
      });

      // Rate limiting - wait 1 second between requests
      if (i < images.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1100));
      }
    } catch (e) {
      console.error(`Error geocoding ${image.location}:`, e.message);
      results.push({
        file: image.file,
        title: image.location,
        date: image.date,
        lat: null,
        lng: null,
        originalLocation: image.location
      });
    }
  }

  // Save results
  fs.writeFileSync('images_geocoded.json', JSON.stringify(results, null, 2));
  console.log('\nGeocoding complete! Results saved to images_geocoded.json');

  // Show any missing coordinates
  const missing = results.filter(r => r.lat === null);
  if (missing.length > 0) {
    console.log(`\n${missing.length} locations could not be geocoded:`);
    missing.forEach(m => console.log(`  - ${m.title}`));
  }
}

geocodeAll().catch(console.error);
