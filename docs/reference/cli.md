---
title: CLI Reference
section: Reference
order: 1
description: Command-line interface reference
---

## Commands

### build

Build the documentation site:

```bash
docgenie build
```

Or via npm:

```bash
npm run build
```

This will:

1. Scan `docsDir` for `.md` files
2. Parse frontmatter and Markdown
3. Generate HTML pages
4. Build navigation from sections
5. Create search index
6. Copy static assets
7. Output to `outDir`

### init

Initialize a new project:

```bash
docgenie init
```

This creates:
- `docgenie.config.json` (defaults)
- `docs/` directory
- `docs/index.md` template

## Output Structure

```
dist/
├── index.html
├── getting-started/
│   ├── configuration.html
│   └── writing-content.html
├── css/
│   └── style.css
├── js/
│   ├── theme.js
│   ├── search.js
│   ├── toc.js
│   └── code.js
└── search-index.json
```

> [!NOTE]
> Deploy the entire `dist/` folder to any static host (Netlify, Vercel, GitHub Pages, etc.)
