// Stem width in px of the page font per weight and size (draws an "l" on a canvas at 8x, counts ink in one row).
// Compare with line widths: a plain line should not be thicker than the stems of the text beside it (plan, design rule 11).
// Titillium Web: 400 at 14 / 16 / 18 / 20px = 1.05 / 1.2 / 1.35 / 1.5px; 600 = 1.52 / 1.74 / 1.96 / 2.18; 700 = 1.97 / 2.26 / 2.54 / 2.82.
;async () => {
  await document.fonts.ready
  const stem = (weight, size) => {
    const k = 8,
      c = document.createElement('canvas')
    c.width = c.height = size * k * 2
    const g = c.getContext('2d')
    g.fillStyle = '#fff'
    g.fillRect(0, 0, c.width, c.height)
    g.fillStyle = '#000'
    g.font = `${weight} ${size * k}px "Titillium Web"`
    g.textBaseline = 'top'
    g.fillText('l', size * k * 0.5, size * k * 0.2)
    const d = g.getImageData(0, Math.round(size * k * 0.8), c.width, 1).data
    let ink = 0
    for (let i = 0; i < d.length; i += 4) ink += 1 - d[i] / 255
    return +(ink / k).toFixed(2)
  }
  const out = {}
  for (const w of [400, 600, 700]) for (const s of [14, 16, 18, 20]) out[`${w}@${s}`] = stem(w, s)
  return out
}
