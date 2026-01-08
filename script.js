// Initialize Typed.js
const typed = new Typed('#typed-text', {
  strings: ['Simulation snapshots'],
  typeSpeed: 50,
  showCursor: true,
  cursorChar: '|',
  autoInsertCss: true,
});

// Global variable to store current map instance and images
let currentMapInstance = null;
let globalImages = [];

// Function to create map popover
function createMapPopover(image) {
  // Check if image has coordinates (unless we want to allow browsing images without maps, but for now stick to logic)
  // Actually, for navigation we might want to skip images without coords or just show them without map?
  // The user requirement says "1:1 snapshot and map". If no map, maybe show empty?
  // Original logic returned if no lat/lng. We should probably keep that but maybe warn?
  // Let's stick to original safety check but maybe we need to be smarter for navigation to skip them?
  // For now, let's assume we render what we can.

  // Find index for navigation
  const currentIndex = globalImages.findIndex(img => img.file === image.file);
  const prevIndex = (currentIndex - 1 + globalImages.length) % globalImages.length;
  const nextIndex = (currentIndex + 1) % globalImages.length;
  const prevImage = globalImages[prevIndex];
  const nextImage = globalImages[nextIndex];

  // Create popover overlay
  let overlay = document.getElementById('map-popover-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'map-popover-overlay';
    overlay.className = 'map-popover-overlay';
    document.body.appendChild(overlay);
  }

  // Construct Title with Date
  let titleText = image.title || image.originalLocation || 'Location';
  if (image.date) {
    titleText += ` <span style="opacity: 0.6; font-size: 0.8em; margin-left: 10px;">(${image.date})</span>`;
  }

  // Create popover card with navigation
  overlay.innerHTML = `
    <div class="map-popover-card">
      <div class="map-popover-header">
        <h3 class="map-popover-title">${titleText}</h3>
        <button class="map-popover-close" aria-label="Close">&times;</button>
      </div>
      <div class="popover-body-wrapper">
        <div class="map-popover-content">
          <div class="map-popover-image">
            <img src="images/${image.file}" alt="${image.title || image.originalLocation}" />
          </div>
          <div id="mini-map" class="map-popover-map"></div>
        </div>
      </div>
    </div>
  `;

  // Show overlay
  overlay.classList.add('active');


  // Remove any old key listeners to prevent stacking (simple approach: we add fresh every time, 
  // but we need to rely on close cleaning up or simple replacements).
  // Ideally we manage this better, but for MVP:
  document.onkeydown = function (e) {
    if (e.key === 'Escape') closeMapPopover();
    if (e.key === 'ArrowLeft') createMapPopover(prevImage);
    if (e.key === 'ArrowRight') createMapPopover(nextImage);
  };


  // Initialize Leaflet map
  if (image.lat && image.lng) {
    setTimeout(() => {
      // Destroy previous map instance if exists
      if (currentMapInstance) {
        currentMapInstance.remove();
        currentMapInstance = null;
      }

      // Create new map
      currentMapInstance = L.map('mini-map', {
        center: [image.lat, image.lng],
        zoom: 13,
        zoomControl: true,
        dragging: true,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false
      });

      // Add CartoDB Dark Matter tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19
      }).addTo(currentMapInstance);

      // Add marker
      const icon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background-color: #ff6b6b; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      L.marker([image.lat, image.lng], { icon }).addTo(currentMapInstance);
    }, 100);
  } else {
    // Handle missing coords visual
    setTimeout(() => {
      const mapDiv = document.getElementById('mini-map');
      if (mapDiv) {
        mapDiv.style.background = '#111';
        mapDiv.innerHTML = '<div style="color: #666; display: flex; align-items: center; justify-content: center; height: 100%;">No Location Data</div>';
      }
    }, 100);
  }

  // Setup close handlers
  setupCloseHandlers(overlay);
}

// Function to close map popover
function closeMapPopover() {
  const overlay = document.getElementById('map-popover-overlay');
  if (overlay) {
    overlay.classList.remove('active');

    // Destroy map instance
    if (currentMapInstance) {
      currentMapInstance.remove();
      currentMapInstance = null;
    }

    // Clear Global Key Handler
    document.onkeydown = null;
  }
}

// Function to setup close handlers
function setupCloseHandlers(overlay) {
  // Close button click
  const closeBtn = overlay.querySelector('.map-popover-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMapPopover);
  }

  // Click outside card
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeMapPopover();
    }
  });
}

// Load images.json and create tiles with location tooltip
fetch('images.json')
  .then(response => response.json())
  .then(images => {
    globalImages = images.slice().reverse(); // Store globally
    const grid = document.querySelector('.grid');
    grid.innerHTML = '';
    globalImages.forEach(image => {
      const div = document.createElement('div');
      div.className = 'tile';
      div.innerHTML = `<img src="images/${image.file}" alt="${image.file}" loading="lazy">`;
      grid.appendChild(div);

      // Click handler for map popover
      div.addEventListener('click', (e) => {
        console.log('Tile clicked:', image.title, image.lat, image.lng);
        createMapPopover(image);
      });
    });
  });