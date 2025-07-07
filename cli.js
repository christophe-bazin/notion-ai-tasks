#!/usr/bin/env node

// Re-export from modular CLI
export * from './src/cli/index.js';

// Run CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await import('./src/cli/index.js');
}