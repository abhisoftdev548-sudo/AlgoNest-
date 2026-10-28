import { execFileSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Dependency-free syntax gate for every JS file in the Node workspaces. */
const here = path.dirname(fileURLToPath(import.meta.url));
const roots = [
  path.resolve(here, '../src'),
  path.resolve(here, '../scripts'),
  path.resolve(here, '../tests'),
  path.resolve(here, '../../shared/src'),
];

function* walk(directory) {
  let entries;
  try {
    entries = readdirSync(directory, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile() && entry.name.endsWith('.js')) yield full;
  }
}

let checked = 0;
for (const root of roots) {
  for (const file of walk(root)) {
    try {
      execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Syntax error in ${path.relative(process.cwd(), file)}\n${error.stderr?.toString() ?? error.message}`);
      process.exitCode = 1;
    }
    checked += 1;
  }
}

// eslint-disable-next-line no-console
console.info(`[lint] syntax OK for ${checked} JavaScript files`);
