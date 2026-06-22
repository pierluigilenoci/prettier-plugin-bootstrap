import { describe, it, expect } from 'vitest'
import { sortClasses } from '../src/class-order'
import { parsers } from '../src/index'
import { processHtmlAst, processJsxAst } from '../src/traversal'

describe('integration — realistic class lists', () => {
  it('handles a typical Bootstrap HTML class attribute value', () => {
    const input = 'text-center p-3 container bg-primary text-white mb-4 rounded'
    const sorted = sortClasses(input.split(/\s+/))
    const result = sorted.join(' ')
    expect(result).toMatch(/^container/)
    expect(result).toMatch(/rounded$/)
  })

  it('handles Bootstrap card example', () => {
    const input = 'shadow-sm card mb-3 border-0'
    const sorted = sortClasses(input.split(/\s+/))
    expect(sorted.indexOf('card')).toBeLessThan(sorted.indexOf('shadow-sm'))
    expect(sorted.indexOf('card')).toBeLessThan(sorted.indexOf('mb-3'))
    expect(sorted.indexOf('card')).toBeLessThan(sorted.indexOf('border-0'))
  })

  it('handles Bootstrap navbar example', () => {
    const input = 'bg-body-tertiary fixed-top navbar navbar-expand-lg'
    const sorted = sortClasses(input.split(/\s+/))
    expect(sorted.indexOf('navbar')).toBeLessThan(sorted.indexOf('bg-body-tertiary'))
  })

  it('handles complex responsive grid layout', () => {
    const input = 'p-3 col-md-6 col-lg-4 col mb-2'
    const sorted = sortClasses(input.split(/\s+/))
    expect(sorted.indexOf('col')).toBeLessThan(sorted.indexOf('p-3'))
  })

  it('handles flexbox utility combinations', () => {
    const input = 'gap-3 align-items-center justify-content-between d-flex'
    const sorted = sortClasses(input.split(/\s+/))
    expect(sorted.indexOf('d-flex')).toBeLessThan(sorted.indexOf('justify-content-between'))
    expect(sorted.indexOf('d-flex')).toBeLessThan(sorted.indexOf('align-items-center'))
    expect(sorted.indexOf('align-items-center')).toBeLessThan(sorted.indexOf('gap-3'))
  })

  it('handles button variants', () => {
    const input = 'px-4 btn btn-primary btn-lg rounded-pill'
    const sorted = sortClasses(input.split(/\s+/))
    expect(sorted.indexOf('btn')).toBeLessThan(sorted.indexOf('px-4'))
    expect(sorted.indexOf('btn')).toBeLessThan(sorted.indexOf('rounded-pill'))
  })

  it('handles form elements', () => {
    const input = 'mb-3 form-control form-control-lg is-invalid'
    const sorted = sortClasses(input.split(/\s+/))
    expect(sorted.indexOf('form-control')).toBeLessThan(sorted.indexOf('mb-3'))
  })
})

describe('parser wrapper — minimal parser coverage', () => {
  it('uses wrapper locStart/locEnd/astFormat when parser lacks them', async () => {
    const minimalParser = {
      parse: async () => ({ type: 'root', attrs: [] }),
    }
    const fakePlugin = { parsers: { html: minimalParser } }
    const result = await parsers.html.parse!('<div class="mt-3 container"></div>', {
      plugins: [fakePlugin],
      bootstrapAttributes: [],
      bootstrapFunctions: [],
      bootstrapPreserveWhitespace: false,
      bootstrapPreserveDuplicates: true,
    } as any)
    expect(result).toBeDefined()
  })
})

describe('inline ignore comments', () => {
  const matchClass = (name: string) => name === 'class'

  it('sorts normally without ignore comment', () => {
    const sourceText = '<div class="mt-3 container"></div>'
    const ast = {
      attrs: [{ name: 'class', value: 'mt-3 container' }],
      range: [0, sourceText.length],
    }
    processHtmlAst(ast, matchClass, [], {}, sourceText)
    expect(ast.attrs[0].value).toBe('container mt-3')
  })

  it('skips sorting with prettier-bootstrap-ignore-next on previous line (HTML)', () => {
    const sourceText = '<!-- prettier-bootstrap-ignore-next -->\n<div class="mt-3 container"></div>'
    const nodeStart = sourceText.indexOf('<div')
    const ast = {
      attrs: [{ name: 'class', value: 'mt-3 container' }],
      range: [nodeStart, sourceText.length],
    }
    processHtmlAst(ast, matchClass, [], {}, sourceText)
    expect(ast.attrs[0].value).toBe('mt-3 container')
  })

  it('skips JSXAttribute sorting with prettier-bootstrap-ignore-next', () => {
    const sourceText = '// prettier-bootstrap-ignore-next\n<div className="mt-3 container" />'
    const nodeStart = sourceText.indexOf('<div')
    const jsxAttrNode = {
      type: 'JSXAttribute',
      name: { name: 'className' },
      value: { type: 'StringLiteral', value: 'mt-3 container' },
      range: [nodeStart, sourceText.length],
    }
    const ast = {
      type: 'JSXElement',
      attributes: [jsxAttrNode],
      range: [nodeStart, sourceText.length],
    }
    processJsxAst(ast, matchClass, [], {}, sourceText)
    expect(jsxAttrNode.value.value).toBe('mt-3 container')
  })
})
