/**
 * Global support file, loaded automatically before every spec. Put global configuration and
 * Cypress behavior changes here. Docs: https://on.cypress.io/configuration (`supportFile`
 * option).
 * */

/**
 * Import custom commands.
 * */
import './commands'
export { BasePaths } from '../../src/app/app-paths'
export { PathSegments } from '../../src/app/app-paths'
export { UrlPaths } from '../../src/app/app-paths'
