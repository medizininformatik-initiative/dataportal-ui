# Retro of the Referenzen planning session: global setup findings

Written 2026-10-20. Belongs to `PLAN-references-tab.md`. The three repo-level findings (navigation pointer, DevTools recipe, existing checks) are in Phase E and Phase 1/4 of that plan. The findings below concern Shah's global Claude Code setup (`~/.claude`) and are not part of the refactor. None of them is applied yet.

## 1. Output style conflicts with `~/.claude/CLAUDE.md`

The Explanatory output style asks for an insight block before and after every code step. `~/.claude/CLAUDE.md` asks for ultracaveman answers and no narration. In the session the insight blocks appeared in the first turns and then faded, so the behavior was neither one nor the other.

Suggested fix: remove the Explanatory output style, or add one positive line to `~/.claude/CLAUDE.md`, for example "Insight blocks: only on request." Decision belongs to Shah.

## 2. Hook noise on every prompt

- `~/.claude/hooks/wispr-recent.sh` injects the dictations of the last 15 minutes on every prompt. Most lines repeat prompts that are already in the conversation, so the context grows by about ten lines per turn with nothing new in them.
- The inline `UserPromptSubmit` hook "Shah profile: if this turn teaches..." fires every turn and was skipped almost every time.

Suggested fix: let the Wispr hook emit only dictations newer than the previous prompt, at most three lines, truncated. Move the profile reminder to `SessionStart`, or only emit it when the prompt contains a question word such as "explain" or "what is". Settings live in `~/.claude/settings.json` (`hooks.UserPromptSubmit`).

## 3. Unquoted globs fail in zsh

Three `grep` calls with an unquoted `--include=*.html` aborted with "no matches found" because zsh expands the glob before `grep` runs.

Suggested fix: one line in `~/.claude/CLAUDE.md`: "Quote globs in shell commands (zsh aborts on no match)." Low priority.

## 4. Auto mode classifier returned "no verdict"

About six tool calls (Edit, Bash, DevTools) were refused with "classifier gave no verdict" and needed a retry. This is a transient failure of the service, not something the repo or the global files can fix. No action, listed for completeness.
