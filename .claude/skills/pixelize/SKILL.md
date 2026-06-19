---
name: pixelize
description: Use Codex's built-in image interface to convert a raw source photo into the square pixel-art PNG used by the snapshots upload flow.
allowed-tools: Read, Bash
---

Turn a raw source photo into a square pixel-art source image before running `/upload`.

Rules:

- Do not use the OpenAI API, API keys, CLI image scripts, or network API runners.
- Use Codex's built-in image generation/editing interface.
- Treat `original-original-images/` as the raw intake folder.
- Ignore `original-original-images/` for git, numbering, upload, and publishing.
- Preserve the raw photo. Only generated pixel-art PNGs belong in `original-images/`.

Workflow:

1. Find the newest image in `original-original-images/`, unless the user names a specific file.
2. Inspect it visually.
3. Use the prompt in `prompts/pixel-art-snapshot.md` with Codex's built-in image edit flow.
4. Save the accepted generated PNG to `original-images/<N>-<slug>.png`.
5. Pick `N` from the next published snapshot number, considering `images/`, `images.json`, and `original-images/`; do not consider `original-original-images/`.
6. Show the generated PNG to the user for review.
7. If accepted, run `/upload` or publish manually.

Filename guidance:

- Use the next number unless the user gives one.
- Use a short lowercase slug from the visible subject, such as `star-wash` or `blue-oak`.
- The final file should look like `original-images/102-star-wash.png`.
