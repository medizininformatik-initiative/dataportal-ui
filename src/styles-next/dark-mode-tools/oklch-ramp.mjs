// Run outside the repo (packages are not project deps on purpose): T=$(mktemp -d) && npm i --prefix $T apca-w3@0.1.9 colorparsley@0.1.8 culori@4.0.1 && cp oklch-ramp.mjs $T && node $T/oklch-ramp.mjs ...
import { formatHex, clampChroma } from 'culori'
import { APCAcontrast, sRGBtoY } from 'apca-w3'
import { colorParsley } from 'colorparsley'
const lc = (t, b) => APCAcontrast(sRGBtoY(colorParsley(t)), sRGBtoY(colorParsley(b))).toFixed(0)
const steps = {
  300: [0.75, 0.05],
  400: [0.68, 0.1],
  500: [0.547, 0.132],
  600: [0.5, 0.122],
  700: [0.45, 0.11],
}
for (const [name, H] of [
  ['blue', 245],
  ['green', 146],
]) {
  for (const [k, [L, C]] of Object.entries(steps)) {
    const hex = formatHex(clampChroma({ mode: 'oklch', l: L, c: C, h: H }, 'oklch'))
    console.log(
      name,
      k,
      hex,
      'on content Lc',
      lc(hex, '#1b1b1b'),
      '| white on it Lc',
      lc('#ffffff', hex)
    )
  }
}
