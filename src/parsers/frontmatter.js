import matter from 'gray-matter';

// Helper to humanize filename (e.g., "my-page.md" -> "My Page")
function humanize(str) {
    return str
        .replace(/\.md$/, '')
        .replace(/-/g, ' ')
        .replace(/(?:^|\s)\S/g, a => a.toUpperCase());
}

// Helper to find first H1
function findFirstH1(markdown) {
    const match = markdown.match(/^#\s+(.+)$/m);
    return match ? match[1] : null;
}

export function parseFrontmatter(content, filename) {
    const { data, content: markdown } = matter(content);

    // Title fallback priority:
    // 1. Frontmatter title
    // 2. First H1 in content
    // 3. Humanized filename
    const title = data.title || findFirstH1(markdown) || humanize(filename || 'Untitled');

    // Provide defaults
    return {
        data: {
            title,
            section: data.section || 'Documentation',
            order: data.order || 999,
            description: data.description || '',
            ...data
        },
        content: markdown
    };
}
