# Changelog

## [0.4.0](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/compare/v0.3.3...v0.4.0) (2026-06-22)


### Features

* add Bootstrap 4 class order support ([ef2fc24](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/ef2fc245e2ab4b0347e0dac17cc70ff92be0b31e)), closes [#46](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/issues/46)
* add bootstrapSortTemplateLiterals option for opt-out of template literal sorting ([9b1695e](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/9b1695ec8c8dc8f15d19cd13de4673a9c7ac74ea))
* add eslint-plugin-bootstrap-order companion package ([3629ba2](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/3629ba2949abdb2328f3cf99efd89669f461e8cf)), closes [#56](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/issues/56)
* add inline ignore comment support (prettier-bootstrap-ignore-next) ([3638cb4](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/3638cb41b899f8561b36ed71787a59783999d4c1)), closes [#47](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/issues/47)
* add missing Bootstrap 5.3 classes and regression tests ([b0ae7b9](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/b0ae7b93863f715e1fc82ea4dae4e4f8b7a095a0)), closes [#58](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/issues/58)
* add online playground via GitHub Pages ([fccb79e](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/fccb79e2e34a8d7afc6c8b98445262541567b705)), closes [#45](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/issues/45)
* export CLASS_ORDER, BREAKPOINTS, and classKey from sorter public API ([6e4e66d](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/6e4e66d5e09cdc5ecea0464b218f0b91804225d1)), closes [#49](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/issues/49)
* sort static segments of template literals with expressions in JSX ([e9ea794](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/e9ea7948ea9ec8fe23829efd4e1539884afc4b41)), closes [#48](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/issues/48)


### Bug Fixes

* createSorter bootstrapVersion consistency + bootstrapSortTemplateLiterals opt-out ([4b303e3](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/4b303e3a516044f0ed392eeff4e2c31938ee7707))
* createSorter respects bootstrapVersion in sortClasses() ([b43e2ab](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/b43e2ab35148bc6cccc711a08c7f69a6b59f86fc))
* make Bootstrap upstream check reliable ([75e3a0e](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/75e3a0ed71f4df22be56d9bf5c99bd173e10719d))
* remove prettier-bootstrap-ignore-line (fragile, unreliable for HTML) ([184012c](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/184012c636ee683de0c6febf34269b4bfc2c22ba))
* store Bootstrap version in bootstrap-version.json, read with JSON.parse ([4a76258](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/4a76258a5458b11dbd0094d7322d1df314a92b8a))

## [0.3.3](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/compare/v0.3.2...v0.3.3) (2026-06-18)


### Bug Fixes

* add module and types fields to package.json for broader compatibility ([66dd863](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/66dd86344e941b956cca6712c2713960d60d1a1d))
* add vite as explicit devDependency at &gt;=7.3.5 to fix CVEs ([c776519](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/c776519626c392581e09c35c65ced82a7db502cb))
* replace regex with string ops to resolve CodeQL ReDoS alert ([2fc8497](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/2fc8497921e2839672ea5041e40c47d6c1b65dab))
* resolve all open issues (security, CI, docs, package metadata) ([da9bd3d](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/da9bd3db1f33e9d5158b3ed44ac4f464edf7b6ab))
* update SECURITY.md supported versions and add --provenance to publish ([cc3f0ca](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/cc3f0cafb610b91e178b2fe704db81b36016b0b6))

## [0.3.2](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/compare/v0.3.1...v0.3.2) (2026-06-18)


### Bug Fixes

* update codeql-action from v3 to v4 ([99eada9](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/99eada9d8a4c2bf248fd2c1b0c08e1684a51cde1))
* update engines.node to >=20.19 (required by rolldown native bindings) ([41b3ed7](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/41b3ed7))


### Miscellaneous

* update all devDependencies to latest versions (eslint, typescript 6, tsdown, vitest, prettier, @types/node, typescript-eslint) ([8e0c83d](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/8e0c83d))
* add pnpm.overrides to force esbuild >=0.28.1 (fixes Dependabot security alerts #4 and #5) ([8e0c83d](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/8e0c83d))
* configure Renovate with automerge for minor and patch updates ([52a5233](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/52a5233))
* bump packageManager to pnpm@10.34.3 ([41b3ed7](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/41b3ed7))

## [0.3.1](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/compare/v0.3.0...v0.3.1) (2026-06-14)


### Bug Fixes

* adjust branch coverage threshold for vitest v4 instrumentation ([6340fde](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/6340fde1f292a912c2a6e2f847416144a627bdc9))
* remove unused variable in coverage test ([bf694f1](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/bf694f13fa58a43190b4c8bef13f4d7aab99ff2e))

## [0.3.0](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/compare/v0.2.1...v0.3.0) (2026-05-03)


### Features

* ecosystem improvements — public API, new options, CJS, regex attrs ([9079811](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/9079811f98283283346ef25169115c10e28bf87a))
* ecosystem improvements — public API, new options, CJS, regex attrs ([add9e36](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/add9e36dbc72d9ab1f39379fa13abb89cecfb955))

## [0.2.1](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/compare/v0.2.0...v0.2.1) (2026-05-02)


### Bug Fixes

* **ci:** ignore auto-generated CHANGELOG.md in format check ([b23164f](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/b23164fb1efdce7b41e7b0286e31b3cfa0adffcb))

## [0.2.0](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/compare/v0.1.3...v0.2.0) (2026-05-02)


### Features

* add bootstrapFunctions, Svelte support, and CI improvements ([a5f17c8](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/a5f17c8980411c1f8ebb4c0d36a8816895e2342a))
* add bootstrapFunctions, Svelte support, and fix broken exports ([3d7395a](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/3d7395a37a30a617258c4e731ea4b84ac3b37a73))


### Bug Fixes

* correct exports path to match actual build output ([633f459](https://github.com/pierluigilenoci/prettier-plugin-bootstrap/commit/633f4598f1aa368fd4cfa1b103794f2838b868fb))

## 0.1.0

- Initial release
- Sorts Bootstrap CSS classes in HTML, JSX/TSX, Vue, Angular, and Astro
- Supports responsive breakpoint variants (sm, md, lg, xl, xxl)
- Custom `bootstrapAttributes` option for additional HTML attributes
- Custom `bootstrapFunctions` option for class utility functions
