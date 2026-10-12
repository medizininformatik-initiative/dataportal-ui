/** Raw data-cy on added html lines; templates must use numDataCy. */
const check = ({ relPath, type, addedLines }) =>
  type !== 'html'
    ? []
    : addedLines.filter((l) => /(\[attr\.)?data-cy/.test(l.text)).map((l) => `${relPath}:${l.lineNumber} raw data-cy, use the numDataCy directive`)

module.exports = { check }
