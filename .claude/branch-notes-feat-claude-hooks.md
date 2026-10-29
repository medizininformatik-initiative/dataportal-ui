# Notes: merging `feat/claude-hooks` into `develop`

Review date: 2026-10-29. Status per item: `open`, `done`.

## Blockers

- **B1 (open) CI lint fails.** `npm run lint` reports 916 errors in `src/**/*.ts`: 854 `@typescript-eslint/explicit-member-accessibility`, 57 `member-delimiter-style`, 5 `brace-style`. `develop` has no `explicit-member-accessibility` rule; this branch adds it as `error`. CLAUDE.md describes it as a warning that the Stop hook promotes on changed files.
  - Option A (recommended): set it to `warn`, fix `member-delimiter-style` and `brace-style` (probably auto-fixable).
  - Option B: fix all 854 first (codemod or by hand, `--fix` cannot do it).
- **B2 (open) Hooks are not registered.** `.claude/hooks/*.cjs` is committed, but there is no `.claude/settings.json`. `settings.local.json` is gitignored and has `"hooks": {}`. `guard-bash`, `guard-new-file`, `post-edit`, `stop-check`, `session-info` and `cycle-reset` never run. Fix: commit a `.claude/settings.json` with the hook entries.

## Merge with develop

- **M1 (in progress) Merge `origin/develop` into the branch.** 6 conflicts resolved: `CHANGELOG.md` (kept develop's v7.3.3 entry), `cypress/support/step_definitions/crtdlRoundtrip.cy.ts` (develop's class version, imports pointed at `test-support/crtdl/`), and `test-support/crtdl/{cases,describe,groups,ontology}.ts` (develop's side, then `prettier --write` at print width 140). `tsc` passes for `tsconfig.app.json` and `cypress/tsconfig.json`. Merge commit not made yet: the pre-commit hook fails on develop's own cypress files (see T6).

## To-dos

- **T1 (open)** `.claude/rules/changelog.md` is missing. CLAUDE.md says it loads when `CHANGELOG.md` is touched.
- **T2 (open)** `docs/adr/` is missing, but CLAUDE.md and `docs/agents/domain.md` point to it.
- **T3 (open)** Husky: `package.json` uses the husky v4 config (`^4.3.8`), `node_modules/husky` only has `bin`, no `.husky/` folder. Check that the pre-commit hook is installed for everybody. (It did run during the merge commit.)
- **T4 (open)** lint-staged glob `src/**/*.{ts}` has a single-value brace. lint-staged warns and rewrites it to `src/**/*.ts`; change it in `package.json`.
- **T5 (open)** `dependency-cruiser` is in `package.json` but not installed in `node_modules`, and nothing runs `.dependency-cruiser.cjs` in CI. Install it and add an npm script or CI step.
- **T6 (open)** After the merge, lint-staged (develop's new config) runs `eslint --max-warnings=0` on `cypress/**/*.ts`. Existing cypress files have many warnings (`jsdoc/require-param`, `typedef`, `import/order`) and one error (`restrict-template-expressions` in `cypress/e2e/Utilities/pathResolver.ts:35`). Every commit that touches those files will fail until they are fixed, or the rule is limited to changed lines.
- **T7 (open)** `ci.yml` step "Run Tests" only exports `NODE_OPTIONS` and never runs `npm test`. Already like this on `develop`; Jest specs are not checked in CI.
- **T8 (open)** `prettier --check` flags 10 files (hook `.cjs` files, `tsconfig.app.json`, `tsconfig.spec.json`). Run `prettier --write` on them.
- **T9 (open)** `.claude/hooks/IDEAS.md` (764 lines) holds `todo` and `have` items. Decide: commit it, or move it out of the repo. Go through the `todo` entries.
- **T10 (open)** `npx jest src/app/model/CohortDefinition` fails with `Cannot find module '@jest/globals'`. It is declared in `package.json` (line 71) but missing in `node_modules`. Run `npm install`, then re-run the spec.

## Known and accepted

- `tsconfig.strict.json` gives 404 errors repo-wide. Expected: the Stop hook only checks changed files.
- Hook tests: 11 of 11 pass. `ponytail:` markers in the hooks are documented ceilings, not to-dos.

## Order

1. Finish M1 (merge commit).
2. B1, then B2.
3. T4, T8, T3, T10, then T1, T2, T5, T6, T7, T9.
4. Re-run `npm run lint`, `npm test`, `tsc`.
