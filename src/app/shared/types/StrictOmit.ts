/**
 * `Omit` that fails to compile when the key does not exist on `T`.
 *
 * @template T - The type to remove a key from.
 * @template K - The key to remove. Must be a key of `T`.
 */
export type StrictOmit<T, K extends keyof T> = Omit<T, K>
