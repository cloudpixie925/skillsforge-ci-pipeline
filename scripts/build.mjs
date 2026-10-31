// Bundles the service and its runtime dependencies into dist/server.cjs.
// The Docker image only needs dist/ - no node_modules, no npm install.
import { build } from 'esbuild';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });

await build({
  entryPoints: ['src/server.js'],
  outfile: 'dist/server.cjs',
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'cjs',
  minify: true,
  sourcemap: true,
  legalComments: 'linked',
  logLevel: 'info',
});

await writeFile(
  'dist/build-info.json',
  `${JSON.stringify(
    {
      name: pkg.name,
      version: pkg.version,
      commit: process.env.GITHUB_SHA ?? 'local',
      builtAt: new Date().toISOString(),
    },
    null,
    2,
  )}\n`,
);

console.log('Build complete: dist/server.cjs');
