// Initialize Typed.js
const typed = new Typed('#typed-text', {
  strings: ['Simulation snapshots'],
  typeSpeed: 50,
  showCursor: true,
  cursorChar: '|',
  autoInsertCss: true,
});

// Global variable to store current map instance
let currentMapInstance = null;

// Function to create map popover
function createMapPopover(image) {
  // Check if image has coordinates
  if (!image.lat || !image.lng) {
    console.log('No coordinates available for this image');
    return;
  }

  // Create popover overlay
  let overlay = document.getElementById('map-popover-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'map-popover-overlay';
    overlay.className = 'map-popover-overlay';
    document.body.appendChild(overlay);
  }

  // Create popover card
  overlay.innerHTML = `
    <div class="map-popover-card">
      <div class="map-popover-header">
        <h3 class="map-popover-title">${image.title || image.originalLocation || 'Location'}</h3>
        <button class="map-popover-close" aria-label="Close">&times;</button>
      </div>
      <div class="map-popover-content">
        <div class="map-popover-image">
          <img src="images/${image.file}" alt="${image.title || image.originalLocation}" />
        </div>
        <div id="mini-map" class="map-popover-map"></div>
      </div>
    </div>
  `;

  // Show overlay
  overlay.classList.add('active');

  // Initialize Leaflet map
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

    // Add default OpenStreetMap tile layer with all labels and street names
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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

  // ESC key
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeMapPopover();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

// Load images.json and create tiles with location tooltip
fetch('images.json')
  .then(response => response.json())
  .then(images => {
    const grid = document.querySelector('.grid');
    grid.innerHTML = '';
    images.slice().reverse().forEach(image => {
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