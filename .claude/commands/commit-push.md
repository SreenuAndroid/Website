---
description: Format, commit, and push all changes
---

Format, commit all changes, and push to remote repository.

Steps:

1. Run `npx prettier --write .` to format all files
2. Stage all changes with `git add .`
3. Commit with a concise message
4. Push to remote with `git push`

Rules for commit message:

- Format: `app-name: message` (detect app name from current working directory)
- Message describes structure/what was done, not code details
- Keep under 72 characters
- No Co-Authored-By or Claude mentions
