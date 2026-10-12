const { readFileSync } = require('node:fs')

/** Reads the hook JSON from stdin once. Returns {} if empty or invalid. */
const readInput = () => {
  try {
    return JSON.parse(readFileSync(0, 'utf8') || '{}')
  } catch {
    return {}
  }
}

module.exports = { readInput }
