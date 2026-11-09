#!/usr/bin/env bash
# Runs at skill-load time via the !`...` dynamic-context hook in SKILL.md.
# Emits a compact, grounded status block. Never fails the load: always exits 0.

set -uo pipefail

SKILL_DIR="${1:-}"
[ -z "$SKILL_DIR" ] && SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Collect package.json files worth inspecting: nearest ancestors + shallow
# workspace children. Bounded so this stays fast in large monorepos.
pkgs=""
ROOT=""
dir="$PWD"
for _ in 1 2 3 4 5; do
  if [ -f "$dir/package.json" ]; then
    pkgs="$pkgs $dir/package.json"
    # The nearest package.json is the project root, even when the skill runs from a subfolder.
    [ -z "$ROOT" ] && ROOT="$dir"
  fi
  [ "$dir" = "/" ] && break
  dir="$(dirname "$dir")"
done
[ -z "$ROOT" ] && ROOT="$PWD"
for p in "$ROOT"/*/package.json "$ROOT"/*/*/package.json; do
  [ -f "$p" ] && pkgs="$pkgs $p"
done

deps() { [ -n "$pkgs" ] && grep -hoE "\"$1\"[[:space:]]*:" $pkgs 2>/dev/null | head -1; }

# --- Gate: is this a web project? -------------------------------------------
web_evidence=""
for f in react next vite astro svelte vue remix nuxt; do
  [ -n "$(deps "$f")" ] && web_evidence="$web_evidence $f"
done
if [ -z "$web_evidence" ] && ls "$ROOT"/*.html "$ROOT"/public/index.html >/dev/null 2>&1; then
  web_evidence=" html"
fi

if [ -n "$web_evidence" ]; then
  web_status="WEB PROJECT CONFIRMED —${web_evidence}"
else
  web_status="WEB PROJECT NOT CONFIRMED — no web framework or HTML entry found"
fi

# --- Gate: is UI Lab already wired? -----------------------------------------
if [ -n "$(deps 'ui-lab-components')" ]; then
  uilab_status="ui-lab-components INSTALLED — skip setup, go straight to work"
else
  uilab_status="ui-lab-components NOT FOUND — general mode; setup only if the user asks"
fi

# --- Gate: is the ui-lab CLI available? -------------------------------------
# The CLI does the heavy lifting for install/init/wiring. MCP availability is not
# detectable here — the agent must confirm its own mcp__ui-lab__* tools instead.
if command -v ui-lab >/dev/null 2>&1 || [ -x "$ROOT/node_modules/.bin/ui-lab" ]; then
  cli_status="ui-lab CLI AVAILABLE — use it for init/add/status"
else
  cli_status="ui-lab CLI NOT FOUND — general mode; setup requires it (npx --package ui-lab, or add the ui-lab package)"
fi

# --- Mode: which system governs the work ----------------------------------
# ui-lab needs the package and the CLI; the agent still confirms its own
# mcp__ui-lab__* tools and falls back to general when they are absent.
if [ -n "$(deps 'ui-lab-components')" ] && [ "${cli_status#ui-lab CLI AVAILABLE}" != "$cli_status" ]; then
  mode_status="ui-lab — load core/* + systems/ui-lab.md (general if mcp__ui-lab__* tools are missing)"
else
  mode_status="general — load core/* + systems/project.md; do not install UI Lab unless asked"
fi

# --- Project system: what general mode reads instead of the UI Lab registry --
system=""
for f in tailwind.config.ts tailwind.config.js tailwind.config.mjs tailwind.config.cjs components.json; do
  [ -f "$ROOT/$f" ] && system="$system $ROOT/$f"
done
for d in components/ui src/components/ui app/components/ui components src/components; do
  [ -d "$ROOT/$d" ] && { system="$system $ROOT/$d/"; break; }
done
for css in app/globals.css src/app/globals.css src/index.css src/styles/globals.css styles/globals.css; do
  [ -f "$ROOT/$css" ] && { system="$system $ROOT/$css"; break; }
done
for lib in @radix-ui/react-slot @mui/material @chakra-ui/react @mantine/core @headlessui/react react-aria-components; do
  [ -n "$(deps "$lib")" ] && system="$system $lib"
done
[ -z "$system" ] && system=" none found — the surrounding code is the system"

# --- Theme: is there a token layer for ui-lab-components to consume? --------
# Component CSS only consumes tokens (--background-950, --foreground-*, …). Without
# a stylesheet that defines them, components render with browser defaults.
if [ -z "$(deps 'ui-lab-components')" ]; then
  theme_status="N/A — ui-lab-components is not installed"
else
  theme_pkg="$( [ -n "$pkgs" ] && grep -hoE '"ui-lab-theme-[a-z0-9-]+"[[:space:]]*:' $pkgs 2>/dev/null | head -1 | grep -oE 'ui-lab-theme-[a-z0-9-]+')"
  css_files="$(find "$ROOT" -maxdepth 4 -name '*.css' -not -path '*/node_modules/*' -not -path '*/.next/*' -not -path '*/dist/*' 2>/dev/null | head -200)"
  token_file=""
  theme_imported=""
  components_css=""
  if [ -n "$css_files" ]; then
    token_file="$(grep -lE -- '--background-950[[:space:]]*:' $css_files 2>/dev/null | head -1)"
    theme_imported="$(grep -lE "@import[[:space:]]+['\"]ui-lab-theme-" $css_files 2>/dev/null | head -1)"
    components_css="$(grep -lE "@import[[:space:]]+['\"]ui-lab-components/styles\.css" $css_files 2>/dev/null | head -1)"
  fi
  if [ -n "$token_file" ]; then
    theme_status="SET UP — tokens defined in $token_file${theme_pkg:+; $theme_pkg installed}"
  elif [ -n "$theme_pkg" ]; then
    theme_status="TOKENS MISSING — $theme_pkg is installed${theme_imported:+ and imported} but no stylesheet defines the color tokens (--background-950 …); components will render unthemed. Follow systems/ui-lab.md § Project readiness"
  else
    theme_status="NOT INSTALLED — no ui-lab-theme-* package and no token layer${components_css:+ (ui-lab-components/styles.css is imported)}; components will render unthemed. Follow systems/ui-lab.md § Project readiness"
  fi
fi

# --- Ground the routing table in files that actually exist ------------------
modes=""
for m in setup build ideate audit conform quickfix; do
  [ -f "$SKILL_DIR/workflows/$m.md" ] && modes="$modes $m"
done
[ -z "$modes" ] && modes=" (none found — workflows/ missing)"

cat <<EOF
✅ lab skill loaded — $SKILL_DIR
- Project: $web_status
- UI Lab: $uilab_status
- Theme: $theme_status
- CLI: $cli_status
- MODE: $mode_status
- Project system:$system
- Modes available:$modes
EOF

exit 0
