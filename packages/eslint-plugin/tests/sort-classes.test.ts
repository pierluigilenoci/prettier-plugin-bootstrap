import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import plugin from '../src/index'

const rule = plugin.rules['sort-classes']!

const errors: string[] = []
const passes: string[] = []

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
})

try {
  tester.run('bootstrap-order/sort-classes', rule, {
    valid: [
      { code: '<div className="container mt-3 p-2" />' },
      { code: '<div className="btn btn-primary" />' },
      { code: '<div className="d-flex align-items-center mt-3" />' },
      { code: '<div id="main" />' },
      { code: '<div className="" />' },
    ],
    invalid: [
      {
        code: '<div className="mt-3 container" />',
        errors: [{ messageId: 'unsorted' }],
        output: '<div className="container mt-3" />',
      },
      {
        code: '<div className="p-3 btn btn-primary mt-2" />',
        errors: [{ messageId: 'unsorted' }],
        output: '<div className="btn btn-primary mt-2 p-3" />',
      },
      {
        code: '<div class="text-center p-3 container" />',
        errors: [{ messageId: 'unsorted' }],
        output: '<div class="container p-3 text-center" />',
      },
    ],
  })
  passes.push('RuleTester passed all cases')
} catch (e: unknown) {
  errors.push(e instanceof Error ? e.message : String(e))
}

describe('eslint-plugin-bootstrap-order / sort-classes rule', () => {
  it('passes all RuleTester cases', () => {
    if (errors.length > 0) {
      throw new Error(errors.join('\n'))
    }
    expect(passes).toHaveLength(1)
  })
})

describe('plugin structure', () => {
  it('exports a rules object with sort-classes', () => {
    expect(plugin.rules).toBeDefined()
    expect(typeof plugin.rules['sort-classes']).toBe('object')
  })

  it('exports a configs.recommended object', () => {
    expect(plugin.configs.recommended).toBeDefined()
    expect(plugin.configs.recommended.rules?.['bootstrap-order/sort-classes']).toBe('warn')
  })

  it('rule meta has type suggestion and fixable code', () => {
    expect(rule.meta?.type).toBe('suggestion')
    expect(rule.meta?.fixable).toBe('code')
  })
})
