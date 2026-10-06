/**
 * Pins the timezone for every test run. `TimeRestrictionTranslationService` derives dates from the local
 * timezone offset, so its output differs between machines (see docs/model-design-review.md, F9). The
 * app's users are in Europe/Berlin; the characterization tests record that behaviour.
 */
module.exports = async () => {
  process.env.TZ = 'Europe/Berlin'
}
