---
name: upload
description: Add a new snapshot image to the project. Converts PNG to WebP, geocodes it, updates images.json, commits and pushes.
allowed-tools: Read, Glob, Bash, Edit
---

A new image has been placed in `original-images/`. Follow these steps:

1. Find the highest-numbered PNG in `original-images/` — that's the new image. The number is `N`.
2. Read the image visually to see what's in it.
3. Try to extract GPS coordinates from EXIF metadata:
   ```
   python3 -c "
   from PIL import Image
   from PIL.ExifTags import TAGS, GPSTAGS
   img = Image.open('original-images/<N>.png')
   exif = img._getexif()
   if exif:
       for tag_id, value in exif.items():
           print(TAGS.get(tag_id, tag_id), value)
   else:
       print('No EXIF')
   "
   ```
4. If no GPS coordinates found, ask the user for the location. They can share a Google Maps link (`?q=loc:LAT,LNG`) or describe it.
5. Convert to WebP:
   ```
   cwebp "original-images/<N>.png" -o "images/<N>.webp" -q 85
   ```
6. Add entry to the end of `images.json`:
   - `file`: `"<N>.webp"`
   - `title`: short descriptive name from what's visible (business, landmark, street)
   - `date`: current year as a string
   - `lat` / `lng`: coordinates as numbers
   - `originalLocation`: place name or address
7. Stage and commit:
   ```
   git add images/<N>.webp images.json
   git commit -m "Add image <N> (<title>, <location>)"
   ```
8. Push.
