---
title: Configuration
section: Getting Started
order: 1
description: Configure DocGenie using docgenie.config.json
---

## Configuration File

Create a `docgenie.config.json` file in your project root (or run `docgenie init`):

```json
{
  "siteName": "My Docs",
  "accentColor": "#135bec",
  "darkModeDefault": true,
  "showToc": true,
  "logoPath": null,
  "docsDir": "./docs",
  "outDir": "./dist"
}
```

## Options

### siteName

The name displayed in the header.

```json
{ "siteName": "My Project" }
```

### accentColor

Primary accent color (hex).

```json
{ "accentColor": "#8b5cf6" }
```

### darkModeDefault

Start in dark mode.

```json
{ "darkModeDefault": true }
```

### showToc

Show/hide the right table of contents.

```json
{ "showToc": true }
```

### docsDir / outDir

Source and output directories.

```json
{
  "docsDir": "./docs",
  "outDir": "./dist"
}
```

> [!WARNING]
> The output directory is overwritten on each build.
