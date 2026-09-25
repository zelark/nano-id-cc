import { build } from 'esbuild';
import { cp, mkdir, rm } from 'node:fs/promises';

const outdir = 'dist';

// Clean previous build
await rm(outdir, { recursive: true, force: true });
await mkdir(outdir, { recursive: true });

// Bundle and minify TypeScript
await build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  minify: true,
  target: ['es2020'],
  outfile: `${outdir}/js/main.js`,
  logLevel: 'info',
});

// Minify CSS
await build({
  entryPoints: ['public/css/style.css'],
  minify: true,
  outfile: `${outdir}/css/style.min.css`,
  logLevel: 'info',
});

// Copy static assets
for (const file of ['index.html', 'boom.jpg', 'copy.svg', 'logo.svg', 'refresh.svg', 'favicon.ico']) {
  await cp(`public/${file}`, `${outdir}/${file}`);
}
