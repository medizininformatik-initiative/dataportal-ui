const { getAddedLines } = require('./git-changes.cjs')
const { RULE_HINTS } = require('./hints.cjs')
const { ROOT } = require('./paths.cjs')

/**
 * Flattens `eslint --format json` and keeps only messages on lines the session added.
 * A message with a range counts if any line in the range was added. Parse errors always stay.
 * ponytail: line-based; a rule that reports on an unchanged line (e.g. function head) misses body-only edits.
 */
const collectMessages = (eslintJson) =>
  eslintJson.flatMap((file) => {
    const relPath = file.filePath.replace(`${ROOT}/`, '')
    const added = new Set(getAddedLines(relPath).map((l) => l.lineNumber))
    return file.messages
      .filter((m) => m.ruleId === null || [...Array(Math.max(1, (m.endLine ?? m.line) - m.line + 1)).keys()].some((i) => added.has(m.line + i)))
      .map((m) => ({ relPath, line: m.line, column: m.column, ruleId: m.ruleId, message: m.message, severity: m.severity }))
  })

const formatMessage = (m) => `${m.relPath}:${m.line}:${m.column} ${m.message} [${m.ruleId ?? 'parse'}]`

/** One group per rule: count plus the first `examples` locations. Keeps one noisy rule from hiding the others. */
const summarize = (messages, examples = 3) => {
  const byRule = new Map()
  for (const m of messages) {
    byRule.set(m.ruleId ?? 'parse', [...(byRule.get(m.ruleId ?? 'parse') ?? []), m])
  }
  return [...byRule.entries()].flatMap(([rule, list]) => [
    `${rule} x${list.length}${RULE_HINTS[rule] ? ` - ${RULE_HINTS[rule]}` : ''}`,
    ...list.slice(0, examples).map((m) => `  ${m.relPath}:${m.line}:${m.column} ${m.message}`),
    ...(list.length > examples ? [`  ... ${list.length - examples} more`] : []),
  ])
}

module.exports = { collectMessages, formatMessage, summarize }
