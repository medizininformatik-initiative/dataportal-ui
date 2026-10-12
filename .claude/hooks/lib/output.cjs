const print = (object) => {
  console.log(JSON.stringify(object))
  process.exit(0)
}

const allow = () => process.exit(0)
const addContext = (hookEventName, additionalContext) => print({ hookSpecificOutput: { hookEventName, additionalContext } })
const blockStop = (reason) => print({ decision: 'block', reason })
const notify = (systemMessage) => print({ systemMessage })
const deny = (reason) => {
  process.stderr.write(`${reason}\n`)
  process.exit(2)
}

module.exports = { allow, addContext, blockStop, notify, deny }
