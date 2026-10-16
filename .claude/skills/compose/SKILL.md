---
name: compose
description: Turn a supplied photograph into a Snapshots-style square pixel-art composition. Use for “make this a snapshot”, “compose this photo”, or “turn this picture into the snapshots style”; prepare a draft, never publish without approval.
---

# Compose a snapshot

Transform **one source picture** into **one Snapshots composition**. This is an image-to-image transformation, not a collage, an invented scene, or a gallery layout. The canonical visual specification is `prompts/pixel-art-snapshot.md`; read that file before making the image.

## Select the input

- If the user supplies a picture or a local file path, use **that** picture.
- Otherwise select the newest image from `original-original-images/`, the gitignored intake folder.
- Inspect the actual image before editing. Identify its framing, key forms, color temperature, visible text, people count, and anything that must be preserved.
- Never replace or alter the original photo.

## Compose in the Snapshots language

Apply the full rules from `prompts/pixel-art-snapshot.md`, with these priorities:

1. **Fidelity first.** Treat the photograph as a strict inventory: keep every visible object, its approximate shape, position, count, and relationships. Add nothing; remove nothing. Do not invent faces, people, architecture, lettering, or unseen scene areas.
2. **Composition.** Keep the source camera position and framing. Read the image as large foreground, middle-ground, and background planes and simplify them into crisp, intentional geometry. Avoid a tourist-poster look; prefer a quiet, slightly uncanny, contemporary game-world still.
3. **Pixel-art rendering.** Medium-coarse 4–6 px clusters, clean posterized contours, flat shadow shapes, no dithering, no noise, no photographic texture or nostalgia filter. Keep the light temperature and restrain saturation except for one existing visual accent.
4. **Human and type details.** People become silhouettes, with the original number of people unchanged. Preserve visible signage as accurately and legibly as the output resolution permits; do not invent letters.
5. **Square canvas.** Produce a 1:1 result. Do not crop the scene to achieve a square. For a nonsquare input, fit the **entire original frame** within a square and use plain, unobtrusive padding sampled from the existing palette; do not outpaint new objects. Where any aesthetic rule conflicts with visible-source fidelity, fidelity wins.

## Workflow

1. Read the canonical prompt and inspect the source.
2. Use the current environment's **built-in image editing/generation tool**, supplying the source image and the canonical prompt plus the composition priorities above. This must be an image edit grounded in the source, not a text-only recreation. Do **not** use external image APIs, API keys, network scripts, or a simple pixelation filter as a substitute.
3. Inspect the generated result against the source: object inventory, people count, spatial relationships, framing, text, palette, pixel size, and 1:1 dimensions. If it fails, revise the edit; do not present it as faithful.
4. Select the next available `N` by checking `images.json`, `images/`, and `original-images/`. Ignore `original-original-images/` for numbering.
5. Save the selected draft as `original-images/<N>-<short-slug>.png`. This generated-source folder is gitignored; do not put untouched photographs here.
6. Show the draft to the user for review, with any remaining fidelity concerns.

## Boundaries

- **Do not** run `/upload`, convert to WebP, update `images.json`, commit, or push unless the user explicitly approves publishing.
- If image editing is unavailable, say so. Provide the applicable instructions as a ready-to-use prompt; do not claim to have generated an image.
- `/pixelize` is the existing simpler workflow using the same canonical prompt. `/compose` is the user-facing, source-aware composition and review workflow.
