const { existsSync, readFileSync } = require('node:fs')
const path = require('node:path')
const { run } = require('./run-command.cjs')
const { ROOT } = require('./paths.cjs')

const lines = (result) => (result.stdout || '').split('\n').filter(Boolean)

const getHead = () => (run('git', ['rev-parse', 'HEAD'], 10000).stdout || '').trim() || 'HEAD'

/** Edited tracked files plus new untracked files, no deleted files. */
const getChangedFiles = (base) => {
  const edited = lines(run('git', ['diff', '--name-only', '--diff-filter=d', base], 30000))
  const added = lines(run('git', ['ls-files', '-o', '--exclude-standard'], 30000))
  return [...new Set([...edited, ...added])]
}

const isUntracked = (relPath) => run('git', ['ls-files', '--error-unmatch', relPath], 10000).status !== 0

/** Added lines vs HEAD as [{lineNumber, text}]. An untracked file counts as all lines. */
const getAddedLines = (relPath) => {
  const file = path.join(ROOT, relPath)
  if (!existsSync(file)) {
    return []
  }
  if (isUntracked(relPath)) {
    return readFileSync(file, 'utf8')
      .split('\n')
      .map((text, i) => ({ lineNumber: i + 1, text }))
  }
  const added = []
  let lineNumber = 0
  for (const line of (run('git', ['diff', '-U0', 'HEAD', '--', relPath], 30000).stdout || '').split('\n')) {
    const hunk = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)/)
    if (hunk) {
      lineNumber = Number(hunk[1])
    } else if (line.startsWith('+') && !line.startsWith('+++')) {
      added.push({ lineNumber: lineNumber++, text: line.slice(1) })
    }
  }
  return added
}

const isNewFile = (relPath, base) =>
  isUntracked(relPath) || lines(run('git', ['diff', '--name-only', '--diff-filter=A', base, '--', relPath], 10000)).length > 0

module.exports = { getHead, getChangedFiles, getAddedLines, isNewFile }
