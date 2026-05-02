# Contributing

Thanks for your interest in contributing to `prettier-plugin-bootstrap`!

## Getting started

```bash
pnpm install
pnpm run build
pnpm run test
```

## Development scripts

| Command | Description |
|---------|-------------|
| `pnpm run build` | Build the plugin |
| `pnpm run test` | Run tests |
| `pnpm run test:coverage` | Run tests with coverage |
| `pnpm run lint` | Run ESLint |
| `pnpm run typecheck` | Run TypeScript type check |

## Submitting a PR

1. Fork the repo and create a branch from `main`.
2. Make your changes with clear, conventional commit messages (`feat:`, `fix:`, etc.).
3. Ensure all checks pass: `pnpm run lint && pnpm run typecheck && pnpm run test`.
4. All commits must be signed off (DCO). Use `git commit -s` to add the `Signed-off-by` line.

## DCO (Developer Certificate of Origin)

This project requires a DCO sign-off on every commit. This certifies that you have the right to submit the code under the project's open-source license.

Add `-s` to your commits:

```bash
git commit -s -m "feat: add something"
```

This adds a `Signed-off-by: Your Name <your@email.com>` line to the commit message.
