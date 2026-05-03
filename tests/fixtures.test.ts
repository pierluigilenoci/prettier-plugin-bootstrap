import { describe, it, expect } from 'vitest'
import * as prettier from 'prettier'
import * as plugin from '../src/index'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fixturesDir = join(__dirname, 'fixtures')

function readFixture(name: string): string {
  return readFileSync(join(fixturesDir, name), 'utf-8')
}

async function formatFixture(name: string, parser: string, options?: Record<string, any>) {
  const input = readFixture(name)
  return prettier.format(input, {
    parser,
    plugins: [plugin],
    ...options,
  })
}

describe('fixture-based formatting', () => {
  it('formats basic.html', async () => {
    const result = await formatFixture('basic.html', 'html')
    expect(result).toMatchSnapshot()
  })

  it('formats component.jsx', async () => {
    const result = await formatFixture('component.jsx', 'babel')
    expect(result).toMatchSnapshot()
  })

  it('formats template.vue', async () => {
    const result = await formatFixture('template.vue', 'vue')
    expect(result).toMatchSnapshot()
  })

  it('fixture output is stable on re-format', async () => {
    const first = await formatFixture('basic.html', 'html')
    const second = await prettier.format(first, {
      parser: 'html',
      plugins: [plugin],
    })
    expect(second).toBe(first)
  })
})
