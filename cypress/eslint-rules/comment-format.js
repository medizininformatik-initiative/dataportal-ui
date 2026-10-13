/**
 * Every comment is a multi-line block. Opening line alone, text lines, closing line with star-slash.
 * Tool directives (ts-comments, eslint-comments, triple-slash) are exempt.
 */
const BLOCK = /^\*\n(?:[ \t]*\* [^\n]*\S\n)+[ \t]*\* $/
const DIRECTIVE = /^\s*(?:@ts-|eslint-|\/ ?<reference)/

module.exports = {
  meta: { type: 'layout', schema: [] },
  create(context) {
    return {
      Program() {
        for (const comment of context.getSourceCode().getAllComments()) {
          if (DIRECTIVE.test(comment.value) || BLOCK.test(comment.value)) continue
          const message =
            comment.type === 'Line'
              ? 'No // comments. Use a /** ... */ block.'
              : 'Comment block shape: "/**" alone, " * text" lines, closing " * */", no trailing spaces.'
          context.report({ loc: comment.loc, message })
        }
      },
    }
  },
}
