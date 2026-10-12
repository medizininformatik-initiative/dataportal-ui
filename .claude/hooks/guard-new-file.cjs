const { existsSync } = require('node:fs')
const path = require('node:path')
const { readInput } = require('./lib/input.cjs')
const { deny } = require('./lib/output.cjs')
const { ROOT, toRepoPath } = require('./lib/paths.cjs')

const PASCAL = /^[A-Z][A-Za-z0-9]*$/
const toPascal = (name) =>
  name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('')

const filePath = readInput().tool_input?.file_path
const relPath = filePath && toRepoPath(filePath)
if (!relPath || !/^src\/app\/(service|model|core)\/.+\.ts$/.test(relPath) || existsSync(path.join(ROOT, relPath))) {
  process.exit(0)
}

const problems = []
const stem = path.basename(relPath).split('.')[0]
if (stem !== 'index' && !PASCAL.test(stem)) {
  problems.push(`file name '${path.basename(relPath)}' -> '${path.basename(relPath).replace(stem, toPascal(stem))}'`)
}
if (relPath.startsWith('src/app/service/')) {
  const segments = path.dirname(relPath).split('/').slice(3)
  segments.forEach((segment, i) => {
    const folder = path.join(ROOT, 'src/app/service', ...segments.slice(0, i + 1))
    if (!existsSync(folder) && !PASCAL.test(segment)) {
      problems.push(`new folder '${segment}' -> '${toPascal(segment)}'`)
    }
  })
}
if (problems.length > 0) {
  deny(`New files in service/, model/, core/ need PascalCase names (CLAUDE.md). Rename: ${problems.join('; ')}`)
}
