---
paths:
  - CHANGELOG.md
---

# Changelog format

Newest release on top, directly under `# Changelog`. Read the top two releases before you edit; match them.

## Release heading

`## vMAJOR.MINOR.PATCH (YYYY-MM-DD)`. Three blank lines between releases.

## Sections

Use only these, in this order, and skip empty ones:

1. `### Added` (older releases: `### Feature`, `### Features`)
2. `### Changed`
3. `### Fixed` (older releases: `### Bugfix`, `### Bug Fixes`)
4. `### Security`

Do not rename old sections. Use the new names in new entries. A minor release may list bullets without a section heading (see v7.3.0).

## Entries

- One bullet per change, `* ` marker, past tense, English, one sentence.
- Describe what the user sees, not the code you touched. Code names in backticks.
- Link the GitHub issue at the end: `[#641](https://github.com/medizininformatik-initiative/dataportal-ui/issues/641)`. No issue: no link.
- No `Co-Authored-By` or tool names.

## Releasing

The release commit adds the heading and the date (`Release vX.Y.Z`). Do not bump `version` in `package.json` for a normal change.

Example:

```md
## v7.3.2 (2026-10-09)

### Fixed
* Fixed an issue preventing `onlyIfReferenced` from being set [#641](https://github.com/medizininformatik-initiative/dataportal-ui/issues/641)

### Changed
* Cleaned up the spacing system in `styles.scss` [#639](https://github.com/medizininformatik-initiative/dataportal-ui/issues/639)
```
