// Initialize the map - centered on Europe/Copenhagen area
const map = L.map('map').setView([55.6761, 12.5683], 4);

// Add dark tile layer (CartoDB Dark Matter)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 20
}).addTo(map);

// Create marker cluster group
const markers = L.markerClusterGroup({
  showCoverageOnHover: false,
  maxClusterRadius: 50,
  spiderfyOnMaxZoom: true,
  iconCreateFunction: function(cluster) {
    const count = cluster.getChildCount();
    return L.divIcon({
      html: `<div>${count}</div>`,
      className: 'marker-cluster marker-cluster-small',
      iconSize: L.point(40, 40)
    });
  }
});

// Zoom level threshold for showing images
const IMAGE_ZOOM_THRESHOLD = 10;

// Store all image markers for viewport checking
let allImageMarkers = [];

// Function to check if marker is in viewport
function isMarkerInViewport(marker) {
  const bounds = map.getBounds();
  const latLng = marker.getLatLng();
  return bounds.contains(latLng);
}

// Function to update visible images based on zoom and viewport
function updateVisibleImages() {
  const currentZoom = map.getZoom();
  const shouldShowImages = currentZoom >= IMAGE_ZOOM_THRESHOLD;

  allImageMarkers.forEach(markerData => {
    const { marker, imageOverlay } = markerData;

    if (shouldShowImages && isMarkerInViewport(marker)) {
      // Show image if zoomed in enough and in viewport
      if (!map.hasLayer(imageOverlay)) {
        map.addLayer(imageOverlay);
      }
    } else {
      // Hide image
      if (map.hasLayer(imageOverlay)) {
        map.removeLayer(imageOverlay);
      }
    }
  });
}

// Load images and create markers
fetch('images.json')
  .then(response => response.json())
  .then(images => {
    images.forEach(image => {
      // Skip images without coordinates
      if (!image.lat || !image.lng) {
        console.log(`Skipping ${image.file} - no coordinates`);
        return;
      }

      // Create custom icon (simple dot)
      const icon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background-color: #e0e0e0; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #333;"></div>',
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      // Create marker
      const marker = L.marker([image.lat, image.lng], { icon });

      // Create image overlay (icon marker that shows the actual image)
      const imageIcon = L.divIcon({
        className: 'image-overlay-marker',
        html: `
          <div style="position: relative;">
            <img src="images/${image.file}" alt="${image.title}"
                 style="width: 100px; height: 100px; object-fit: cover; border: 2px solid white; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);" />
            <div style="background: rgba(0,0,0,0.7); color: white; padding: 4px 8px; font-size: 12px; text-align: center; border-radius: 0 0 4px 4px; margin-top: -2px;">
              ${image.title}
            </div>
          </div>
        `,
        iconSize: [104, 130],
        iconAnchor: [52, 130]
      });

      const imageOverlay = L.marker([image.lat, image.lng], {
        icon: imageIcon,
        interactive: false
      });

      // Store marker and its image overlay
      allImageMarkers.push({ marker, imageOverlay, image });

      // Add dot marker to cluster group
      markers.addLayer(marker);
    });

    // Add all markers to map
    map.addLayer(markers);

    // Fit map bounds to show all markers
    if (markers.getBounds().isValid()) {
      map.fitBounds(markers.getBounds(), { padding: [50, 50] });
    }

    // Initial update
    updateVisibleImages();

    // Update on zoom
    map.on('zoomend', updateVisibleImages);

    // Update on pan/move
    map.on('moveend', updateVisibleImages);
  })
  .catch(error => {
    console.error('Error loading images:', error);
  });
