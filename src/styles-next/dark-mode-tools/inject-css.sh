# Try a style variant in the open page without the dev server: sh inject-css.sh NAME ['extra css']
# Compiles styles-next, appends the extra css, writes $OUT/NAME.js (OUT defaults to /tmp). Run that file with
# chrome-devtools evaluate_script (sourcePath): it disables the page stylesheet, removes the webpack error overlay
# and injects the css. Relative url() in the injected css do not resolve (flag icon), ignore that.
OUT=${OUT:-/tmp}
cd "$(git rev-parse --show-toplevel)" || exit 1
npx sass --quiet --no-source-map --load-path=. --load-path=node_modules src/styles-next/styles.scss "$OUT/$1.css" || exit 1
printf '%s\n' "$2" >>"$OUT/$1.css"
node -e "
const css = require('fs').readFileSync('$OUT/$1.css', 'utf8')
require('fs').writeFileSync('$OUT/$1.js', 'async () => { document.querySelectorAll(\"#webpack-dev-server-client-overlay\").forEach(e => e.remove()); document.querySelectorAll(\"link[href*=styles]\").forEach(l => l.disabled = true); let s = document.getElementById(\"inj\"); if (!s) { s = document.createElement(\"style\"); s.id = \"inj\"; document.head.append(s) } s.textContent = ' + JSON.stringify(css) + '; await new Promise(r => setTimeout(r, 800)); return \"$1\" }')
"
