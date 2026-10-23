// Reopens the feature editor of the first selected feature (needs one in the data selection): overview -> gear -> Konfigurieren.
// Every dev-server reload drops the editor state, so run this after each save.
;async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms))
  if (!location.pathname.startsWith('/data-selection/overview')) {
    history.pushState({}, '', '/data-selection/overview')
    dispatchEvent(new PopStateEvent('popstate'))
    await wait(3000)
  }
  document.querySelector('button[aria-haspopup=menu]')?.click()
  await wait(800)
  ;[...document.querySelectorAll('[role=menuitem]')]
    .find((m) => /Konfigurieren/.test(m.textContent))
    ?.click()
  await wait(3500)
  return location.href
}
