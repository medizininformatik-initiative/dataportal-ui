// Paste into Chrome DevTools MCP evaluate_script (sourcePath). Lists every visible chromatic color (color, background, border, outline, fill) that is not on the dark blue/green ramp in themes/fdpg-dark/_roles.scss. Update `ramp` when the ramp changes.
;async () => {
  await new Promise((r) => setTimeout(r, 3000))
  const ramp = new Set([
    '#92bde2',
    '#609fd2',
    '#1476b8',
    '#0b68a3',
    '#075a8e',
    '#9bc49d',
    '#6fa973',
    '#33843e',
    '#2b7535',
    '#23652d',
  ])
  const hex = (s) => {
    const m = s.match(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?/)
    if (!m || m[4] === '0') return null
    return (
      '#' +
      [1, 2, 3].map((i) => (+m[i]).toString(16).padStart(2, '0')).join('') +
      (m[4] ? '@' + m[4] : '')
    )
  }
  const chroma = (h) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
    return Math.max(r, g, b) - Math.min(r, g, b)
  }
  const out = {}
  for (const e of document.querySelectorAll('body *')) {
    if (!e.getClientRects().length) continue
    const c = getComputedStyle(e)
    for (const p of [
      'color',
      'backgroundColor',
      'borderTopColor',
      'borderLeftColor',
      'outlineColor',
      'fill',
    ]) {
      if (p.startsWith('border') && parseFloat(c[p.replace('Color', 'Width')]) === 0) continue
      if (p === 'outlineColor' && c.outlineStyle === 'none') continue
      const h = hex(c[p] || '')
      if (!h || chroma(h.slice(0, 7)) < 25 || ramp.has(h)) continue
      const k = h + ' ' + p
      ;(out[k] ||= []).length < 2 &&
        out[k].push(
          e.tagName.toLowerCase() + '.' + String(e.className).split(' ').slice(0, 2).join('.')
        )
    }
  }
  return out
}
