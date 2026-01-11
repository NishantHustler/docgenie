export function generateToc(headings) {
    if (!headings || headings.length === 0) {
        return '';
    }

    let html = `
    <nav class="toc">
      <h4 class="toc-title">On this page</h4>
      <ul class="toc-list">`;

    for (const heading of headings) {
        const nestedClass = heading.level === 3 ? 'toc-item-nested' : '';
        html += `
        <li>
          <a href="#${heading.slug}" class="toc-item ${nestedClass}" data-heading="${heading.slug}">
            ${heading.text}
          </a>
        </li>`;
    }

    html += `
      </ul>
    </nav>`;

    return html;
}
