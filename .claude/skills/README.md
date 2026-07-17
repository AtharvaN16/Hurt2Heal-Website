# Project skills

Claude Code discovers skills at `.claude/skills/<name>/SKILL.md`. These are committed
to the repo so every session (and every collaborator) gets the same set.

The same skill set is duplicated at `.agents/skills/` for any other agent-agnostic
harness (Codex, Cursor, etc. that follow the `.agents/skills/` convention). The two
trees are kept in sync manually — if you add/update a skill here, mirror the change
there too (see that folder's own README for details).

## Sources

- **mattpocock-skills** — engineering + productivity skills, vendored from
  [mattpocock/skills](https://github.com/mattpocock/skills) (MIT, see
  `_licenses/mattpocock-skills-LICENSE-MIT.txt`). Only the "promoted" buckets
  (`engineering/`, `productivity/`) were pulled in — the upstream repo also has
  `misc/`, `personal/`, `in-progress/`, and `deprecated/` buckets that its own
  maintainer marks as not for reuse, so those were skipped.
- **impeccable** — frontend/visual design discipline (polish, audit, critique,
  animate, etc.), vendored from [pbakaus/impeccable](https://github.com/pbakaus/impeccable)
  (Apache-2.0, see `_licenses/impeccable-LICENSE-APACHE2.txt`).
- **superpowers** — brainstorming, TDD, systematic-debugging, plan execution, etc.
  Installed as a global Claude Code plugin (not vendored here) — already active for
  every session on this machine. No project-level files needed.

## Vendored skill list

| Skill | Source | Invocation |
|---|---|---|
| ask-matt | mattpocock | user |
| code-review | mattpocock | model |
| codebase-design | mattpocock | model |
| diagnosing-bugs | mattpocock | model |
| domain-modeling | mattpocock | model |
| grill-with-docs | mattpocock | user |
| implement | mattpocock | user |
| improve-codebase-architecture | mattpocock | user |
| prototype | mattpocock | model |
| research | mattpocock | model |
| resolving-merge-conflicts | mattpocock | model |
| setup-matt-pocock-skills | mattpocock | user |
| tdd | mattpocock | model |
| to-spec | mattpocock | user |
| to-tickets | mattpocock | user |
| triage | mattpocock | user |
| wayfinder | mattpocock | user |
| grill-me | mattpocock | user |
| grilling | mattpocock | model |
| handoff | mattpocock | user |
| teach | mattpocock | user |
| writing-great-skills | mattpocock | user |
| impeccable | pbakaus | user (`/impeccable ...` commands) |

Re-sync by re-running the clone-and-copy steps against the upstream repos' latest
commits; there's no submodule/symlink wiring, so updates are a manual re-vendor.
