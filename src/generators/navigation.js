export function buildNavigation(pages) {
    // Group pages by section
    const sections = {};

    for (const page of pages) {
        const section = page.frontmatter.section;
        if (!sections[section]) {
            sections[section] = [];
        }
        sections[section].push({
            title: page.frontmatter.title,
            slug: page.slug,
            url: page.outputPath,
            order: page.frontmatter.order,
            icon: page.frontmatter.icon || null
        });
    }

    // Sort pages within each section by order, then title
    for (const section of Object.keys(sections)) {
        const items = sections[section];

        // Check for duplicate orders
        const orders = items.map(i => i.order).filter(o => o !== 999);
        const duplicates = orders.filter((item, index) => orders.indexOf(item) !== index);
        if (duplicates.length > 0) {
            console.warn(`⚠️  Warning: Duplicate order ${duplicates[0]} detected in section "${section}". Sorting alphabetically as fallback.`);
        }

        items.sort((a, b) => {
            if (a.order !== b.order) return a.order - b.order;
            return a.title.localeCompare(b.title);
        });
    }

    // Define section order (can be configured)
    const sectionOrder = [
        'Getting Started',
        'Core Concepts',
        'API Reference',
        'Guides',
        'Examples'
    ];

    // Build ordered navigation array
    const navigation = [];

    // First add sections in predefined order
    for (const sectionName of sectionOrder) {
        if (sections[sectionName]) {
            navigation.push({
                name: sectionName,
                items: sections[sectionName]
            });
            delete sections[sectionName];
        }
    }

    // Add remaining sections alphabetically
    const remainingSections = Object.keys(sections).sort();
    for (const sectionName of remainingSections) {
        navigation.push({
            name: sectionName,
            items: sections[sectionName]
        });
    }

    return navigation;
}

export function renderNavigation(navigation, currentSlug) {
    let html = '<nav class="sidebar-nav">';

    for (const section of navigation) {
        html += `
      <div class="nav-section">
        <h3 class="nav-section-title">${section.name}</h3>
        <ul class="nav-list">`;

        for (const item of section.items) {
            const isActive = item.slug === currentSlug;
            const activeClass = isActive ? 'nav-item-active' : '';
            const iconHtml = item.icon ? `<span class="nav-icon">${item.icon}</span>` : '';

            html += `
          <li>
            <a href="/${item.url}" class="nav-item ${activeClass}">
              ${iconHtml}
              ${item.title}
            </a>
          </li>`;
        }

        html += `
        </ul>
      </div>`;
    }

    html += '</nav>';
    return html;
}
