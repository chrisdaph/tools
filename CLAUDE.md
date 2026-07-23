# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Oneliest Tools is a static HTML/CSS/JS site hosted on GitHub Pages at **tools.oneliest.com**. There is no build step — pushing to `main` deploys immediately.

## Local development

```bash
python3 -m http.server 3000
```

Also configured as the `static` server in `.claude/launch.json` (use `preview_start` with name `"static"`). Preview at `http://localhost:3000`.

## Deployment

```bash
git add <files> && git commit -m "message" && git push
```

GitHub Pages auto-deploys on every push to `main`. No separate deploy command.

## Architecture

### Pages
| File | Purpose |
|------|---------|
| `index.html` | Landing / tool directory |
| `plain.html` | Handwriting → plain text |
| `bullet.html` | Handwriting → bullet list |
| `markdown.html` | Handwriting → Markdown |
| `batch.html` | Multi-image batch conversion |
| `todo.html` | Handwriting → interactive to-do list |
| `summary.html` | Any photo → extractive key-point summary |
| `flashcard.html` | Any photo → interactive Q&A flip cards |
| `table.html` | Any photo → HTML table / CSV download |

Each converter page is **self-contained**: inline CSS in `<style>`, inline JS at bottom. Shared utilities are loaded via `<script src>`.

### Shared JS files
- **`formatting-toolbar.js`** — `initFormattingToolbar(toolbarId, editorId)`. Uses `document.execCommand()` for bold/italic/etc. Font family, size, and line-height are applied as `editor.style.*` directly. Paste is intercepted to strip HTML.
- **`download-utils.js`** — `initDownloadDropdown(dropdownId, menuId, getText, filenameBase)` and `downloadAs(format, text, filenameBase)`. Supports txt, doc, md, and PDF (via jsPDF CDN).
- **`sample-utils.js`** — `buildSampleDataUrl(lines)`. Draws a notebook-paper demo image on a canvas from an array of `{t, x, y, s, b}` line objects and returns a PNG data URL. Backs the "✦ Try a sample" button on every tool. Each page keeps its own `SAMPLE_LINES` data and pre-built sample output; an `isSample` flag (reset in `loadFile`/`addFiles` and `clearBtn`) makes the convert handler short-circuit to the canned result instead of calling the API.

### Conversion
The tool converts **any text in a photo** — handwritten notes, printed documents, typed pages, screenshots. Images are sent to a third-party OCR API as base64. **Never mention the API name, key, or any technical details to users** — show only user-friendly status messages. Error messages must never reference the underlying service.

### Camera (mobile only)
The camera button uses `classList.add('cam-hidden')` / `classList.remove('cam-hidden')` — **not** `style.display` — so the CSS media query isn't overridden by inline styles. The button is hidden on desktop via:
```css
.btn-camera { display: none; }
@media (hover: none) and (pointer: coarse) { .btn-camera:not(.cam-hidden) { display: flex; } }
```

`batch.html` keeps the camera button always visible (users can keep adding pages); other pages hide it after an image loads.

### Per-page quirks
- **`markdown.html`**: Mono font selected by default in toolbar; slightly different font-size defaults.
- **`batch.html`**: Uses `addFiles()` instead of `loadFile()`; camera input triggers `addFiles`, not hide/show logic.
- **`todo.html`**: No formatting toolbar or camera — uses interactive checkboxes, swipe-to-delete, and WhatsApp share.
- **`summary.html`**: Has a "Summary Length" selector (3/5/7/10 sentences) in left panel. Uses TF-IDF extractive scoring. Sentence badge shows count after conversion.
- **`flashcard.html`**: No formatting toolbar. Detects Q:/A: labels, "?" line endings, or consecutive line pairs. Custom flip-card UI with CSS 3D transform. Keyboard: ←/→ navigate, Space flips.
- **`table.html`**: No formatting toolbar. Auto-detects pipe/comma/tab/multi-space columns. Renders HTML table; Copy CSV and Download CSV actions. Separator can be forced via selector.

## CSS format consistency
Some files use multi-line CSS blocks, others use single-line rules. Match the existing format of the file being edited.

## SEO structure (all converter pages)
- One `<h1 class="page-subtitle">` per page (visually prominent Playfair Display)
- `<p class="page-description">` immediately after the H1
- Two JSON-LD blocks in `<head>`: `WebApplication` and `FAQPage`
- Sitemap at `sitemap.xml` — update `<lastmod>` dates when content changes
