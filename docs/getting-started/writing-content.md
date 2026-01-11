---
title: Writing Content
section: Getting Started
order: 2
description: How to write documentation pages in Markdown
---

## Frontmatter

Every Markdown file needs YAML frontmatter:

```yaml
---
title: My Page Title
section: Getting Started
order: 1
description: Optional page description
---
```

### Required Fields

| Field | Description |
|-------|-------------|
| `title` | Page title shown in sidebar and header |
| `section` | Navigation group (e.g., "Getting Started") |
| `order` | Sort order within section (lower = first) |

## Markdown Support

### Headings

```markdown
## Heading 2 (appears in TOC)
### Heading 3 (appears in TOC, nested)
#### Heading 4
```

### Code Blocks

Use fenced code blocks with language:

```javascript
function hello() {
  console.log('Hello, DocGenie!');
}
```

### Inline Code

Use backticks for `inline code`.

### Lists

- Unordered list item
- Another item
  - Nested item

1. Ordered list
2. Second item

### Callouts

Note callout:

> [!NOTE]
> This is helpful information.

Warning callout:

> [!WARNING]
> This is a warning message.
