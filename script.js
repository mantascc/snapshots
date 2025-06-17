const imageCount = 33; // Total images you have
const grid = document.querySelector('.grid');

for (let i = imageCount; i >= 1; i--) {
  const div = document.createElement('div');
  div.className = 'tile';
  div.innerHTML = `<img src="images/${i}.webp" alt="Image ${i}" loading="lazy">`;
  grid.appendChild(div);
} 