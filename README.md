# snapshots

Field notes from places I've been. Each capture has a location and a date — browse the grid or pin them on a map.

## Run it

Serve the directory with anything that speaks HTTP:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## Add a snapshot

There's a `/upload` skill in Claude Code that handles the WebP conversion, geocoding, and `images.json` update in one shot. Otherwise, by hand:

1. Drop the source into `original-images/`
2. Convert to WebP into `images/`
3. Add an entry to `images.json` with `file`, `title`, `date`, `lat`, `lng`

`geocode.js` will fill in coordinates from a location string if you don't have them.

## Layout

- `index.html` — the gallery
- `map.html` — full-screen map view
- `original-index.html` — the previous gallery design, kept around
- `images.json` — the source of truth for everything shown
