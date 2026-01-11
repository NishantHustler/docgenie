---
title: DocGenie
section: Getting Started
order: 0
description: A static documentation generator that produces pure HTML/CSS/JS
---

# DocGenie

DocGenie is a static documentation generator that transforms Markdown files into a beautiful documentation website.

## Features

- **Pure Static Output** — No JavaScript frameworks, just clean HTML/CSS/JS
- **Dark Mode** — Beautiful dark theme by default (configurable)
- **Sidebar Navigation** — Auto-generated from frontmatter
- **Table of Contents** — Scroll spy with h2/h3 headings
- **Client-Side Search** — Keyboard shortcut `/` with prebuilt index
- **Syntax Highlighting** — Code blocks with copy button
- **Callout Blocks** — Note and warning callouts

## Quick Start

```bash
# Install dependencies
npm install

# Initialize (creates docgenie.config.json and docs/)
npm run init

# Build documentation
npm run build

# Preview locally
npx serve dist
```

> [!NOTE]
> The output in `/dist` is pure static HTML/CSS/JS — deploy it anywhere!

## How It Works

1. Write Markdown files in `/docs`
2. Add frontmatter (`title`, `section`, `order`)
3. Run `docgenie build`
4. Deploy `/dist` to any static host
