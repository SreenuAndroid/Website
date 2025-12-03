---
description: Format, stage, and commit all changes with a concise message
---

Commit all staged and unstaged changes with a concise 1-line commit message.

Steps:

1. Run `npx prettier --write .` to format all files before committing
2. Stage all changes (including formatted files)
3. Commit with message

Rules:

- Format: `app-name: message` (detect app name from current working directory)
- Message describes structure/what was done, not code details
- Keep under 72 characters
- No Co-Authored-By or Claude mentions
