const isComment = (text) => /^\s*(\/\/|\/\*|\*|<!--)/.test(text)
const isTokenDefinition = (text) => /^\s*(--|\$)[\w-]+\s*:/.test(text)

/** Hardcoded colors and px spacing on added html/scss lines. ponytail: regex, no CSS parser. */
const check = ({ relPath, type, addedLines }) => {
  if (type !== 'html' && type !== 'scss') {
    return []
  }
  const warnings = []
  for (const { lineNumber, text } of addedLines) {
    if (isComment(text) || isTokenDefinition(text)) {
      continue
    }
    if (/(^|[^\w&])#[0-9a-fA-F]{3,8}\b/.test(text) || /\brgba?\(/.test(text)) {
      warnings.push(`${relPath}:${lineNumber} hardcoded color, use a --color-* token`)
    }
    if (/(margin|padding|gap)[\w-]*\s*:[^;]*\b\d+px/.test(text)) {
      warnings.push(`${relPath}:${lineNumber} px spacing, use $spacing-scale / --border-radius-* tokens`)
    }
  }
  return warnings
}

module.exports = { check }
