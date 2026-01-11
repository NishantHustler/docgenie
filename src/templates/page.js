import { renderNavigation } from '../generators/navigation.js';

export function renderPage({ config, page, content, navigation, tocHtml, pages }) {
  const navHtml = renderNavigation(navigation, page.slug);

  // Find previous and next pages
  const flatPages = navigation.flatMap(section => section.items);
  const currentIndex = flatPages.findIndex(p => p.slug === page.slug);
  const prevPage = currentIndex > 0 ? flatPages[currentIndex - 1] : null;
  const nextPage = currentIndex < flatPages.length - 1 ? flatPages[currentIndex + 1] : null;

  // Build breadcrumbs
  const breadcrumbs = `
    <nav class="breadcrumbs">
      <a href="/" class="breadcrumb-item">Docs</a>
      <span class="breadcrumb-separator">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </span>
      <a href="#" class="breadcrumb-item">${page.frontmatter.section}</a>
      <span class="breadcrumb-separator">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </span>
      <span class="breadcrumb-current">${page.frontmatter.title}</span>
    </nav>`;

  // Pagination
  const pagination = `
    <div class="pagination">
      ${prevPage ? `
        <a href="/${prevPage.url}" class="pagination-link pagination-prev">
          <span class="pagination-label">Previous</span>
          <span class="pagination-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            ${prevPage.title}
          </span>
        </a>
      ` : '<div></div>'}
      ${nextPage ? `
        <a href="/${nextPage.url}" class="pagination-link pagination-next">
          <span class="pagination-label">Next</span>
          <span class="pagination-title">
            ${nextPage.title}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </span>
        </a>
      ` : '<div></div>'}
    </div>`;

  const logoHtml = config.logoPath
    ? `<img src="${config.logoPath}" alt="${config.siteName}" class="header-logo-img">`
    : `<div class="header-logo-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      </div>`;

  const darkClass = config.darkModeDefault ? 'dark' : '';
  // tocHtml is already conditional based on config.showToc passed from build.js
  const finalTocHtml = config.showToc ? tocHtml : '';

  return `<!DOCTYPE html>
<html lang="en" class="${darkClass}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.frontmatter.title} - ${config.siteName}</title>
  <meta name="description" content="${page.frontmatter.description}">
  <link rel="stylesheet" href="/css/style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --accent: ${config.accentColor};
      --accent-hover: ${adjustColor(config.accentColor, -10)};
      --accent-10: ${config.accentColor}1a;
      --accent-30: ${config.accentColor}4d;
    }
  </style>
</head>
<body>
  <!-- Header -->
  <header class="header">
    <div class="header-left">
      <a href="/" class="header-logo">
        ${logoHtml}
        <span class="header-logo-text">${config.siteName}</span>
      </a>
      <nav class="header-nav">
        <a href="/" class="header-nav-item header-nav-active">Docs</a>
        <a href="#" class="header-nav-item">API</a>
        <a href="#" class="header-nav-item">Changelog</a>
      </nav>
    </div>
    <div class="header-right">
      <div class="search-container">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" class="search-input" placeholder="Search documentation..." id="search-input">
        <kbd class="search-kbd">/</kbd>
      </div>
      <div class="header-actions">
        <button class="header-btn" id="theme-toggle" aria-label="Toggle theme">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Search Modal -->
  <div class="search-modal" id="search-modal">
    <div class="search-modal-content">
      <div class="search-modal-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" class="search-modal-input" placeholder="Search documentation..." id="search-modal-input" autofocus>
        <kbd class="search-kbd">esc</kbd>
      </div>
      <div class="search-results" id="search-results"></div>
    </div>
  </div>

  <!-- Layout -->
  <div class="layout">
    <!-- Left Sidebar -->
    <aside class="sidebar">
      ${navHtml}
    </aside>

    <!-- Main Content -->
    <main class="main">
      ${breadcrumbs}
      
      <div class="page-header">
        <h1 class="page-title">${page.frontmatter.title}</h1>
        ${page.frontmatter.description ? `<p class="page-description">${page.frontmatter.description}</p>` : ''}
      </div>

      <div class="content">
        ${content}
      </div>

      ${pagination}
    </main>

    <!-- Right TOC -->
    ${finalTocHtml ? `<aside class="toc-sidebar">${finalTocHtml}</aside>` : ''}
  </div>

  <script src="/js/theme.js"></script>
  <script src="/js/search.js"></script>
  <script src="/js/toc.js"></script>
  <script src="/js/code.js"></script>
</body>
</html>`;
}

// Helper to adjust color brightness
function adjustColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
}
