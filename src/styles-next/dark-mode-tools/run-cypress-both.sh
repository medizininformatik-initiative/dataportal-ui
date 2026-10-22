#!/bin/sh
# Light then dark full suite, logs next to this script's cwd. Do not edit src/ while it runs (dev server reloads).
# A killed run can leave Cypress holding port 4300: ss -ltnp | grep 4300, kill that pid.
cd "$(dirname "$0")/../../.."
npm run cypress:run -- --expose tags='not @pending' > /tmp/cy-light.log 2>&1
npm run cypress:run -- --expose tags='not @pending and not @component:theme',theme=dark > /tmp/cy-dark.log 2>&1
echo "light: $(grep -cE '^\s+✓' /tmp/cy-light.log) passed, dark: $(grep -cE '^\s+✓' /tmp/cy-dark.log) passed (logs /tmp/cy-light.log, /tmp/cy-dark.log)"
