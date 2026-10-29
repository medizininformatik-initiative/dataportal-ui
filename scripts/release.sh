#!/usr/bin/env bash
# Release steps from DEVELOPMENT.md. Run from the repo root, `gh` must be authenticated.
#   scripts/release.sh prepare <version>   e.g. 7.3.4: branch, version bump, changelog, commit, optional push + PR
#   scripts/release.sh publish <version>   after the PR is merged: tag the merge commit on main, push, GitHub release
# The milestone must be called exactly <version> (it feeds scripts/changelog-draft.sh).
# Merging the PR stays manual. Every push and every GitHub write asks first.
# ponytail: the Docker image tag comes from the git tag in ci.yml, so no image name is rewritten here.
set -euo pipefail

repo=medizininformatik-initiative/dataportal-ui
version_files=(docker/deploy-config.json src/assets/config/config.dev.json) # `"version": "x.y.z"`, as in every past release commit

mode=${1:-}
v=${2:-}
[[ $mode =~ ^(prepare|publish)$ && $v =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { sed -n '2,4p' "$0"; exit 1; }

confirm() { read -r -p "$1 [y/N] " a && [[ $a == y ]]; }

changelog_section() { # prints the "## v$v" block without its heading
  awk -v h="## v$v " 'index($0, h) == 1 {on = 1; next} on && /^## v/ {exit} on' CHANGELOG.md
}

prepare() {
  [ -z "$(git status --porcelain)" ] || { echo "Working tree not clean."; exit 1; }
  grep -q "^## v$v " CHANGELOG.md && { echo "CHANGELOG.md already has v$v."; exit 1; }

  draft=$(scripts/changelog-draft.sh "$v")
  [ "$(printf '%s\n' "$draft" | wc -l)" -gt 2 ] || { echo "Milestone $v has no closed issues."; exit 1; }

  git switch -c "release-v$v"
  for f in "${version_files[@]}"; do
    sed -i -E "s/(\"version\": \")[0-9.]+(\")/\1$v\2/" "$f"
  done
  { head -n 2 CHANGELOG.md; printf '%s\n\n\n\n' "$draft"; tail -n +3 CHANGELOG.md; } > CHANGELOG.md.new
  mv CHANGELOG.md.new CHANGELOG.md

  git add CHANGELOG.md "${version_files[@]}"
  git commit --no-verify -q -m "Release v$v" # hooks lint every touched file, a release only edits version strings
  echo "Committed Release v$v on release-v$v. Review the changelog wording: git show"

  if confirm "Push release-v$v and open a PR into main?"; then
    git push -u origin "release-v$v"
    gh pr create --repo "$repo" --base main --head "release-v$v" --title "Release v$v" --body "Release v$v. See CHANGELOG.md."
  fi
}

publish() {
  [ "$(git branch --show-current)" = main ] || { echo "Check out main first."; exit 1; }
  git pull --ff-only
  grep -q "\"version\": \"$v\"" "${version_files[0]}" || { echo "main does not hold v$v yet: is the PR merged?"; exit 1; }
  # the merge commit is HEAD of main only if nothing was merged after it
  git log -1 --format='Tag %h: %s' && confirm "Tag v$v on this commit, push the tag and create the GitHub release?" || exit 1
  git tag "v$v"
  git push origin "v$v"
  changelog_section | gh release create "v$v" --repo "$repo" --title "v$v" --notes-file -
}

"$mode"
