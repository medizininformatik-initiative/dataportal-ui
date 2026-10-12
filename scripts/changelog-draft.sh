#!/usr/bin/env bash
# Prints a draft CHANGELOG.md entry for a milestone (default: highest-numbered one).
# Usage: scripts/changelog-draft.sh [milestone-title]
# Needs: gh (authenticated). Issue titles are sorted by keyword, so review the draft.
set -euo pipefail

repo=medizininformatik-initiative/dataportal-ui
title=${1:-$(gh api "repos/$repo/milestones?state=all&per_page=100" --jq 'max_by(.number).title')}

issues=$(gh issue list --repo "$repo" --milestone "$title" --state closed --limit 200 \
  --json number,title --jq '.[] | "\(.number)\t\(.title)"')

# ponytail: keyword heuristic, no labels; upgrade to labels if the team labels bugs
section() { # $1 = heading, $2 = title regex
  local lines
  lines=$(printf '%s\n' "$issues" | awk -F'\t' -v re="$2" -v neg="${3:-}" \
    'BEGIN{IGNORECASE=1} $2 ~ re && !($2 ~ neg && neg != "") {
       printf "* %s [#%s](https://github.com/'"$repo"'/issues/%s)\n", $2, $1, $1 }')
  [ -n "$lines" ] && printf '### %s\n%s\n\n' "$1" "$lines"
  return 0
}

fixed='^fix|bug|wrong|cannot|disappear|error|broken|missing'
added='^(add|introduc|support|implement)'

printf '## v%s (%s)\n\n' "$title" "$(date +%F)"
section Features "$added" "$fixed"
section Fixed "$fixed"
section Changed '.' "$fixed|$added" # everything left over
