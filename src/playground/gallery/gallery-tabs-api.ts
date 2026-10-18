// Talks to scripts/playground-tabs.cjs (npm run playground:tabs), which edits the gallery source files.
// ponytail: window.prompt/confirm for input, swap for a dialog if this stays.
async function call(method: string, body: object): Promise<void> {
  try {
    const res = await fetch('/playground-api/tabs', {
      method,
      headers: { 'Content-Type': 'application/json', 'X-Playground': '1' },
      body: JSON.stringify(body),
    })
    if (!res.ok) alert((await res.json()).error ?? res.statusText)
    else
      console.info(
        'Playground tab saved, ng serve is rebuilding; the page reloads when done (can take ~20 s).'
      )
  } catch {
    alert('Tab helper not reachable. Restart ng serve (it starts the helper).')
  }
}

export function addTab(key: string): void {
  const label = prompt('New tab name')?.trim()
  if (label) void call('POST', { key, label })
}

export function editTab(key: string, id: string, current: string): void {
  const label = prompt('Tab name', current)?.trim()
  if (label) void call('PATCH', { key, id, label })
}

export function deleteTab(key: string, id: string, label: string): void {
  if (confirm(`Delete tab "${label}"?`)) void call('DELETE', { key, id })
}
