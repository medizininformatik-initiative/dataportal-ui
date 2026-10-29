import { Directive, HostBinding, input } from '@angular/core'

/**
 * Attaches a `data-cy` attribute for Cypress test selection, as the single
 * place that owns how a test hook gets attached — rename, add validation, or
 * extend behavior (e.g. dev-mode duplicate-value warnings) here once, instead
 * of touching every template that has a test hook.
 *
 * Usage: `<div numDataCy="literal-value">` or `<div [numDataCy]="expr">`
 *
 * The full registry of which component carries which value, and which Cypress
 * component-object class reads it, is documented in `cypress/CLAUDE.md`.
 */
@Directive({
  selector: '[numDataCy]',
  standalone: true,
})
export class NumDataCyDirective {
  public readonly numDataCy = input.required<string>()

  /**
   * Returns the value bound to the host's `data-cy` attribute.
   * @returns {string}
   */
  @HostBinding('attr.data-cy')
  public get dataCy(): string {
    return this.numDataCy()
  }
}
