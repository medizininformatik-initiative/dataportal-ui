/**
 * Same selector root used twice in one file: extract it to a const and build on it. Root = first
 * token of the selector (`.box` of `.box .row`), so `.box`, `.box .row` and `.box .name` count as
 * three uses of `.box`, not three different strings. Checked: first argument of `cy.get`, `.find`,
 * `.closest`, `.filter`, `.children`, `.parents`, and of `.contains` when it has 2 arguments
 * (selector, text). Static strings, and template literals up to their first `${}`. Bare tags
 * (`td`) and attribute-only selectors (`[role="tab"]`) are too generic to name and are skipped.
 */
const GENERIC = /^(?:[a-z][a-z0-9]*|\[[^\]]+\])$/
const QUERIES = new Set(['find', 'closest', 'filter', 'children', 'parents'])

/**
 * First token of selector, or null when the token is cut off by `${}` or is a bare tag/attribute.
 */
const rootOf = (node) => {
  let text
  let complete = true
  if (node.type === 'Literal' && typeof node.value === 'string') text = node.value
  else if (node.type === 'TemplateLiteral') {
    text = node.quasis[0].value.cooked
    complete = node.expressions.length === 0
  } else return null
  text = text.trimStart()
  const token = text.split(/[\s>+~,]/)[0]
  const cutOff = !complete && token.length === text.length
  if (!token || cutOff || token.startsWith('@') || GENERIC.test(token)) return null
  return token
}

module.exports = {
  meta: { type: 'suggestion', schema: [] },
  create(context) {
    const seen = new Set()
    return {
      CallExpression(node) {
        const callee = node.callee
        if (callee.type !== 'MemberExpression' || callee.computed || !node.arguments.length) return
        const name = callee.property.name
        const isQuery =
          (name === 'get' && callee.object.name === 'cy') ||
          QUERIES.has(name) ||
          (name === 'contains' && node.arguments.length >= 2)
        if (!isQuery) return
        const root = rootOf(node.arguments[0])
        if (!root) return
        if (seen.has(root)) {
          context.report({
            node: node.arguments[0],
            message: `Selector root "${root}" is already used in this file. Extract it to a const and build on it (see cypress/CLAUDE.md).`,
          })
        }
        seen.add(root)
      },
    }
  },
}
