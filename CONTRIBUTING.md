# Contributing

## Git Message Guidelines

Use a lightweight Conventional Commits format:

```text
<type>(<scope>): <subject>
```

The `scope` is optional, but use it when a change clearly belongs to one package, app, or documentation area.

Examples:

```text
feat(headless): add business keyboard core
fix(ui-taro): handle disabled key press
docs(site): add bilingual component docs
chore(workspace): update pnpm scripts
refactor(kits-taro): rename accounting calculator package
test(headless): cover malformed expressions
```

### Types

- `feat`: user-facing feature or new capability
- `fix`: bug fix
- `docs`: documentation-only change
- `style`: formatting or styling change that does not affect behavior
- `refactor`: code change that preserves behavior
- `test`: test-only change
- `chore`: maintenance change
- `build`: build system or dependency graph change
- `ci`: CI configuration change
- `perf`: performance improvement
- `revert`: revert a previous commit

### Common Scopes

- `headless`
- `ui-taro`
- `kits-taro`
- `facades-taro`
- `playground-web`
- `showcase-taro`
- `docs-site`
- `workspace`
- `architecture`

### Subject Rules

- Use imperative mood: `add`, `fix`, `update`, `rename`.
- Keep it concise and specific.
- Use lowercase after the type unless naming a proper noun.
- Do not end the subject with a period.

### Body and Footer

Use a body when the reason or impact is not obvious from the subject. Wrap body text around 72 characters when practical.

Use footers for breaking changes and issue references:

```text
BREAKING CHANGE: describe the migration path
Refs: #123
```

### Changesets

Run `pnpm changeset` for every publishable package change. Documentation-only, test-only, and internal tooling changes usually do not need a changeset unless they affect package consumers.

### Commit Template

This repository includes `.gitmessage`. To enable it in this checkout, run:

```bash
git config commit.template .gitmessage
```
