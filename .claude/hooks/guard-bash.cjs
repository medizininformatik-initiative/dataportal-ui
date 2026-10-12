const { readInput } = require('./lib/input.cjs')
const { deny } = require('./lib/output.cjs')

const BLOCKED = [
  [/\bgit\s+commit\b[^|;&]*(--no-verify|\s-[a-zA-Z]*n[a-zA-Z]*\b)/, 'git commit --no-verify skips the pre-commit hook'],
  [/\bgit\s+push\b[^|;&]*(\s--force(?!-with-lease)\b|\s-f\b|\s\+\w)/, 'git push --force can destroy remote history'],
  [/\bgit\s+push\b[^|;&]*--delete\b/, 'git push --delete removes a remote branch'],
  [/\bgit\s+reset\s+[^|;&]*--hard/, 'git reset --hard discards work'],
  [/\bgit\s+(checkout\s+(--\s+)?|restore\s+)\.(\s|$)/, 'git checkout/restore . discards work'],
  [/\bgit\s+clean\s+[^|;&]*-[a-zA-Z]*f/, 'git clean -f deletes untracked files'],
  [/\brm\s+(-[a-zA-Z]*[rR][a-zA-Z]*f|-[a-zA-Z]*f[a-zA-Z]*[rR])\b/, 'rm -rf deletes without a way back'],
  [/\brm\s+(-[a-zA-Z]+\s+)*(-[rR]|--recursive)\s+(-[a-zA-Z]+\s+)*(-f|--force)\b/, 'rm -r -f deletes without a way back'],
  [/\brm\s+(-[a-zA-Z]+\s+)*(-f|--force)\s+(-[a-zA-Z]+\s+)*(-[rR]|--recursive)\b/, 'rm -f -r deletes without a way back'],
  [/\brm\s+[^|;&]*--recursive[^|;&]*--force|\brm\s+[^|;&]*--force[^|;&]*--recursive/, 'rm --recursive --force deletes without a way back'],
]

/**
 * Drops heredoc bodies and quoted strings, so a commit message or file content that mentions
 * `rm -rf` is not a hit. A string after `-c` / eval is kept: that is code the shell runs.
 * ponytail: regex, not a shell parser; `echo "$(rm -rf x)"` slips through.
 */
const stripText = (text) =>
  text
    .replace(/<<-?\s*(['"]?)(\w+)\1[^\n]*\n[\s\S]*?\n\s*\2\b/g, '')
    .replace(/(\s-c\s+|\beval\s+)?(['"])(?:\\.|(?!\2)[^\\])*\2/g, (match, runs) => (runs ? match : '""'))

const command = stripText(readInput().tool_input?.command ?? '')
const hit = BLOCKED.find(([pattern]) => pattern.test(command))
if (hit) {
  deny(`Blocked: ${hit[1]}. Ask Shah first, or use a safer command.`)
}
