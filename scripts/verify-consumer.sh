#!/usr/bin/env bash
# Verifies that the built packages can be installed and used by a consumer project.
# It needs only the contents of dist/ (run the build:* scripts first), no registry and no other project:
# every package is packed with `npm pack`, installed into a scratch project and imported from TypeScript.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
packages=(ddata-core ddata-a11y ddata-ui-common ddata-ui-dialog ddata-ui-input ddata-ui-file)
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

mkdir -p "$work/tarballs" "$work/consumer"

for dir in "${packages[@]}"; do
  if [ ! -f "$root/dist/$dir/package.json" ]; then
    echo "::error::dist/$dir is missing, build the packages first."
    exit 1
  fi
  (cd "$root/dist/$dir" && npm pack --pack-destination "$work/tarballs" --silent >/dev/null)
done

cd "$work/consumer"

# The consumer takes the peer dependency versions of the packages from the root package.json.
node - "$root" "$work/tarballs" "${packages[@]}" <<'NODE'
const fs = require('fs');
const path = require('path');
const [root, tarballs, ...dirs] = process.argv.slice(2);
const rootPkg = require(path.join(root, 'package.json'));
const rootDeps = { ...rootPkg.dependencies, ...rootPkg.devDependencies };
const deps = {};
const own = new Set();
for (const dir of dirs) {
  const pkg = require(path.join(root, 'dist', dir, 'package.json'));
  own.add(pkg.name);
  deps[pkg.name] = 'file:' + path.join(tarballs, fs.readdirSync(tarballs).find(f => f.startsWith(pkg.name.replace('@', '').replace('/', '-') + '-')));
}
for (const dir of dirs) {
  const pkg = require(path.join(root, 'dist', dir, 'package.json'));
  for (const name of Object.keys(pkg.peerDependencies || {})) {
    if (!own.has(name) && rootDeps[name]) { deps[name] = rootDeps[name]; }
  }
}
for (const name of ['typescript', 'rxjs', 'tslib', 'zone.js']) {
  if (rootDeps[name]) { deps[name] = rootDeps[name]; }
}
fs.writeFileSync('package.json', JSON.stringify({ name: 'consumer', version: '0.0.0', private: true, dependencies: deps }, null, 2));
fs.writeFileSync('index.ts', dirs.map((d, i) => {
  const pkg = require(path.join(root, 'dist', d, 'package.json'));
  return `import * as p${i} from '${pkg.name}';\nconsole.log(Object.keys(p${i}).length);`;
}).join('\n') + '\n');
NODE

cat > tsconfig.json <<'EOF2'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "types": []
  },
  "files": ["index.ts"]
}
EOF2

npm install --legacy-peer-deps --no-audit --no-fund --ignore-scripts
# Type resolution of every public entry point, as a consuming project sees it.
npx tsc -p tsconfig.json
echo "All packages can be installed and imported by a consumer project."
