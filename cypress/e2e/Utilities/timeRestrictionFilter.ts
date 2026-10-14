/**
 * Values match real app enum `TimeRestrictionType`
 * (src/app/model/FeasibilityQuery/TimeRestriction.ts) exactly. They are `value` attributes of
 * native `<select>` options (timerestriction-type-selector.component.html), not translated
 * display text. Old lowercase 'before'/'on'/'after' matched nothing real: "on" is app "AT", no
 * "EQUAL" exists.
 * */
export enum TimeRestrictionFilterType {
  After = 'AFTER',
  Before = 'BEFORE',
  On = 'AT',
  Between = 'BETWEEN',
}
export enum TimeRestrictionFilterTypeDE {
  After = 'nach',
  Before = 'vor',
  On = 'am',
  Between = 'zwischen',
}
