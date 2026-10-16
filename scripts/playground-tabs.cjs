// Dev-only helper: lets the playground side menu add, rename and delete gallery tabs by editing
// src/app/playground/gallery/gallery.component.ts and gallery-tabs.json. ng serve then reloads.
// Started by ng serve through proxy.conf.js (also runnable alone: npm run playground:tabs).
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const dir = path.join(__dirname, '../src/app/playground/gallery')
const galleryFile = path.join(dir, 'gallery.component.ts')
const jsonFile = path.join(dir, 'gallery-tabs.json')
const GROUP_OPEN = (key) => `      @if (shows('${key}')) {`
const NEXT_GROUP = "      @if (shows('"
// indentation in the gallery template is not guaranteed, so lines are compared trimmed
const isTabEnd = (l) => l.trim() === '</mat-tab>'
const isGroupEnd = (l) => l.trim() === '</mat-tab-group>'
const TAB_END = '          </mat-tab>'
const GROUP_END = '        </mat-tab-group>'

class UserError extends Error {}
const fail = (msg) => {
  throw new UserError(msg)
}

function groupRange(lines, key) {
  const start = lines.indexOf(GROUP_OPEN(key))
  if (start < 0) fail(`no gallery section for ${key}`)
  const next = lines.findIndex(
    (l, i) => i > start && (l.startsWith(NEXT_GROUP) || l === '    </div>')
  )
  let end = next - 1
  while (lines[end] !== '      }') end--
  return [start, end]
}

const tabMarkup = (label, id) => [
  `          <mat-tab label="${label}">`,
  `            <h2 id="${id}">${label}</h2>`,
  '            <p>New design. Ask Claude Code to build it here.</p>',
  TAB_END,
]

function findTab(lines, id) {
  const h = lines.findIndex((l) => l.includes(`<h2 id="${id}">`))
  if (h < 0) fail(`tab ${id} not found`)
  let a = h
  while (!lines[a].trimStart().startsWith('<mat-tab label=')) a--
  let b = h
  while (!isTabEnd(lines[b])) b++
  return [a, b, h]
}

// the tab group opens with <mat-tab-group ... [selectedIndex]="tabIndex([ids])", possibly over several lines
function setTabIds(lines, open, fn) {
  let i = open
  while (!lines[i].includes('tabIndex([')) i++
  lines[i] = lines[i].replace(/tabIndex\(\[(.*?)\]\)/, (_, ids) => {
    const list = fn(
      ids
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    )
    return `tabIndex([${list.join(', ')}])`
  })
}

function add(lines, key, label) {
  const [start, end] = groupRange(lines, key)
  const taken = new Set(lines.join('\n').match(/id="[^"]+"/g))
  const slug =
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'tab'
  let id = `${key}-${slug}`
  for (let n = 2; taken.has(`id="${id}"`); n++) id = `${key}-${slug}-${n}`
  let groupEnd = -1
  for (let i = start; i < end; i++) if (isGroupEnd(lines[i])) groupEnd = i
  if (groupEnd >= 0) {
    let open = groupEnd
    while (!lines[open].includes('<mat-tab-group')) open--
    setTabIds(lines, open, (ids) => [...ids, `'${id}'`])
    lines.splice(groupEnd, 0, ...tabMarkup(label, id))
  } else {
    lines.splice(
      end,
      0,
      `        <mat-tab-group [selectedIndex]="tabIndex(['${id}'])" animationDuration="0ms">`,
      ...tabMarkup(label, id),
      GROUP_END
    )
  }
  return id
}

function rename(lines, id, label) {
  const [a, , h] = findTab(lines, id)
  lines[a] = `          <mat-tab label="${label}">`
  lines[h] = `            <h2 id="${id}">${label}</h2>`
}

function remove(lines, id) {
  const [a, b] = findTab(lines, id)
  lines.splice(a, b - a + 1)
  let open = a
  while (!lines[open].includes('<mat-tab-group')) open--
  setTabIds(lines, open, (ids) => ids.filter((x) => x !== `'${id}'`))
  let close = open
  while (!isGroupEnd(lines[close])) close++
  if (!lines.slice(open, close).some((l) => l.includes('<mat-tab ')))
    lines.splice(open, close - open + 1)
}

function handle(method, { key, id, label }) {
  if (!/^[a-z0-9-]+$/.test(key ?? '')) fail('bad key')
  if (method !== 'DELETE' && !/^[\p{L}\p{N} .,_()/-]{1,60}$/u.test(label ?? '')) fail('bad label')
  const lines = fs.readFileSync(galleryFile, 'utf8').split('\n')
  const tabs = JSON.parse(fs.readFileSync(jsonFile, 'utf8'))
  if (method === 'POST') {
    const newId = add(lines, key, label)
    tabs[key] = [...(tabs[key] ?? []), [label, newId]]
  } else {
    const entry = (tabs[key] ?? []).find(([, i]) => i === id)
    if (!entry) fail('only tabs added from the menu can be edited')
    if (method === 'PATCH') {
      rename(lines, id, label)
      entry[0] = label
    } else {
      remove(lines, id)
      tabs[key] = tabs[key].filter(([, i]) => i !== id)
      if (!tabs[key].length) delete tabs[key]
    }
  }
  fs.writeFileSync(galleryFile, lines.join('\n'))
  fs.writeFileSync(jsonFile, JSON.stringify(tabs, null, 2) + '\n')
}

// Finds where <tag type="..."> is used outside the playground (templates and inline templates).
// ponytail: regex scan, so a `>` inside an attribute value cuts the tag short; [type]="..." is reported as "dynamic".
const appDir = path.join(__dirname, '../src/app')

const root = path.join(__dirname, '..')
const read = (f) => fs.readFileSync(f, 'utf8')
const tsFiles = () => {
  const all = []
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name)
      if (e.isDirectory()) f.endsWith(path.sep + 'playground') || walk(f)
      else if (e.name.endsWith('.ts') && !e.name.endsWith('.spec.ts')) all.push(f)
    }
  }
  walk(appDir)
  return all
}

// Route table from the routing files: { class name -> ['/url', ...] }.
// ponytail: handles flat `path:` entries with loadComponent / loadChildren (no `children:` nesting, which this app has none of).
function routeTable(files) {
  const consts = {}
  const pathsFile = read(path.join(appDir, 'app-paths.ts'))
  let group
  for (const m of pathsFile.matchAll(/export const (\w+) = \{([\s\S]*?)\n\}/g)) {
    group = m[1]
    for (const [, k, v] of m[2].matchAll(/(\w+):\s*'([^']*)'/g)) consts[`${group}.${k}`] = v
  }
  const toUrl = (e) => {
    e = e.trim()
    if (e.startsWith('`')) return e.slice(1, -1).replace(/\$\{([\w.]+)\}/g, (_, k) => consts[k] ?? k)
    return e.startsWith("'") ? e.slice(1, -1) : (consts[e] ?? e)
  }
  const out = {}
  const add = (cls, url) => ((out[cls] ??= []).includes(url) || out[cls].push(url))
  const parse = (file, prefix) => {
    const src = read(file)
    const parts = src.split(/(?=\bpath:\s)/).slice(1)
    for (const part of parts) {
      const p = toUrl(part.match(/^path:\s*([^,\n]+)/)[1])
      const url = [prefix, p].filter(Boolean).join('/')
      const comp = part.match(/loadComponent:[\s\S]*?\.then\(\s*\(?\w+\)?\s*=>\s*\w+\.(\w+)|\bcomponent:\s*(\w+)/)
      if (comp) add(comp[1] ?? comp[2], '/' + url)
      const kids = part.match(/loadChildren:[\s\S]*?import\('([^']+)'\)[\s\S]*?\.then\(\s*\(?\w+\)?\s*=>\s*\w+\.(\w+)/)
      if (kids) {
        const f = path.resolve(path.dirname(file), kids[1]) + '.ts'
        if (fs.existsSync(f)) parse(f, url)
      }
    }
  }
  parse(path.join(appDir, 'app-routing.module.ts'), '')
  return out
}

// Pages (routes) a usage ends up on: walk up from the owning component through the templates / dialog opens that use it.
function pagesFor(ownerFile, comps, routes, plain) {
  const owner = comps.find((c) => c.file === ownerFile)
  if (!owner) return []
  const found = []
  const seen = new Set([owner.cls])
  let level = [{ c: owner, via: [owner.selector] }]
  for (let depth = 0; depth < 8 && level.length; depth++) {
    const next = []
    for (const { c, via } of level) {
      for (const url of routes[c.cls] ?? []) found.push({ url, via })
      // dialogs are opened from services / non-component code: no page known, name the file instead
      for (const f of plain)
        if (new RegExp(`open\\(\\s*${c.cls}\\b`).test(f.text)) found.push({ url: null, via: [...via, f.rel] })
      for (const p of comps) {
        if (seen.has(p.cls)) continue
        const uses =
          (/^[a-z][\w-]*$/.test(c.selector) && new RegExp(`<${c.selector}[\\s>/]`).test(p.text)) ||
          new RegExp(`open\\(\\s*${c.cls}\\b`).test(p.text)
        if (!uses) continue
        seen.add(p.cls)
        next.push({ c: p, via: [...via, p.selector] })
      }
    }
    level = next
  }
  return found
}

function usages(tag, type, defaultType) {
  const files = tsFiles()
  const comps = files.flatMap((f) => {
    const src = read(f)
    const m = src.match(/@Component\(\{[\s\S]{0,1500}?selector:\s*'([^']+)'[\s\S]*?export class (\w+)/)
    if (!m) return []
    const html = src.match(/templateUrl:\s*'([^']+)'/)?.[1]
    const htmlFile = html && path.resolve(path.dirname(f), html)
    return [{ file: f, selector: m[1], cls: m[2], text: src + (htmlFile && fs.existsSync(htmlFile) ? read(htmlFile) : '') }]
  })
  const routes = routeTable(files)
  const plain = files
    .filter((f) => !comps.some((c) => c.file === f))
    .map((f) => ({ rel: path.relative(root, f), text: read(f) }))
  const out = []
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name)
      if (e.isDirectory()) {
        if (f !== dir && !f.endsWith(path.sep + 'playground')) walk(f)
      } else if (/\.(html|ts)$/.test(e.name) && !e.name.endsWith('.spec.ts')) scan(f)
    }
  }
  const scan = (f) => {
    const src = fs.readFileSync(f, 'utf8')
    for (const m of src.matchAll(new RegExp(`<${tag}(?![\\w-])([^>]*)>([^<]*)`, 'g'))) {
      const t = m[1].match(/(?<![\w\]-])type="(\w+)"/)?.[1] ?? (/\[type\]/.test(m[1]) ? 'dynamic' : defaultType)
      if (type && t !== type) continue
      const ts = f.endsWith('.html') ? f.replace(/\.html$/, '.ts') : f
      const owner = fs.existsSync(ts) ? fs.readFileSync(ts, 'utf8').match(/selector:\s*'([^']+)'/)?.[1] : undefined
      out.push({
        pages: pagesFor(ts, comps, routes, plain),
        file: path.relative(path.join(__dirname, '..'), f),
        line: src.slice(0, m.index).split('\n').length,
        area: path.relative(appDir, f).split(path.sep).slice(0, 2).join('/'),
        component: owner ?? null,
        label: m[2].replace(/\s+/g, ' ').trim().slice(0, 60),
      })
    }
  }
  walk(appDir)
  return out
}

function start() {
  http
    .createServer((req, res) => {
      const send = (code, body) => {
        res.writeHead(code, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(body))
      }
      // custom header + JSON content type force a CORS preflight, so other sites can't call this
      const url = new URL(req.url, 'http://x')
      if (req.headers['x-playground'] !== '1') return send(404, { error: 'not found' })
      if (url.pathname === '/usages' && req.method === 'GET') {
        const q = url.searchParams
        // tag is interpolated into a RegExp, so only plain element names are accepted
        if (!/^[a-z][\w-]*$/.test(q.get('tag') ?? '')) return send(400, { error: 'bad tag' })
        return send(200, usages(q.get('tag'), q.get('type'), q.get('default') ?? 'blue'))
      }
      if (url.pathname !== '/tabs') return send(404, { error: 'not found' })
      let raw = ''
      req.on('data', (c) => (raw += c))
      req.on('end', () => {
        try {
          handle(req.method, JSON.parse(raw || '{}'))
          send(200, { ok: true })
        } catch (e) {
          send(e instanceof UserError ? 400 : 500, { error: e.message })
        }
      })
    })
    .on('error', (e) => console.log(`playground tabs helper not started: ${e.code}`)) // e.g. already running
    .listen(4301, '127.0.0.1', () => console.log('playground tabs helper on http://127.0.0.1:4301'))
}

if (require.main === module) start()
module.exports = { start, usages }
