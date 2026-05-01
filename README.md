# prettier-plugin-bootstrap

[![CI](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/actions/workflows/ci.yml/badge.svg)](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/prettier-plugin-bootstrap)](https://www.npmjs.com/package/prettier-plugin-bootstrap)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A [Prettier](https://prettier.io/) plugin that automatically sorts Bootstrap CSS classes following the framework's recommended order.

Works with **HTML**, **JSX/TSX**, **Vue**, **Angular**, and **Astro** templates.

## Installation

```bash
npm install -D prettier-plugin-bootstrap
# or
pnpm add -D prettier-plugin-bootstrap
# or
yarn add -D prettier-plugin-bootstrap
```

## Usage

Add the plugin to your Prettier configuration:

```json
{
  "plugins": ["prettier-plugin-bootstrap"]
}
```

That's it! Your Bootstrap classes will now be automatically sorted on format.

### Before

```html
<div class="text-center p-3 container bg-primary text-white mb-4 rounded"></div>
```

### After

```html
<div class="container bg-primary text-center text-white mb-4 p-3 rounded"></div>
```

## Sorting Order

Classes are sorted following Bootstrap's architecture:

1. **Layout** — containers, grid, columns
2. **Reboot / Typography** — headings, lead, display
3. **Images** — img-fluid, figures
4. **Tables** — table variants
5. **Forms** — form controls, selects, checks
6. **Buttons** — btn variants
7. **Components** — dropdowns, navs, cards, modals, etc. (alphabetical)
8. **Helpers** — clearfix, stacks, visually-hidden
9. **Utilities** — following the order in `scss/_utilities.scss`

Within each group, responsive variants (`sm`, `md`, `lg`, `xl`, `xxl`) sort after the base class.

Unknown classes are preserved in their original relative order and placed after all known Bootstrap classes.

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `bootstrapAttributes` | `string[]` | `[]` | Additional HTML attributes to sort (beyond `class` and `className`) |
| `bootstrapFunctions` | `string[]` | `[]` | Function names whose arguments are class lists (e.g. `clsx`, `classNames`) |

### Example

```json
{
  "plugins": ["prettier-plugin-bootstrap"],
  "bootstrapAttributes": ["ngClass", "v-bind:class"]
}
```

## Supported Parsers

- `html` — HTML files
- `vue` — Vue single-file components
- `angular` — Angular templates
- `babel` / `babel-ts` / `typescript` — JSX/TSX files
- `acorn` / `meriyah` — Alternative JS parsers
- `astro` — Astro components (requires `prettier-plugin-astro`)

### Astro

When using with `prettier-plugin-astro`, list `prettier-plugin-bootstrap` **after** `prettier-plugin-astro` in your config so it can wrap the Astro parser:

```json
{
  "plugins": ["prettier-plugin-astro", "prettier-plugin-bootstrap"]
}
```

## Development

```bash
pnpm install
pnpm run build
pnpm run test
pnpm run typecheck
```

## Compatibility

- Prettier >= 3.0.0
- Node.js >= 20

## License

MIT
