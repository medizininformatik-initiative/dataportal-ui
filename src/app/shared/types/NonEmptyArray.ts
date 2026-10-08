/**
 * An array with at least one element, as required by `minItems: 1` in the schema.
 * Empty arrays are not allowed. .map() returns a normal array,
 * so you need a cast or helper to use the result as a NonEmptyArray.
 *
 * @template T - The type of the elements.
 */
export type NonEmptyArray<T> = [T, ...T[]]

/**
 * Narrows an array to a non-empty array.
 * @param {T[]} items
 * @returns {boolean}
 */
export const isNonEmpty = <T>(items: T[]): items is NonEmptyArray<T> => items.length > 0
