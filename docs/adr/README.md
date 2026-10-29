# Architecture decision records

One file per decision: `NNNN-short-title.md`, numbered from `0001`. Never renumber. To change a decision, add a new ADR and mark the old one `Superseded by NNNN`.

Use the terms from `GLOSSARY.md`. Write an ADR only when the decision is hard to reverse, surprising without context, or the result of a real trade-off.

## Template

```md
# NNNN. Title

Status: Proposed | Accepted | Superseded by NNNN
Date: YYYY-MM-DD

## Context

What forces the decision. Facts, not opinions.

## Decision

What we do. One short paragraph.

## Consequences

What gets easier, what gets harder, what we now must keep true.
```
