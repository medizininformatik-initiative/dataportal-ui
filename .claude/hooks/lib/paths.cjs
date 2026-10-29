const { existsSync, realpathSync } = require('node:fs')
const path = require('node:path')

const ROOT = process.env.CLAUDE_PROJECT_DIR || process.cwd()

/** realpath of the nearest existing parent, then the remaining segments appended. */
const realish = (absolute) => {
  let current = absolute
  const rest = []
  while (!existsSync(current) && path.dirname(current) !== current) {
    rest.unshift(path.basename(current))
    current = path.dirname(current)
  }
  return path.join(realpathSync(current), ...rest)
}

/** Any path -> repo-relative path, or null if outside the repo. */
const toRepoPath = (filePath) => {
  const absolute = path.resolve(ROOT, filePath)
  const relative = path.relative(realpathSync(ROOT), realish(absolute))
  return relative.startsWith('..') || path.isAbsolute(relative) ? null : relative
}

const isIgnoredPath = (relPath) => /^(node_modules|dist|coverage)(\/|$)/.test(relPath)

module.exports = { ROOT, toRepoPath, isIgnoredPath }
