# Snapshots

A web-based image gallery with interactive geospatial visualization. Browse location-tagged images in a responsive grid or explore them on an interactive map.

## Features

### Gallery View
- Responsive image grid with adaptive columns (1-6 columns based on screen size)
- Animated typing effect title
- Hover effects with smooth scaling
- Click to open modal with full-size image and map

### Interactive Modal
- Side-by-side display of image and location map
- Square 1:1 aspect ratio layout
- Keyboard navigation (Arrow keys for prev/next, Escape to close)
- Dark-themed map with CartoDB Dark Matter tiles
- Shows image metadata (title, location, date)
- Responsive design (stacked on mobile, side-by-side on desktop)

### Map View
- Full-screen interactive map
- Marker clustering at low zoom levels
- Zoom-based image thumbnails (visible at zoom level 10+)
- Viewport-aware rendering for performance
- Click markers to view images

## Technologies

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Mapping**: Leaflet.js v1.9.4 with MarkerCluster plugin
- **Animations**: Typed.js v2.1.0
- **Styling**: Google Fonts (VT323), custom CSS
- **Map Tiles**: CartoDB Dark Matter (OpenStreetMap)
- **Image Format**: WebP for optimized delivery
- **Geocoding**: OpenStreetMap Nominatim API (Node.js utility)

## Getting Started

### Prerequisites
No build tools required. Simply serve the files with any web server.

### Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd snapshots
```

2. Serve the files using any static server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using PHP
php -S localhost:8000
```

3. Open in browser:
- Gallery view: `http://localhost:8000/index.html`

## Usage

### Viewing Images
- Browse the gallery grid on the main page
- Click any image to open the modal viewer
- Use arrow keys (←/→) to navigate between images
- Press Escape or click outside to close the modal

### Adding New Images

1. Add your image files to the `original-images/` directory
2. Convert to WebP and add to `images/` directory
3. Update `images.json` with metadata:
```json
{
  "file": "filename.webp",
  "title": "Location Name",
  "date": "YYYY-MM-DD or Year",
  "originalLocation": "City, Country",
  "lat": 0.0,
  "lng": 0.0
}
```

4. Run geocoding utility (optional):
```bash
node geocode.js
```

## File Structure

```
snapshots/
├── index.html              # Gallery page
├── script.js               # Gallery and modal logic
├── styles.css              # Gallery styles
├── geocode.js              # Geocoding utility (Node.js)
├── images/                 # WebP images
├── original-images/        # Source images
├── images.json             # Image metadata
└── README.md               # This file
```

## Development

### Geocoding Utility
The `geocode.js` script converts location names to coordinates using the OpenStreetMap Nominatim API.

```bash
node geocode.js
```

Features:
- Rate-limited to 1 request/second
- Reads from `images.json`
- Outputs to `images_geocoded.json`
- Respects OpenStreetMap usage policies

## Configuration

### Responsive Breakpoints
- Mobile: 1 column (< 600px)
- Tablet: 3 columns (600px - 899px)
- Desktop: 4 columns (900px - 1199px)
- Large screens: 6 columns (1200px+)

### Map Settings
- Default center: Copenhagen (55.6761°, 12.5683°)
- Default zoom: 6
- Thumbnail zoom threshold: 10+
- Clustering enabled below zoom level 18

## Browser Support

Modern browsers with support for:
- CSS Grid
- ES6+ JavaScript
- WebP image format
- Fetch API

## License

See repository for license information.
