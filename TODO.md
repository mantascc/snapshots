# TODO

## Map View - Completed
- [x] Geocode all 66 locations to lat/lng coordinates
- [x] Update images.json structure (location → title, add lat/lng)
- [x] Implement basic map with Leaflet
- [x] Add marker clustering with counter badges
- [x] Progressive image loading (viewport-based)
- [x] Zoom-level threshold for showing images (level 10+)
- [x] Full-screen map layout

## Map View - In Progress
- [ ] Apply custom dark styling to match retro aesthetic
- [ ] Adjust image overlay size/styling
- [ ] Fine-tune zoom threshold and image dimensions
- [ ] Test performance with more images

## Navigation & UX
- [ ] Add toggle between map view and grid view
- [ ] Decide: separate pages vs slide-in panel
- [ ] Add navigation controls/buttons
- [ ] Mobile optimization and touch controls

## Future Enhancements
- [ ] Date filtering/timeline view
- [ ] Search by location name
- [ ] Geolocation - center map on user's location
- [ ] Improve geocoding accuracy for placeholder locations
- [ ] Add animation/transitions for image loading
- [ ] Keyboard shortcuts for navigation
- [ ] Share specific locations via URL params

## Data & Content
- [ ] Add dates to images
- [ ] Verify/correct geocoded coordinates (Ørstedparken, Gerry Rodeo, etc.)
- [ ] Add more metadata (camera, tags, etc.)

## Technical Improvements
- [ ] Optimize image loading (lazy load, compression)
- [ ] Add error handling for missing images
- [ ] Service worker for offline support
- [ ] Analytics/tracking (optional)
