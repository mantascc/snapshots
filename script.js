// Initialize Typed.js
const typed = new Typed('#typed-text', {
  strings: ['Simulation snapshots'],
  typeSpeed: 50,
  showCursor: true,
  cursorChar: '|',
  autoInsertCss: true,
});

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

      // Tooltip logic for location
      div.addEventListener('mousemove', (e) => {
        let tooltip = document.getElementById('location-tooltip');
        if (!tooltip) {
          tooltip = document.createElement('div');
          tooltip.id = 'location-tooltip';
          tooltip.className = 'filename-tooltip';
          document.body.appendChild(tooltip);
        }
        tooltip.textContent = image.location || '';
        tooltip.style.display = 'block';
        tooltip.style.left = (e.clientX + 12) + 'px';
        tooltip.style.top = (e.clientY + 12) + 'px';
        tooltip.style.opacity = 1;
      });
      div.addEventListener('mouseleave', () => {
        const tooltip = document.getElementById('location-tooltip');
        if (tooltip) {
          tooltip.style.display = 'none';
          tooltip.style.opacity = 0;
        }
      });
    });
  });

// Tooltip for image file name on hover
document.querySelectorAll('.tile').forEach(tile => {
  const img = tile.querySelector('img');
  const fileName = img ? img.getAttribute('src').split('/').pop() : '';
  tile.addEventListener('mousemove', (e) => {
    const tooltip = document.getElementById('filename-tooltip');
    tooltip.textContent = fileName;
    tooltip.style.display = 'block';
    tooltip.style.left = (e.clientX + 12) + 'px';
    tooltip.style.top = (e.clientY + 12) + 'px';
    tooltip.style.opacity = 1;
  });
  tile.addEventListener('mouseleave', () => {
    const tooltip = document.getElementById('filename-tooltip');
    tooltip.style.display = 'none';
    tooltip.style.opacity = 0;
  });
}); 