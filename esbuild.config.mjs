import { build } from 'esbuild';
const shared = { entryPoints: ['src/index.js'], bundle: true, sourcemap: true, target: ['es2020'], logLevel: 'info' };
await build({ ...shared, format: 'esm', outfile: 'dist/game.esm.js' });
await build({ ...shared, format: 'iife', globalName: 'FishingGame', outfile: 'dist/game.umd.js' });
console.log('build done');