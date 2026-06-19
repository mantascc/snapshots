# snapshots

Snapshots from the IRL. Each capture has a location and a date — browse the grid or pin them on a map.

## Run it

Serve the directory with anything that speaks HTTP:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## Add a snapshot

The normal flow is:

1. Drop untouched source photos into `original-original-images/`.

   This folder is local-only and gitignored. It is an intake folder, not part of
   the published snapshot set.

2. In Codex, run `/pixelize`.

   Codex uses the built-in image generation/editing interface with
   `prompts/pixel-art-snapshot.md`. No OpenAI API key or local image API script
   is used. The accepted output is saved as `original-images/<N>-<slug>.png`.

3. Review the PNG. If the result is good, publish the snapshot. There's a `/upload` skill in Claude Code that handles
   the WebP conversion, geocoding, and `images.json` update in one shot.
   Otherwise, by hand:

   1. Drop the source into `original-images/`
   2. Convert to WebP into `images/`
   3. Add an entry to `images.json` with `file`, `title`, `date`, `lat`, `lng`

## Layout

- `index.html` — the gallery
- `original-index.html` — the previous gallery design, kept around
- `images.json` — the source of truth for everything shown
- `original-original-images/` — ignored intake folder for untouched source photos
- `original-images/` — ignored generated pixel-art source PNGs
- `prompts/pixel-art-snapshot.md` — reusable pixel-art transform prompt
