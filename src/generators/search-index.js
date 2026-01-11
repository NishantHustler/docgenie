export function buildSearchIndex(pages) {
    return pages.map(page => ({
        title: page.frontmatter.title,
        section: page.frontmatter.section,
        url: page.outputPath,
        description: page.frontmatter.description,
        content: page.markdown
            .replace(/```[\s\S]*?```/g, '') // Remove code blocks
            .replace(/`[^`]+`/g, '')        // Remove inline code
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
            .replace(/[#*_~]/g, '')         // Remove markdown formatting
            .slice(0, 500)                   // Limit content length
    }));
}
