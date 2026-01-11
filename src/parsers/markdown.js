import { marked } from 'marked';
import hljs from 'highlight.js';

// Factory function to create a stateful renderer
function createRenderer(headings) {
  const renderer = new marked.Renderer();

  // Track headings for TOC
  renderer.heading = function (text, level, raw) {
    const slug = raw.toLowerCase().replace(/[^\w]+/g, '-').replace(/(^-|-$)/g, '');

    if (level === 2 || level === 3) {
      headings.push({ level, text: raw, slug });
    }

    const sizeClasses = {
      1: 'text-4xl lg:text-5xl font-black tracking-tight',
      2: 'text-2xl font-bold mt-12 mb-4',
      3: 'text-xl font-semibold mt-8 mb-3',
      4: 'text-lg font-semibold mt-6 mb-2'
    };

    return `<h${level} id="${slug}" class="heading heading-${level}">${text}</h${level}>\n`;
  };

  // Ensure other renderer methods are copied or bound if needed.
  // Since we were attaching methods to a single instance before, we define them here.

  renderer.paragraph = function (text) {
    if (text.startsWith('[!NOTE]')) {
      const content = text.replace('[!NOTE]', '').trim();
      return `
        <div class="callout callout-note">
          <div class="callout-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div class="callout-content"><p>${content}</p></div>
        </div>`;
    }
    if (text.startsWith('[!WARNING]')) {
      const content = text.replace('[!WARNING]', '').trim();
      return `
        <div class="callout callout-warning">
          <div class="callout-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div class="callout-content"><p>${content}</p></div>
        </div>`;
    }
    return `<p class="paragraph">${text}</p>\n`;
  };

  renderer.codespan = function (code) {
    return `<code class="inline-code">${code}</code>`;
  };

  renderer.code = function (code, language) {
    let highlighted;
    if (language && hljs.getLanguage(language)) {
      highlighted = hljs.highlight(code, { language }).value;
    } else {
      highlighted = hljs.highlightAuto(code).value;
    }
    const filename = language ? `example.${language}` : 'code';
    return `
      <div class="code-block">
        <div class="code-block-header">
          <span class="code-block-filename">${filename}</span>
          <button class="code-block-copy" onclick="copyCode(this)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy
          </button>
        </div>
        <pre class="code-block-pre"><code class="code-block-code">${highlighted}</code></pre>
      </div>`;
  };

  renderer.list = function (body, ordered) {
    const tag = ordered ? 'ol' : 'ul';
    return `<${tag} class="list ${ordered ? 'list-ordered' : 'list-unordered'}">${body}</${tag}>\n`;
  };

  renderer.listitem = function (text) {
    return `<li class="list-item">${text}</li>\n`;
  };

  renderer.link = function (href, title, text) {
    const titleAttr = title ? ` title="${title}"` : '';
    return `<a href="${href}"${titleAttr} class="link">${text}</a>`;
  };

  renderer.blockquote = function (quote) {
    if (quote.includes('[!NOTE]') || quote.includes('[!TIP]')) {
      const content = quote.replace(/<p>|<\/p>/g, '').replace(/\[!NOTE\]|\[!TIP\]/g, '').trim();
      return `
        <div class="callout callout-note">
          <div class="callout-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div class="callout-content">${content}</div>
        </div>`;
    }
    if (quote.includes('[!WARNING]') || quote.includes('[!CAUTION]')) {
      const content = quote.replace(/<p>|<\/p>/g, '').replace(/\[!WARNING\]|\[!CAUTION\]/g, '').trim();
      return `
        <div class="callout callout-warning">
          <div class="callout-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div class="callout-content">${content}</div>
        </div>`;
    }
    return `<blockquote class="blockquote">${quote}</blockquote>\n`;
  };

  return renderer;
}

export function parseMarkdown(markdown) {
  const headings = [];
  const renderer = createRenderer(headings);

  // Use the custom renderer for this parse
  const html = marked(markdown, { renderer });

  return {
    html,
    headings
  };
}

export function extractHeadings(markdown) {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const result = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    result.push({
      level: match[1].length,
      text: match[2],
      slug: match[2].toLowerCase().replace(/[^\w]+/g, '-').replace(/(^-|-$)/g, '')
    });
  }

  return result;
}
