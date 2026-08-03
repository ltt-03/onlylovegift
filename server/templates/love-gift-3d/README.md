# Recovered LoveGift site

This folder contains the public files recovered from:

https://lovegiftspecial.netlify.app/?isPreview=true

Run locally:

```bash
python3 -m http.server 8136
```

Then open:

```text
http://127.0.0.1:8136/
```

Notes:

- This is the recoverable deployed/static source: HTML, public JS, images, and audio that the browser can access.
- The original pre-deploy project files, build config, private API code, and any unpublished source cannot be reconstructed from Netlify's public output unless you still have the original repository or Netlify build artifact.
- Most key media assets were localized into this folder, including the icon, images, envelope, pop sound, and background music.
- The page still references Google Fonts, Font Awesome CDN, and pako CDN in `index.html` for browser behavior closest to the deployed version.
