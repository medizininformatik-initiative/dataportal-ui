() => {
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,\/]+/).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] } }
  const over = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 })
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b) }
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) }
  const bgOf = (el) => { const chain = []; for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0) { chain.push(c); if (c.a === 1) break } } let bg = { r: 255, g: 255, b: 255, a: 1 }; if (document.documentElement.dataset.theme === 'dark' && !chain.some((c) => c.a === 1)) bg = { r: 24, g: 24, b: 24, a: 1 }; for (const c of chain.reverse()) bg = over(c, bg); return bg }
  const out = {}; let total = 0, bad = 0
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  while (w.nextNode()) {
    const n = w.currentNode; if (!n.textContent.trim()) continue
    const el = n.parentElement; const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue
    const r = el.getBoundingClientRect(); if (r.width === 0 || r.height === 0) continue
    if (el.closest('.cdk-visually-hidden,script,style')) continue
    const fg = parse(cs.color); if (!fg) continue
    const bg = bgOf(el); const f = over(fg, bg)
    const big = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700)
    const need = big ? 3 : 4.5; const cr = ratio(f, bg); total++
    if (cr < need) { bad++; const k = el.tagName.toLowerCase() + '.' + [...el.classList].slice(0, 2).join('.') + ' ' + cs.color + ' on ' + `rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})` + ' ' + cr.toFixed(2); out[k] = (out[k] || 0) + 1 }
  }
  const wh={}; document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect(); if(r.width<12||r.height<8) return; const cs=getComputedStyle(e); if(cs.visibility==='hidden'||cs.display==='none') return; const c=parse(cs.backgroundColor); if(c&&c.a>0.5&&lum(c)>0.6){const k=e.tagName.toLowerCase()+'.'+[...e.classList].slice(0,3).join('.'); wh[k]=(wh[k]||0)+1}});
  return { whites: wh, path: location.pathname, theme: document.documentElement.dataset.theme || 'light', total, bad, offenders: Object.entries(out).sort((a, b) => b[1] - a[1]).slice(0, 25) }
}
