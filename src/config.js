import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const DEFAULTS = {
    siteName: "Documentation",
    accentColor: "#6366f1",
    darkModeDefault: true,
    showToc: true,
    docsDir: "docs",
    outDir: "dist",
    logoPath: null
};

export function loadConfig() {
    const configPath = resolve(process.cwd(), 'docgenie.config.json');

    // 1. Check if file exists
    if (!existsSync(configPath)) {
        console.warn('⚠️  docgenie.config.json not found. Using defaults.');
        console.warn('💡 Run "docgenie init" to customize your configuration.\n');
        return DEFAULTS;
    }

    // 2. Parse JSON
    let userConfig;
    try {
        const content = readFileSync(configPath, 'utf-8');
        userConfig = JSON.parse(content);
    } catch (err) {
        throw new Error(`Failed to parse docgenie.config.json: ${err.message}`);
    }

    // 3. Validate and Merge
    return validateAndMerge(userConfig);
}

import { mkdirSync } from 'fs';

export function initConfig() {
    const configPath = resolve(process.cwd(), 'docgenie.config.json');
    if (existsSync(configPath)) {
        throw new Error('docgenie.config.json already exists');
    }

    // 1. Create config
    writeFileSync(configPath, JSON.stringify(DEFAULTS, null, 2));
    console.log('✅ Created docgenie.config.json');

    // 2. Create docs directory if missing
    const docsDir = resolve(process.cwd(), 'docs');
    if (!existsSync(docsDir)) {
        mkdirSync(docsDir);
        console.log('✅ Created docs/ directory');
    }

    // 3. Create index.md if missing
    const indexPath = resolve(docsDir, 'index.md');
    if (!existsSync(indexPath)) {
        const defaultIndex = `---
title: Welcome
section: Home
order: 0
---

# Welcome to DocGenie

This is your new documentation site.

## Next Steps

1. Edit this file in \`docs/index.md\`
2. Run \`docgenie build\`
3. Preview with \`npx serve dist\`
`;
        writeFileSync(indexPath, defaultIndex);
        console.log('✅ Created docs/index.md');
    }

    console.log('\n🎉 You are ready. Run "docgenie build" to generate your site.');
}

function validateAndMerge(userConfig) {
    const config = { ...DEFAULTS, ...userConfig };

    // validate siteName
    if (typeof config.siteName !== 'string') {
        throw new Error('Config error: "siteName" must be a string');
    }

    // validate accentColor
    if (typeof config.accentColor !== 'string' || !/^#([0-9A-F]{3}){1,2}$/i.test(config.accentColor)) {
        throw new Error('Config error: "accentColor" must be a valid hex color string (e.g. "#6366f1")');
    }

    // validate booleans
    if (typeof config.darkModeDefault !== 'boolean') {
        throw new Error('Config error: "darkModeDefault" must be a boolean');
    }
    if (typeof config.showToc !== 'boolean') {
        throw new Error('Config error: "showToc" must be a boolean');
    }

    // validate paths
    if (typeof config.docsDir !== 'string') {
        throw new Error('Config error: "docsDir" must be a string path');
    }
    if (typeof config.outDir !== 'string') {
        throw new Error('Config error: "outDir" must be a string path');
    }

    if (config.logoPath !== null && typeof config.logoPath !== 'string') {
        throw new Error('Config error: "logoPath" must be a string path or null');
    }

    return config;
}
