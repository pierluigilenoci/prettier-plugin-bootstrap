<p align="center">
  <img src=".github/assets/banner.svg" alt="prettier-plugin-bootstrap" width="900"/>
</p>

# prettier-plugin-bootstrap

[![CI](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/actions/workflows/ci.yml/badge.svg)](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/prettier-plugin-bootstrap)](https://www.npmjs.com/package/prettier-plugin-bootstrap)
[![npm downloads](https://img.shields.io/npm/dw/prettier-plugin-bootstrap)](https://www.npmjs.com/package/prettier-plugin-bootstrap)
[![Node.js](https://img.shields.io/node/v/prettier-plugin-bootstrap)](https://nodejs.org)
[![codecov](https://codecov.io/gh/pierluigilenoci/prettier-plugin-bootstrap/branch/main/graph/badge.svg)](https://codecov.io/gh/pierluigilenoci/prettier-plugin-bootstrap)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**[Try it in the playground →](https://pierluigilenoci.github.io/prettier-plugin-bootstrap/)**

A [Prettier](https://prettier.io/) plugin that automatically sorts Bootstrap CSS classes following the framework's recommended order.

Works with **HTML**, **JSX/TSX**, **Vue**, **Angular**, **Svelte**, and **Astro** templates.

## Why?

- **Consistency** — Every file in your project uses the same class order, regardless of who wrote it.
- **Smaller diffs** — Sorted classes eliminate noisy reordering in pull requests.
- **Readability** — Classes follow Bootstrap's architecture (layout → components → utilities), making it easier to scan what an element does.
- **Zero config** — Just add the plugin and format. No ESLint rules to configure, no manual sorting.

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

### HTML

```html
<!-- Before -->
<div class="text-center p-3 container bg-primary text-white mb-4 rounded"></div>

<!-- After -->
<div class="container mb-4 p-3 text-center text-white bg-primary rounded"></div>
```

### JSX / TSX

```jsx
// Before
<button className="btn-lg mt-2 btn btn-primary d-flex align-items-center">Click</button>

// After
<button className="d-flex align-items-center mt-2 btn btn-primary btn-lg">Click</button>
```

### Vue

```html
<!-- Before -->
<div :class="['text-center', 'container', 'p-3']"></div>

<!-- After -->
<div :class="['container', 'p-3', 'text-center']"></div>
```

### Svelte

```html
<!-- Before -->
<div class="text-white p-2 bg-dark d-flex"></div>

<!-- After -->
<div class="d-flex p-2 text-white bg-dark"></div>
```

### Astro

```astro
<!-- Before -->
<div class="rounded text-sm p-4 card shadow"></div>

<!-- After -->
<div class="card p-4 rounded shadow text-sm"></div>
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

| Option                          | Type       | Default | Description                                                                                                          |
| ------------------------------- | ---------- | ------- | -------------------------------------------------------------------------------------------------------------------- |
| `bootstrapAttributes`           | `string[]` | `[]`    | Additional HTML attributes to sort (beyond `class` and `className`). Supports regex patterns (e.g. `/^data-class/`). |
| `bootstrapFunctions`            | `string[]` | `[]`    | Function names whose arguments are class lists (e.g. `clsx`, `classNames`)                                           |
| `bootstrapPreserveWhitespace`   | `boolean`  | `false` | Preserve original whitespace between classes instead of normalizing to single spaces                                 |
| `bootstrapPreserveDuplicates`   | `boolean`  | `true`  | Keep duplicate class names. Set to `false` to remove duplicates                                                      |
| `bootstrapVersion`              | `int`      | `5`     | Bootstrap version (`4` or `5`). Any other value falls back to Bootstrap 5 sorting.                                   |
| `bootstrapSortTemplateLiterals` | `boolean`  | `true`  | Sort static class segments inside JSX template literals that contain expressions. Set to `false` to skip them        |

### `bootstrapAttributes`

Sort classes in custom attributes beyond `class` / `className`:

```html
<!-- .prettierrc: { "bootstrapAttributes": ["ngClass"] } -->

<!-- Before -->
<div [ngClass]="'text-center p-3 container'"></div>

<!-- After -->
<div [ngClass]="'container p-3 text-center'"></div>
```

### `bootstrapFunctions`

Sort class strings passed to utility functions like `clsx`:

```jsx
// .prettierrc: { "bootstrapFunctions": ["clsx"] }

// Before
clsx('btn-lg', 'mt-2', 'btn', 'btn-primary')

// After
clsx('mt-2', 'btn', 'btn-primary', 'btn-lg')
```

### `bootstrapPreserveWhitespace`

Keep original whitespace between classes (default: normalise to single spaces):

```html
<!-- .prettierrc: { "bootstrapPreserveWhitespace": true } -->

<!-- Before -->
<div class="p-3   container  mt-2"></div>

<!-- After (whitespace preserved) -->
<div class="container  mt-2   p-3"></div>
```

### `bootstrapPreserveDuplicates`

Remove duplicate class names by setting to `false` (default: `true`, keep duplicates):

```html
<!-- .prettierrc: { "bootstrapPreserveDuplicates": false } -->

<!-- Before -->
<div class="p-3 container p-3 mt-2"></div>

<!-- After (duplicate p-3 removed) -->
<div class="container mt-2 p-3"></div>
```

### `bootstrapSortTemplateLiterals`

By default, static class segments inside JSX template literals with expressions are sorted independently:

```jsx
// Before
<div className={`text-white container ${condition} mt-3 p-2`} />

// After (each static segment sorted independently)
<div className={`container text-white ${condition} mt-3 p-2`} />
```

Set to `false` to restore the pre-v0.4.0 behaviour and skip template literals with expressions entirely:

```json
{ "bootstrapSortTemplateLiterals": false }
```

### Full example

```json
{
  "plugins": ["prettier-plugin-bootstrap"],
  "bootstrapAttributes": ["ngClass", "v-bind:class", "/^data-class/"],
  "bootstrapFunctions": ["clsx", "cn", "classNames"]
}
```

### TypeScript Configuration

For type-safe configuration, use JSDoc annotations:

```js
/** @type {import('prettier-plugin-bootstrap').BootstrapPluginOptions} */
const config = {
  plugins: ['prettier-plugin-bootstrap'],
  bootstrapAttributes: ['ngClass'],
  bootstrapFunctions: ['clsx', 'cn'],
  bootstrapPreserveDuplicates: false,
}

export default config
```

### Regex Attributes

You can use regex patterns in `bootstrapAttributes` to match dynamic attribute names:

```json
{
  "bootstrapAttributes": ["/^data-class/", "/Class$/"]
}
```

Patterns must be wrapped in forward slashes. Optional flags (`i`, `g`, etc.) are supported: `/^data-class/i`.

### File-Level Ignore

Add a comment at the top of a file to skip Bootstrap class sorting for the entire file:

```html
<!-- prettier-bootstrap-ignore -->
<div class="mt-3 container">Will not be sorted</div>
```

For JS/TS files:

```js
// prettier-bootstrap-ignore
export default () => <div className="mt-3 container">Not sorted</div>
```

Or block comment style:

```js
/* prettier-bootstrap-ignore */
```

### Inline Ignore (single element)

To skip sorting for a single element while keeping sorting active for the rest of the file, add an ignore comment on the line **before** the element:

```html
<!-- prettier-bootstrap-ignore-next -->
<div class="mt-3 container">This element will NOT be sorted</div>

<div class="mt-3 container">This one WILL be sorted → container mt-3</div>
```

For JS/TS files:

```jsx
// prettier-bootstrap-ignore-next
<div className="mt-3 container">Not sorted</div>

<div className="mt-3 container">Sorted → container mt-3</div>
```

## Public Sorting API

For programmatic use (linters, codemods, build tools), import the sorter directly:

```js
import { createSorter } from 'prettier-plugin-bootstrap/sorter'

const sorter = createSorter({ preserveDuplicates: false })

sorter.sort('mt-3 container p-2') // "container mt-3 p-2"
sorter.sortClasses(['mt-3', 'container']) // ["container", "mt-3"]
```

## Editor Integration

No editor-specific configuration is needed — the plugin works through Prettier. Enable "Format on Save" in your editor and Prettier will sort classes automatically.

### VS Code

1. Install the [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension.
2. Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### WebStorm / IntelliJ

Go to **Settings → Languages & Frameworks → Prettier** and enable **Run on save**.

### Neovim

Use [conform.nvim](https://github.com/stevearc/conform.nvim) or [null-ls](https://github.com/jose-elias-alvarez/null-ls.nvim) with Prettier as the formatter, then enable format-on-save in your config.

## Supported Parsers

- `html` — HTML files
- `vue` — Vue single-file components
- `angular` — Angular templates
- `babel` / `babel-ts` / `typescript` — JSX/TSX files
- `acorn` / `meriyah` — Alternative JS parsers
- `svelte` — Svelte components (requires `prettier-plugin-svelte`)
- `astro` — Astro components (requires `prettier-plugin-astro`)

### Svelte

When using with `prettier-plugin-svelte`, list `prettier-plugin-bootstrap` **after** `prettier-plugin-svelte` in your config:

```json
{
  "plugins": ["prettier-plugin-svelte", "prettier-plugin-bootstrap"]
}
```

### Astro

When using with `prettier-plugin-astro`, list `prettier-plugin-bootstrap` **after** `prettier-plugin-astro` in your config so it can wrap the Astro parser:

```json
{
  "plugins": ["prettier-plugin-astro", "prettier-plugin-bootstrap"]
}
```

## Plugin Compatibility

This plugin works alongside other Prettier plugins. Load order matters — `prettier-plugin-bootstrap` should come **last** so it can wrap the parsers registered by other plugins.

| Plugin                                  | Compatible | Load Order                               |
| --------------------------------------- | ---------- | ---------------------------------------- |
| `prettier-plugin-svelte`                | Yes        | svelte first                             |
| `prettier-plugin-astro`                 | Yes        | astro first                              |
| `prettier-plugin-tailwindcss`           | N/A        | Use one or the other (both sort classes) |
| `prettier-plugin-organize-imports`      | Yes        | Any order                                |
| `@trivago/prettier-plugin-sort-imports` | Yes        | Any order                                |

## FAQ

### Does class sorting affect line wrapping?

Yes. Reordering classes changes the string length, which may cause Prettier to wrap lines differently based on your `printWidth` setting. This is expected — the formatting is still deterministic and consistent.

### Can I use this with Tailwind CSS?

This plugin is designed specifically for Bootstrap's class system. If you use Tailwind CSS, use `prettier-plugin-tailwindcss` instead. They should not be used together as they have conflicting sort orders.

## Development

```bash
pnpm install
pnpm run build
pnpm run test
pnpm run typecheck
```

## Compatibility

- Prettier >= 3.0.0
- Node.js >= 20.19
- Bootstrap 5 (default, `bootstrapVersion: 5`)
- Bootstrap 4 (`bootstrapVersion: 4`)

## ESLint companion

An ESLint plugin is available under [`packages/eslint-plugin`](packages/eslint-plugin/README.md) for enforcing sorted Bootstrap class order as a lint rule (useful in pre-commit hooks or CI without running Prettier).

```bash
npm install -D eslint-plugin-bootstrap-order
```

## License

MIT
