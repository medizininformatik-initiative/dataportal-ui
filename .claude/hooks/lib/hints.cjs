const RULE_HINTS = {
  'jsdoc/require-param-type': 'Write @param {Type} name, no description.',
  'jsdoc/require-returns': 'Add @returns {Type} (omit for void).',
  'jsdoc/require-returns-type': 'Write @returns {Type}.',
  'jsdoc/require-description': 'Start the JSDoc block with one sentence.',
  'jsdoc/require-jsdoc': 'Add a JSDoc block: one sentence, typed @param, @returns.',
  '@typescript-eslint/typedef': 'Annotate the arrow parameter: (id: string) => ...',
  '@typescript-eslint/explicit-member-accessibility': 'Add public/private/protected (not on constructor).',
  '@typescript-eslint/naming-convention': 'camelCase members, PascalCase types, no leading underscore on private members.',
  '@typescript-eslint/no-floating-promises': 'await the promise, or mark it with void if fire-and-forget is intended.',
  '@typescript-eslint/no-explicit-any': 'Use a real type or unknown.',
  '@typescript-eslint/no-non-null-assertion': 'Narrow with a check instead of `!`.',
  '@typescript-eslint/consistent-type-assertions': 'Use `as Type` on a variable, not on an object literal; better, fix the type.',
  'max-lines-per-function': 'Function too long. Extract a helper, do not just shorten lines.',
  'max-lines': 'File too long. Extract a module function or sub-component, do not just shorten lines.',
  'max-depth': 'Too nested. Use early return or extract the inner block.',
  'max-params': 'Group the parameters into one typed object, or split the function.',
  'import/order': 'Sort imports alphabetically (eslint --fix handles it).',
  '@typescript-eslint/prefer-readonly': 'Add `readonly` to the member.',
  '@typescript-eslint/no-unsafe-assignment': 'Type the value (no any) before assigning.',
  '@typescript-eslint/no-unsafe-call': 'Type the callee; it is any.',
  '@typescript-eslint/no-unsafe-member-access': 'Type the object; it is any.',
  '@typescript-eslint/no-unsafe-argument': 'Type the argument; it is any.',
  '@typescript-eslint/no-unsafe-return': 'Type the returned value; it is any.',
  '@typescript-eslint/no-unused-vars': 'Remove the unused variable or import.',
  '@typescript-eslint/require-await': 'Remove `async`, or await something.',
  '@angular-eslint/prefer-on-push-component-change-detection': 'Add changeDetection: ChangeDetectionStrategy.OnPush.',
  '@angular-eslint/component-selector': 'Selector must be kebab-case with the num- prefix.',
  '@angular-eslint/directive-selector': 'Attribute directive selector: camelCase with the num prefix.',
  '@angular-eslint/no-input-rename': 'Use the property name as the input name.',
  '@angular-eslint/template/click-events-have-key-events': 'Add (keydown.enter) next to (click), or use a <button>.',
  '@angular-eslint/template/interactive-supports-focus': 'Use a <button>, or add tabindex="0" and a role.',
  '@angular-eslint/template/alt-text': 'Add alt="..." (alt="" for decorative images).',
  'no-fallthrough': 'End the case with break/return, or merge the cases.',
  'no-restricted-syntax': 'Assign the call to a const first, then use the const (calls end in a const).',
  'no-restricted-globals': 'Remove fit/fdescribe (focused test).',
  'no-restricted-imports': 'Use lodash-es, and absolute src/app/... imports.',
  'no-shadow': 'Rename the inner variable.',
  eqeqeq: 'Use === / !==.',
  'no-console': 'Remove the console call.',
}

/** Parsed `eslint --format json` -> one `ruleId: hint` line per distinct known rule. */
const hintsFor = (eslintJson) => {
  const rules = new Set(eslintJson.flatMap((file) => file.messages.map((m) => m.ruleId)))
  return [...rules].filter((rule) => RULE_HINTS[rule]).map((rule) => `${rule}: ${RULE_HINTS[rule]}`)
}

module.exports = { RULE_HINTS, hintsFor }
