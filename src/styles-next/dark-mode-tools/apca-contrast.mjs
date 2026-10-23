// Run outside the repo (packages are not project deps on purpose): T=$(mktemp -d) && npm i --prefix $T apca-w3@0.1.9 colorparsley@0.1.8 culori@4.0.1 && cp apca-contrast.mjs $T && node $T/apca-contrast.mjs ...
import { APCAcontrast, sRGBtoY } from 'apca-w3'
import { colorParsley } from 'colorparsley'
const lc = (t, b) => APCAcontrast(sRGBtoY(colorParsley(t)), sRGBtoY(colorParsley(b))).toFixed(1)
const w = (a, b) => {
  const L = (h) => {
    const c = colorParsley(h)
      .slice(0, 3)
      .map((v) => {
        v /= 255
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
      })
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
  }
  const x = L(a),
    y = L(b)
  return ((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(2)
}
const pairs = process.argv.slice(2).map((s) => s.split(':'))
for (const [t, b, n] of pairs)
  console.log(`${(n || '').padEnd(28)} ${t} on ${b}  APCA Lc ${lc(t, b)}  WCAG ${w(t, b)}`)
