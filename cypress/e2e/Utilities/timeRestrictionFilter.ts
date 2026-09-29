// Values match the real app's TimeRestrictionType enum
// (src/app/model/FeasibilityQuery/TimeRestriction.ts) exactly — these are the
// native <select>'s option `value` attributes (timerestriction-type-selector.
// component.html), not translated display text, and not what the previous
// version of this file assumed (lowercase 'before'/'on'/'after' never
// matched anything real; "on" is the app's "AT", and there's no "EQUAL").
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
