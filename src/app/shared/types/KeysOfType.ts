/**
 * The keys of `T` whose property type is assignable to `V`.
 *
 * @template T - The type to read the keys from.
 * @template V - The property type to look for.
 */
export type KeysOfType<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T]
