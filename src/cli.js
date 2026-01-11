#!/usr/bin/env node

import { build } from './build.js';
import { loadConfig, initConfig } from './config.js';

const args = process.argv.slice(2);
const command = args[0];

// Main CLI handler
async function main() {
  try {
    switch (command) {
      case 'build':
        console.log('🔨 Building documentation...\n');
        const config = loadConfig();
        await build(config);
        console.log('\n✅ Build complete! Output in', config.outDir);
        break;

      case 'init':
        initConfig();
        break;

      case 'help':
      case '--help':
      case '-h':
      case undefined:
        console.log(`
DocGenie – Static Documentation Generator

Usage:
  docgenie build    Build the documentation site
  docgenie init     Create a default configuration file
  docgenie help     Show this help message

Configuration:
  Run "docgenie init" to generate docgenie.config.json
        `);
        break;

      default:
        console.log(`Unknown command "${command}". Use "docgenie help" for usage.`);
        process.exit(1);
    }
  } catch (err) {
    // Human-friendly error reporting
    console.error('');
    if (err.message.startsWith('Config error:') || err.message.startsWith('Failed to parse')) {
      console.error('❌ ' + err.message);
    } else {
      console.error('❌ Build failed:', err.message);
      // Only show stack trace for unexpected errors
      if (process.env.DEBUG) {
        console.error(err.stack);
      }
    }
    process.exit(1);
  }
}

main();
