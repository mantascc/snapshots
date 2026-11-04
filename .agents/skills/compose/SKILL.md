---
name: compose
description: Turn a supplied photograph into a Snapshots-style square pixel-art composition. Use for “make this a snapshot”, “compose this photo”, or “turn this picture into the snapshots style”; prepare two options by default, never publish without approval.
---

# Compose a snapshot

Transform **one source picture** into **two separate Snapshots image options by default**, unless the user requests a different count. Both options must follow the same source-fidelity and style requirements; vary only rendering choices within those constraints. This is an image-to-image transformation, not a collage, an invented scene, or a gallery layout. The canonical visual specification is `prompts/pixel-art-snapshot.md`; read that file before making the image.

## Select the input

- If the user supplies a picture or a local file path, use **that** picture.
- Otherwise select the newest image from `original-original-images/`, the gitignored intake folder.
- Inspect the actual image before editing. Identify its framing, key forms, color temperature, visible text, people count, and anything that must be preserved.
- Never replace or alter the original photo.

## Inspect the last five published snapshots

- Before every generation, read the current `images.json` and take its last five entries (`slice(-5)`, newest first for inspection). Use publication order, not the photo date or filesystem modification time. If fewer than five are published, inspect all available entries.
- Open and visually inspect each referenced `images/<file>` image; reading filenames or metadata is not enough. Use the current repository or fetch the published images when they are not available locally. If a reference cannot be viewed, report which one and resolve access before generating rather than silently skipping it.
- Use these five images as style references for pixel density, edge treatment, palette restraint, shading, and level of simplification. Carry the observed style cues into the image-edit prompt, and supply the reference images to the tool when supported, clearly distinguishing them from the source photo.
- Preserve the source photo's objects within the square crop, camera perspective, people count, and light temperature. Do not borrow scene content or composition from the references; source fidelity and the canonical prompt remain authoritative.

## Compose in the Snapshots language

Apply the full rules from `prompts/pixel-art-snapshot.md`, with these priorities:

1. **Fidelity first.** Treat the photograph as a strict inventory: within the selected square crop, keep every visible object, its approximate shape, position, count, and relationships. Add nothing; do not remove objects within that crop. Do not invent faces, people, architecture, lettering, or unseen scene areas.
2. **Composition.** Keep the source camera position and perspective. For nonsquare photos, choose a square crop that preserves the main subject, important signage, and people, trimming peripheral sky or ground where possible. Read the image as large foreground, middle-ground, and background planes and simplify them into crisp, intentional geometry. Avoid a tourist-poster look; prefer a quiet, slightly uncanny, contemporary game-world still.
3. **Pixel-art rendering.** Medium-coarse 4–6 px clusters, clean posterized contours, flat shadow shapes, no dithering, no noise, no photographic texture or nostalgia filter. Keep the light temperature and restrain saturation except for one existing visual accent.
4. **Human and type details.** People become silhouettes, with the original number of people unchanged. Preserve visible signage as accurately and legibly as the output resolution permits; do not invent letters.
5. **Square, edge-to-edge image.** Output must have equal pixel width and height (1:1), with the scene filling the entire square to all four edges. No borders of any kind: no side bars, letterboxing, pillarboxing, padding, mattes, frames, or transparent margins. For nonsquare inputs, crop to square while preserving the main subject; never stretch the image or invent unseen scenery to fill space. The square crop is the explicit exception to preserving the entire original frame.

## Workflow

1. Read the canonical prompt, inspect the source, and visually inspect the last five published snapshots as described above.
2. Generate two distinct image options as separate outputs, not a combined comparison sheet or duplicate copies. If the tool produces one image per call, make two calls, each grounded in the original source photo and the same five style references. Use the current environment's **built-in image editing/generation tool**, supplying the source image and the canonical prompt plus the composition priorities and observed reference-style cues above. This must be an image edit grounded in the source, not a text-only recreation. Do **not** use external image APIs, API keys, network scripts, or a simple pixelation filter as a substitute.
3. Inspect each generated option against the source: object inventory, people count, spatial relationships, framing, text, palette, pixel size, and equal pixel width and height. Inspect all four edges: the scene must fill the square, with no borders, padding, or transparent margins. Reject and revise any option that fails this check before presenting it. Also compare its rendering style with the five references. If it fails, revise the edit; do not present it as faithful.
4. Keep the options in a temporary draft folder outside `original-images/` so the upload flow cannot mistake both for approved snapshots. Save each as a separate PNG and show both, labeled Option 1 and Option 2, with any remaining fidelity concerns.
5. After the user chooses an option, select the next available `N` by checking `images.json`, `images/`, and `original-images/`. Ignore `original-original-images/` and temporary options for numbering.
6. Save only the chosen option as `original-images/<N>-<short-slug>.png`. This generated-source folder is gitignored; do not put untouched photographs here. Choosing an option does not by itself approve publishing.

## Boundaries

- **Do not** run `/upload`, convert to WebP, update `images.json`, commit, or push unless the user explicitly approves publishing.
- If image editing is unavailable, say so. Provide the applicable instructions as a ready-to-use prompt; do not claim to have generated an image.
- `/pixelize` is the existing simpler workflow using the same canonical prompt. `/compose` is the user-facing, source-aware composition and review workflow.
