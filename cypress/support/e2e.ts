/**
 * Global support file, loaded automatically before every spec. Put global configuration and
 * Cypress behavior changes here. Docs: https://on.cypress.io/configuration (`supportFile`
 * option).
 * */

/**
 * Import custom commands.
 * */
import './commands'

/**
 * Run in dark theme when theme expose value is dark.
 * */
Cypress.on('window:before:load', (win) => {
  if (Cypress.expose('theme') === 'dark') win.localStorage.setItem('theme', 'dark')
})
export { BasePaths } from '../../src/app/app-paths'
export { PathSegments } from '../../src/app/app-paths'
export { UrlPaths } from '../../src/app/app-paths'
