/** PASS / FAIL (code defect) / ERROR (environment). ponytail: jest and tsc ERROR detection matches output text, fix the patterns if wording changes. */
const classify = (tool, result) => {
  if (result.error) {
    return 'ERROR'
  }
  const output = `${result.stdout}\n${result.stderr}`
  if (result.status === 0) {
    return 'PASS'
  }
  switch (tool) {
    case 'eslint':
      return result.status === 1 ? 'FAIL' : 'ERROR'
    case 'prettier':
      return result.status === 1 || /SyntaxError/.test(output) ? 'FAIL' : 'ERROR'
    case 'tsc':
      return /error TS5\d{3}/.test(output) ? 'ERROR' : 'FAIL'
    case 'jest':
      return /^Tests:/m.test(output) ? 'FAIL' : 'ERROR'
    case 'depcruise':
      return /dependency violations/.test(output) ? 'FAIL' : 'ERROR'
    default:
      return 'FAIL'
  }
}

const reportLine = (label, status, detail = '') => `${label}: ${status}${detail ? ` (${detail})` : ''}`

const trimOutput = (text, maxChars = 3000) => (text.length > maxChars ? `${text.slice(0, maxChars)}\n... (trimmed)` : text)

module.exports = { classify, reportLine, trimOutput }
