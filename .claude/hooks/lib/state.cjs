const { createHash } = require('node:crypto')
const { existsSync, readFileSync, writeFileSync } = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { getHead } = require('./git-changes.cjs')
const { ROOT } = require('./paths.cjs')

const stateFile = (sessionId) => path.join(os.tmpdir(), `dod-${String(sessionId).replace(/[^\w-]/g, '_')}.json`)

/** State of earlier Stops. Missing or broken file -> defaults, never throws. */
const loadState = (sessionId) => {
  const defaults = { base: getHead(), attempts: 0, lastPassHash: null, lastFailures: [] }
  try {
    return { ...defaults, ...JSON.parse(readFileSync(stateFile(sessionId), 'utf8')) }
  } catch {
    return defaults
  }
}

const saveState = (sessionId, state) => writeFileSync(stateFile(sessionId), JSON.stringify(state))

/** Hash of the file list + file contents. */
const fingerprint = (files) => {
  const hash = createHash('sha1')
  for (const file of [...files].sort()) {
    const absolute = path.join(ROOT, file)
    hash.update(file).update(existsSync(absolute) ? readFileSync(absolute) : '')
  }
  return hash.digest('hex')
}

module.exports = { loadState, saveState, fingerprint }
