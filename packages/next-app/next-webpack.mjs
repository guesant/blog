#!/usr/bin/env node

const command = process.argv[2];
if ((command === 'build' || command === 'dev') && !process.argv.includes('--webpack')) {
  process.argv.push('--webpack');
}

await import(new URL('./node_modules/next/dist/bin/next', import.meta.url));
