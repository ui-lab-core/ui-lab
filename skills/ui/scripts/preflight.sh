#!/usr/bin/env bash
# Runs at skill-load time via the !`...` dynamic-context hook in SKILL.md.
# Emits a compact, grounded status block. Never fails the load: always exits 0.

set -uo pipefail

SKILL_DIR="${1:-}"
[ -z "$SKILL_DIR" ] && SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Collect package.json files worth inspecting: nearest ancestors + shallow
# workspace children. Bounded so this stays fast in large monorepos.
pkgs=""
dir="$PWD"
for _ in 1 2 3 4 5; do
  [ -f "$dir/package.json" ] && pkgs="$pkgs $dir/package.json"
  [ "$dir" = "/" ] && break
  dir="$(dirname "$dir")"
done
for p in ./package.json ./*/package.json ./*/*/package.json; do
  [ -f "$p" ] && pkgs="$pkgs $p"
done

deps() { [ -n "$pkgs" ] && grep -hoE "\"$1\"[[:space:]]*:" $pkgs 2>/dev/null | head -1; }

# --- Gate: is this a web project? -------------------------------------------
web_evidence=""
for f in react next vite astro svelte vue remix nuxt; do
  [ -n "$(deps "$f")" ] && web_evidence="$web_evidence $f"
done
if [ -z "$web_evidence" ] && ls ./*.html ./public/index.html ./index.html >/dev/null 2>&1; then
  web_evidence=" html"
fi

if [ -n "$web_evidence" ]; then
  web_status="WEB PROJECT CONFIRMED —${web_evidence}"
else
  web_status="WEB PROJECT NOT CONFIRMED — no web framework or HTML entry found"
fi

# --- Gate: is UI Lab already wired? -----------------------------------------
if [ -n "$(deps 'ui-lab-components')" ]; then
  uilab_status="ui-lab-components INSTALLED — skip setup guide, go straight to work"
else
  uilab_status="ui-lab-components NOT FOUND — conform must run get_guide(\"setup-ui-lab-in-project\") first"
fi

# --- Ground the routing table in files that actually exist ------------------
modes=""
for m in build ideate audit conform; do
  [ -f "$SKILL_DIR/workflows/$m.md" ] && modes="$modes $m"
done
[ -z "$modes" ] && modes=" (none found — workflows/ missing)"

cat <<EOF
✅ UI skill loaded — $SKILL_DIR
- Project: $web_status
- UI Lab: $uilab_status
- Modes available:$modes
EOF

exit 0
