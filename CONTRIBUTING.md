# Contributing

Thanks for your interest in contributing to `prettier-plugin-bootstrap`!

## Getting started

```bash
git clone https://github.com/pierluigilenoci/prettier-plugin-bootstrap.git
cd prettier-plugin-bootstrap
pnpm install
pnpm run build
pnpm run test
```

## Development scripts

| Command                  | Description               |
| ------------------------ | ------------------------- |
| `pnpm run build`         | Build the plugin          |
| `pnpm run test`          | Run tests                 |
| `pnpm run test:coverage` | Run tests with coverage   |
| `pnpm run lint`          | Run ESLint                |
| `pnpm run typecheck`     | Run TypeScript type check |

## Project structure

```
src/
  class-order.ts    # Bootstrap 5 class sort order and sorting logic
  class-order-v4.ts # Bootstrap 4 class sort order and sorting logic
  index.ts          # Prettier plugin entry point (options, parser wrappers)
  sorter.ts         # Public programmatic API (createSorter factory)
  sorting.ts        # Core sortClassString() implementation
  traversal.ts      # AST traversal for all supported parsers
  types.ts          # Shared TypeScript type definitions
tests/
  class-order.test.ts     # Unit tests for Bootstrap 5 sort order
  class-order-v4.test.ts  # Unit tests for Bootstrap 4 sort order
  coverage.test.ts        # Edge-case / branch-coverage tests
  e2e.test.ts             # End-to-end prettier.format() tests
  fixtures.test.ts        # Fixture-file formatting tests
  integration.test.ts     # Integration tests for realistic class lists
  snapshot.test.ts        # Inline snapshot tests for output stability
  sorter.test.ts          # Tests for the public sorter API
```

## Good first issues

Looking for a place to start? Check the issues labeled [`good first issue`](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).

Some concrete examples:

- **Add a missing Bootstrap class** — if you find a Bootstrap 5 utility not sorted correctly, open a PR adding it to `CLASS_ORDER` in `src/class-order.ts`.
- **Improve docs** — fix typos, add examples, or clarify an existing section in the README.
- **Add a test** — find an untested edge case and write a test in `tests/integration.test.ts`.

## Submitting a PR

1. Fork the repo and create a branch from `main`.
2. Make your changes with clear, conventional commit messages (`feat:`, `fix:`, `docs:`, etc.).
3. Ensure all checks pass: `pnpm run lint && pnpm run typecheck && pnpm run test`.
4. All commits must be signed off (DCO). Use `git commit -s` to add the `Signed-off-by` line.
5. Open the PR against `main` and fill in the PR template.

## DCO (Developer Certificate of Origin)

This project requires a DCO sign-off on every commit. This certifies that you have the right to submit the code under the project's open-source license.

Add `-s` to your commits:

```bash
git commit -s -m "feat: add something"
```

This adds a `Signed-off-by: Your Name <your@email.com>` line to the commit message.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).
