const { readInput } = require('./lib/input.cjs')
const { loadState, saveState } = require('./lib/state.cjs')

const sessionId = readInput().session_id || 'unknown'
saveState(sessionId, { ...loadState(sessionId), attempts: 0 })
