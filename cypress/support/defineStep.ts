import { defineStep as define } from '@badeball/cypress-cucumber-preprocessor'
import { resolve } from './testData'

/**
 * `defineStep` that runs `resolve()` on every string argument first, so any step
 * accepts `{{group.key}}` placeholders from `test-data/concepts.json`. Resolving is
 * idempotent, so steps that also call `resolve()` themselves keep working.
 */
export const defineStep: typeof define = (pattern, fn) =>
  define(pattern, function (this: unknown, ...args: unknown[]) {
    return (fn as (...a: unknown[]) => unknown).apply(
      this,
      args.map((a) => (typeof a === 'string' ? resolve(a) : a))
    )
  } as typeof fn)
