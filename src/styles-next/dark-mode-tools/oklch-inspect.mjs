// Run outside the repo (packages are not project deps on purpose): T=$(mktemp -d) && npm i --prefix $T apca-w3@0.1.9 colorparsley@0.1.8 culori@4.0.1 && cp oklch-inspect.mjs $T && node $T/oklch-inspect.mjs ...
import { oklch, formatHex, converter, clampChroma } from 'culori'
const hsl = converter('hsl')
for (const h of process.argv.slice(2)) {
  const o = oklch(h),
    s = hsl(h)
  console.log(
    h.padEnd(9),
    `OKLCH L ${o.l.toFixed(3)} C ${o.c.toFixed(3)} H ${(o.h ?? 0).toFixed(0).padStart(3)}`,
    ` | HSL S ${(s.s * 100).toFixed(0)}% L ${(s.l * 100).toFixed(0)}%`
  )
}
