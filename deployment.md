# CMME Viewer – Deployment Guide (Iframe Integration)

This document explains how to deploy the CMME viewer on a standard web server and embed mensural notation scores in any website using an `<iframe>`.

No server-side installation, build tools, or JavaScript framework is required on the target hosting. The viewer runs entirely client-side.

---

## 1. Overview

The CMME viewer is distributed as a set of static files:

- a JavaScript bundle (`viewer.js`)
- an HTML entry point (`index.html`)
- CSS, fonts, images, and configuration assets

Once uploaded to a web server, scores can be displayed by loading:

```
index.html?src=PATH_TO_SCORE.cmme.xml
```

This makes the viewer suitable for iframe-based embedding in any website.

---

## 2. Required files

To deploy the viewer, you need the following files and directories:

```
cmme/
  index.html
  viewer.js
  style/
    main.css
    fonts/
      cmme.ttf
      cmme-printer.ttf
      …
  data/
    imgs/
      guiicons/
      …
    config/
      …
```

Optional but recommended:
- `viewer.js.map` (for debugging)

All paths are relative to `index.html`.

---

## 3. Uploading the viewer to your server

1. Create a directory on your hosting, for example:

```
https://your-domain.tld/cmme/
```

2. Upload all viewer files so that the following URLs are valid:

- `https://your-domain.tld/cmme/index.html`
- `https://your-domain.tld/cmme/viewer.js`
- `https://your-domain.tld/cmme/style/main.css`
- `https://your-domain.tld/cmme/style/fonts/cmme.ttf`
- `https://your-domain.tld/cmme/data/…`

Any standard static hosting is sufficient (Apache, Nginx, shared hosting, S3-style hosting, etc.).

---

## 4. Uploading CMME scores

Create a directory for scores inside the same hosting space, for example:

```
cmme/
  scores/
    missa.cmme.xml
    kyrie.cmme.xml
```

This produces URLs such as:

```
https://your-domain.tld/cmme/scores/missa.cmme.xml
```

For the simplest setup, keep the scores on the **same domain** as the viewer.

---

## 5. Embedding a score with an iframe

To embed a score in a web page, insert the following HTML:

```html
<iframe
  src="https://your-domain.tld/cmme/index.html?src=scores/missa.cmme.xml"
  style="width:100%; height:800px; border:0;"
  loading="lazy">
</iframe>
```

### How it works

- `index.html` starts the viewer.
- The query parameter `src=` specifies which `.cmme.xml` file to load.
- The value of `src` is interpreted as a **path relative to the viewer directory**.

---

## 6. Layout and sizing

### Fixed height

```html
<iframe
  src="https://your-domain.tld/cmme/index.html?src=scores/missa.cmme.xml"
  style="width:100%; height:800px; border:0;">
</iframe>
```

### Responsive height using CSS

```html
<div style="width:100%; height:70vh;">
  <iframe
    src="https://your-domain.tld/cmme/index.html?src=scores/missa.cmme.xml"
    style="width:100%; height:100%; border:0;">
  </iframe>
</div>
```

---

## 7. Multiple scores on the same page

You may embed multiple scores by using multiple iframes, each with a different `src` parameter:

```html
<iframe
  src="https://your-domain.tld/cmme/index.html?src=scores/kyrie.cmme.xml"
  style="width:100%; height:700px; border:0;">
</iframe>

<iframe
  src="https://your-domain.tld/cmme/index.html?src=scores/gloria.cmme.xml"
  style="width:100%; height:700px; border:0;">
</iframe>
```

Each iframe runs independently.

---

## 8. Common issues and troubleshooting

### 8.1 Blank viewer

Check that these URLs load correctly in the browser:

- `…/cmme/index.html`
- `…/cmme/viewer.js`
- `…/cmme/scores/your-score.cmme.xml`

If any return 404, verify your upload paths.

---

### 8.2 HTTPS and mixed content

If your website uses HTTPS, the viewer and scores must also be served over HTTPS. Do not embed HTTP resources inside HTTPS pages.

---

### 8.3 Loading scores from another domain (CORS)

If `src=` points to a different domain, that server must allow cross-origin requests (CORS).

If you cannot configure CORS, host the scores on the same domain as the viewer.

---

## 9. Summary

Deployment requires only:

1. Upload the viewer files to a web-accessible directory.
2. Upload `.cmme.xml` scores to the same site.
3. Embed `index.html?src=…` in an iframe.

No server-side code, no build step, and no runtime dependencies are required on the hosting environment.

