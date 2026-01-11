import { glob } from 'glob';
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'fs';
import { resolve, dirname, basename, relative } from 'path';
import { parseMarkdown, extractHeadings } from './parsers/markdown.js';
import { parseFrontmatter } from './parsers/frontmatter.js';
import { buildNavigation } from './generators/navigation.js';
import { generateToc } from './generators/toc.js';
import { buildSearchIndex } from './generators/search-index.js';
import { renderPage } from './templates/page.js';

export async function build(config) {
    const docsDir = resolve(process.cwd(), config.docsDir);
    const outDir = resolve(process.cwd(), config.outDir);
    const staticDir = resolve(dirname(new URL(import.meta.url).pathname), '..', 'static');

    // Clean and create output directory
    mkdirSync(outDir, { recursive: true });

    // Find all markdown files
    const files = await glob('**/*.md', { cwd: docsDir });
    console.log(`Found ${files.length} markdown files`);

    // Parse all files and extract metadata
    const pages = [];
    for (const file of files) {
        const filePath = resolve(docsDir, file);
        const content = readFileSync(filePath, 'utf-8');
        const { data: frontmatter, content: markdown } = parseFrontmatter(content, basename(file));

        // Generate output path
        const slug = file.replace(/\.md$/, '');
        const outputPath = slug === 'index' ? 'index.html' : `${slug}.html`;

        pages.push({
            slug,
            file,
            filePath,
            outputPath,
            frontmatter,
            markdown
        });
    }

    // Build navigation from frontmatter
    const navigation = buildNavigation(pages);

    // Build search index
    const searchIndex = [];

    // Render each page
    for (const page of pages) {
        const { html, headings } = parseMarkdown(page.markdown);
        const toc = generateToc(headings);

        // Add to search index
        searchIndex.push({
            title: page.frontmatter.title || basename(page.slug),
            url: page.outputPath,
            headings: headings.map(h => h.text),
            excerpt: page.markdown.slice(0, 200).replace(/[#*`\n]/g, ' ').trim()
        });

        // Render full page
        const pageHtml = renderPage({
            config,
            page,
            content: html,
            navigation,
            toc,
            pages
        });

        // Write to output
        const outputFilePath = resolve(outDir, page.outputPath);
        mkdirSync(dirname(outputFilePath), { recursive: true });
        writeFileSync(outputFilePath, pageHtml);
        console.log(`  ✓ ${page.outputPath}`);
    }

    // Copy static assets
    if (existsSync(staticDir)) {
        cpSync(staticDir, outDir, { recursive: true });
        console.log('  ✓ Static assets copied');
    }

    // Write search index
    writeFileSync(
        resolve(outDir, 'search-index.json'),
        JSON.stringify(searchIndex, null, 2)
    );
    console.log('  ✓ Search index generated');
}
