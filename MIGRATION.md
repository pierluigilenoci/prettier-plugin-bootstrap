# Migration Guide

This document covers breaking changes and migration steps between major versions.

## v0.x → v1.0 (future)

No migration guide yet. This section will be updated when v1.0 is released.

---

## General migration notes

### Minimum Node.js version bumps

Check the `engines.node` field in `package.json` when upgrading. If your Node.js version falls below the new minimum, upgrade Node.js first.

### Minimum Prettier version bumps

This plugin requires Prettier >= 3.0.0. If you are still on Prettier 2.x, upgrade Prettier before installing this plugin.

### CLASS_ORDER changes

When Bootstrap releases a new version, the `CLASS_ORDER` array may be updated to reflect new, renamed, or removed utility classes. After upgrading the plugin, re-run Prettier on your codebase to apply any updated sort order:

```bash
npx prettier --write .
```

### Option renames

If an option is renamed in a future release, the old name will be kept as a deprecated alias for one major version before being removed. Check the CHANGELOG for deprecation notices.
