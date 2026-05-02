import { describe, it, expect } from 'vitest'
import { sortClassString } from '../src/sorting'
import { processHtmlAst, processJsxAst } from '../src/traversal'

describe('sortClassString', () => {
  it('returns empty string as-is', () => {
    expect(sortClassString('')).toBe('')
  })

  it('returns whitespace-only string as-is', () => {
    expect(sortClassString('   ')).toBe('   ')
  })

  it('returns null/undefined as-is', () => {
    expect(sortClassString(null as any)).toBeNull()
    expect(sortClassString(undefined as any)).toBeUndefined()
  })

  it('returns single class with preserved whitespace', () => {
    expect(sortClassString('  container  ')).toBe('  container  ')
  })

  it('sorts multiple classes', () => {
    expect(sortClassString('mt-3 container')).toBe('container mt-3')
  })
})

describe('processHtmlAst — edge cases', () => {
  it('skips template literal values containing ${', () => {
    const ast = {
      attributes: [
        { name: 'class', value: 'container ${dynamic} p-3' },
      ],
    }
    processHtmlAst(ast, ['class'])
    expect(ast.attributes[0].value).toBe('container ${dynamic} p-3')
  })

  it('handles attr.value as object with .value property', () => {
    const ast = {
      attributes: [
        { name: 'class', value: { value: 'mt-3 container' } },
      ],
    }
    processHtmlAst(ast, ['class'])
    expect(ast.attributes[0].value.value).toBe('container mt-3')
  })

  it('skips attr.value object containing template literal', () => {
    const ast = {
      attributes: [
        { name: 'class', value: { value: 'container ${x} p-3' } },
      ],
    }
    processHtmlAst(ast, ['class'])
    expect(ast.attributes[0].value.value).toBe('container ${x} p-3')
  })

  it('skips non-quoted attribute kinds', () => {
    const ast = {
      attributes: [
        { name: 'class', value: 'mt-3 container', kind: 'expression' },
      ],
    }
    processHtmlAst(ast, ['class'])
    expect(ast.attributes[0].value).toBe('mt-3 container')
  })

  it('processes quoted attribute kinds', () => {
    const ast = {
      attributes: [
        { name: 'class', value: 'mt-3 container', kind: 'quoted' },
      ],
    }
    processHtmlAst(ast, ['class'])
    expect(ast.attributes[0].value).toBe('container mt-3')
  })

  it('resolves name from attr.key.value', () => {
    const ast = {
      attributes: [
        { key: { value: 'class' }, value: { value: 'mt-3 container' } },
      ],
    }
    processHtmlAst(ast, ['class'])
    expect(ast.attributes[0].value.value).toBe('container mt-3')
  })

  it('handles null children in AST nodes', () => {
    const ast = {
      children: [null, undefined, { attrs: [{ name: 'class', value: 'mt-3 container' }] }],
    }
    processHtmlAst(ast, ['class'])
    expect(ast.children[2]!.attrs[0].value).toBe('container mt-3')
  })
})

describe('processJsxAst — edge cases', () => {
  it('handles StringLiteral with extra field', () => {
    const ast = {
      type: 'JSXAttribute',
      name: { name: 'className' },
      value: {
        type: 'StringLiteral',
        value: 'mt-3 container',
        extra: { rawValue: 'mt-3 container', raw: '"mt-3 container"' },
      },
    }
    processJsxAst(ast, ['className'])
    expect(ast.value.value).toBe('container mt-3')
    expect(ast.value.extra.rawValue).toBe('container mt-3')
    expect(ast.value.extra.raw).toBe('"container mt-3"')
  })

  it('handles Literal with raw field', () => {
    const ast = {
      type: 'JSXAttribute',
      name: { name: 'className' },
      value: {
        type: 'Literal',
        value: 'mt-3 container',
        raw: '"mt-3 container"',
      },
    }
    processJsxAst(ast, ['className'])
    expect(ast.value.value).toBe('container mt-3')
    expect(ast.value.raw).toBe('"container mt-3"')
  })

  it('handles Literal with single-quote raw field', () => {
    const ast = {
      type: 'JSXAttribute',
      name: { name: 'className' },
      value: {
        type: 'Literal',
        value: 'mt-3 container',
        raw: "'mt-3 container'",
      },
    }
    processJsxAst(ast, ['className'])
    expect(ast.value.raw).toBe("'container mt-3'")
  })

  it('handles JSXAttribute with name.value instead of name.name', () => {
    const ast = {
      type: 'JSXAttribute',
      name: { value: 'className' },
      value: {
        type: 'StringLiteral',
        value: 'mt-3 container',
      },
    }
    processJsxAst(ast, ['className'])
    expect(ast.value.value).toBe('container mt-3')
  })

  it('walks nodes without children array', () => {
    const ast = {
      body: {
        type: 'JSXAttribute',
        name: { name: 'className' },
        value: {
          type: 'StringLiteral',
          value: 'mt-3 container',
        },
      },
    }
    processJsxAst(ast, ['className'])
    expect(ast.body.value.value).toBe('container mt-3')
  })
})
