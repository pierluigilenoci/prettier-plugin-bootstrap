# eslint-plugin-bootstrap-order

ESLint plugin for Bootstrap CSS class order validation — companion to [`prettier-plugin-bootstrap`](https://github.com/pierluigilenoci/prettier-plugin-bootstrap).

## Installation

```bash
npm install -D eslint-plugin-bootstrap-order prettier-plugin-bootstrap
```

## Usage

### Flat config (ESLint 9+)

```js
// eslint.config.js
import bootstrapOrder from 'eslint-plugin-bootstrap-order'

export default [
  {
    plugins: { 'bootstrap-order': bootstrapOrder },
    rules: {
      'bootstrap-order/sort-classes': 'warn',
    },
  },
]
```

### Legacy config

```js
// .eslintrc.js
module.exports = {
  plugins: ['bootstrap-order'],
  rules: {
    'bootstrap-order/sort-classes': 'warn',
  },
}
```

## Rules

### `bootstrap-order/sort-classes`

Enforces sorted Bootstrap class order on `className` and `class` JSX attributes.

**Fixable:** `--fix` auto-sorts the classes.

```jsx
// ❌ Warning
<div className="text-white mt-3 container" />

// ✅ OK (or auto-fixed)
<div className="container mt-3 text-white" />
```
