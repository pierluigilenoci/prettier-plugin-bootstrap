import { describe, it, expect } from 'vitest'
import * as prettier from 'prettier'
import * as pluginSvelte from 'prettier-plugin-svelte'
// prettier-plugin-astro ships no type declarations; use require instead
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pluginAstro = require('prettier-plugin-astro')
import * as plugin from '../src/index'

describe('e2e — Svelte parser (via prettier-plugin-svelte)', () => {
  it('sorts class attributes in Svelte components', async () => {
    const input = `<div class="text-white p-2 bg-dark d-flex"></div>`
    const result = await prettier.format(input, {
      parser: 'svelte',
      plugins: [pluginSvelte, plugin],
    })
    expect(result).toContain('d-flex')
    expect(result).toContain('p-2')
    expect(result).toContain('text-white')
    expect(result).toContain('bg-dark')
    // d-flex should sort before bg-dark (utilities: d- before bg-)
    const dIdx = result.indexOf('d-flex')
    const bgIdx = result.indexOf('bg-dark')
    expect(dIdx).toBeLessThan(bgIdx)
  })

  it('sorts multiple elements in Svelte', async () => {
    const input = `<div class="p-3 container"><span class="fw-bold text-primary"></span></div>`
    const result = await prettier.format(input, {
      parser: 'svelte',
      plugins: [pluginSvelte, plugin],
    })
    expect(result).toContain('container p-3')
    expect(result).toContain('fw-bold text-primary')
  })

  it('preserves unknown classes in original order (Svelte)', async () => {
    const input = `<div class="custom-b custom-a container"></div>`
    const result = await prettier.format(input, {
      parser: 'svelte',
      plugins: [pluginSvelte, plugin],
    })
    expect(result).toContain('container')
    const containerIdx = result.indexOf('container')
    const customBIdx = result.indexOf('custom-b')
    expect(containerIdx).toBeLessThan(customBIdx)
  })
})

describe('e2e — Astro parser (via prettier-plugin-astro)', () => {
  it('sorts class attributes in Astro components', async () => {
    const input = `---\n---\n<div class="rounded text-sm p-4 card shadow"></div>\n`
    const result = await prettier.format(input, {
      parser: 'astro',
      plugins: [pluginAstro, plugin],
    })
    expect(result).toContain('card')
    expect(result).toContain('p-4')
    expect(result).toContain('rounded')
    // card should sort before p-4 (component before utility)
    const cardIdx = result.indexOf('card')
    const p4Idx = result.indexOf('p-4')
    expect(cardIdx).toBeLessThan(p4Idx)
  })

  it('sorts className in Astro JSX expressions', async () => {
    const input = `---\n---\n<div class="mt-3 container d-flex"></div>\n`
    const result = await prettier.format(input, {
      parser: 'astro',
      plugins: [pluginAstro, plugin],
    })
    expect(result).toContain('container')
    const containerIdx = result.indexOf('container')
    const mt3Idx = result.indexOf('mt-3')
    expect(containerIdx).toBeLessThan(mt3Idx)
  })
})
