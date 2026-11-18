const ATTR = 'data-cy'

/**
 * Fixed `data-cy` values set in Angular templates. Keep in step with templates: Jest spec
 * `num-data-cy.registry.spec.ts` fails on drift in either direction.
 * */
export const FIXED_HOOKS = [
  'cancel-download-button',
  'checkbox',
  'criterion-content',
  'dialog-comment-input',
  'dialog-title-input',
  'download-crtdl-button',
  'download-format-crtdl',
  'download-format-csv',
  'download-modal',
  'language-option-de',
  'language-option-en',
  'language-select',
  'openMenu',
  'save-cohort-button',
  'save-file-button',
  'saved-query-delete-icon',
  'upload-crtdl',
] as const

/**
 * Hook value: fixed value, or side-menu `nav-<route>`.
 * */
export type Hook = (typeof FIXED_HOOKS)[number] | `nav-${string}`

/**
 * Elements whose `data-cy` is entity text (display name) from data, not fixed value.
 * `.container` criteria-box, `.selection-box` data selection box, `.block` filter chip block,
 * `.chip-container` filter chip, `.divider` tree node, `num-quantity` quantity filter panel.
 * */
export type Carrier =
  | '.container'
  | '.selection-box'
  | '.block'
  | '.chip-container'
  | '.divider'
  | 'num-quantity'

/**
 * CSS selector for fixed `data-cy` hook.
 * */
export const dataCy = (hook: Hook) => `[${ATTR}="${hook}"]`

/**
 * CSS selector for `data-cy` hook carrying entity text, scoped to element that carries it.
 * */
export const dataCyOf = (text: string, carrier: Carrier) => `${carrier}[${ATTR}="${text}"]`
