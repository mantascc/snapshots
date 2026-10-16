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

2. Run `/compose` with a picture (or a local photo path) in a supported coding agent.

   The skill is available in both `.agents/skills/compose/` and
   `.claude/skills/compose/`. It creates a square, source-faithful Snapshots
   composition using `prompts/pixel-art-snapshot.md` and the environment's
   built-in image editing tool. It preserves the input photo and saves the draft
   as `original-images/<N>-<slug>.png`. The existing `/pixelize` skill is
   also available in Claude Code.

3. Review the draft PNG. Once approved, run `/upload` to publish it.
   The skill handles WebP conversion, geocoding, and the `images.json`
   update. Otherwise, by hand:

   1. Drop the source into `original-images/`
   2. Convert to WebP into `images/`
   3. Add an entry to `images.json` with `file`, `title`, `date`, `lat`, `lng`

## Layout

- `index.html` — the gallery
- `original-index.html` — the previous gallery design, kept around
- `images.json` — the source of truth for everything shown
- `original-original-images/` — ignored intake folder for untouched source photos
- `original-images/` — ignored generated pixel-art source PNGs
- `prompts/pixel-art-snapshot.md` — canonical Snapshots visual specification
- `.agents/skills/compose/SKILL.md` and `.claude/skills/compose/SKILL.md` — photo-to-snapshot composition skill
