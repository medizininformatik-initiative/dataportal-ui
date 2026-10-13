/**
 * Compare sent CRTDL with CRTDL app gave back. Pure: no Cypress, no CRTDL knowledge beyond
 * keys app rewrites. Everything in `expected` must be in `actual`. Lists keep length: nothing
 * dropped or duplicated. App may add defaults: extra keys in `actual` are fine.
 * */
export interface Rules {
  /**
   * Keys app regenerates, compared by nothing.
   * */
  ignoreKeys: string[]
  /**
   * Lists whose entries are regenerated, so only their length is compared.
   * */
  lengthOnlyKeys: string[]
}

export const CRTDL_RULES: Rules = {
  /**
   * Group ids regenerate on upload.
   * */
  ignoreKeys: ['id'],
  /**
   * Keys holding regenerated ids.
   * */
  lengthOnlyKeys: ['linkedGroups'],
}

/**
 * Cast value to object.
 * */
const asObject = (value: unknown) => value as Record<string, unknown>

/**
 * List differences between expected and actual CRTDL.
 * */
export function differences(
  expected: unknown,
  actual: unknown,
  rules: Rules = CRTDL_RULES,
  path = '$'
): string[] {
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) return [`${path}: expected a list, got ${JSON.stringify(actual)}`]
    if (expected.length !== actual.length)
      return [`${path}: expected ${expected.length} entries, got ${actual.length}`]
    return expected.flatMap((item, index) =>
      differences(item, actual[index], rules, `${path}[${index}]`)
    )
  }
  if (expected !== null && typeof expected === 'object') {
    if (actual === null || typeof actual !== 'object')
      return [`${path}: expected an object, got ${JSON.stringify(actual)}`]
    return Object.keys(expected)
      .filter((key) => rules.ignoreKeys.indexOf(key) === -1)
      .flatMap((key) => {
        const want = asObject(expected)[key]
        const got = asObject(actual)[key]
        return rules.lengthOnlyKeys.indexOf(key) !== -1
          ? differences(
              (want as unknown[]).length,
              Array.isArray(got) ? got.length : got,
              rules,
              `${path}.${key}.length`
            )
          : differences(want, got, rules, `${path}.${key}`)
      })
  }
  return expected === actual
    ? []
    : [`${path}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`]
}
