/**
 * The schema requires `afterDate` or `beforeDate`, or both (`anyOf`). The union below expresses that:
 * an empty restriction (`{}`) does not compile. Both dates are `YYYY-MM-DD` strings (`format: date`),
 * which the compiler cannot check; the Ajv test does.
 *
 * - `afterDate` only: from that day on.
 * - `beforeDate` only: up to that day.
 * - both: between the two days. The UI's "at" restriction is the same day twice.
 *
 * @see `$defs/timeRestriction` in the CCDL v1 schema.
 */
export type CCDLTimeRestriction =
  | { afterDate: string; beforeDate?: string }
  | { afterDate?: string; beforeDate: string }
