import { describe, it, expect } from 'vitest'
import { sortClassString } from '../src/sorting'
import { processHtmlAst, processJsxAst, processSvelteAst } from '../src/traversal'

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

  describe('preserveWhitespace option', () => {
    it('preserves multi-space separators when enabled', () => {
      expect(sortClassString('mt-3  container', { preserveWhitespace: true })).toBe(
        'container  mt-3',
      )
    })

    it('preserves tab separators', () => {
      expect(sortClassString('mt-3\tcontainer', { preserveWhitespace: true })).toBe(
        'container\tmt-3',
      )
    })

    it('normalizes to single spaces when disabled (default)', () => {
      expect(sortClassString('mt-3  container')).toBe('container mt-3')
    })
  })

  describe('preserveDuplicates option', () => {
    it('removes duplicates when set to false', () => {
      expect(sortClassString('mt-3 container mt-3 p-2', { preserveDuplicates: false })).toBe(
        'container mt-3 p-2',
      )
    })

    it('preserves duplicates by default', () => {
      expect(sortClassString('mt-3 container mt-3')).toBe('container mt-3 mt-3')
    })

    it('preserves duplicates when explicitly true', () => {
      expect(sortClassString('mt-3 container mt-3', { preserveDuplicates: true })).toBe(
        'container mt-3 mt-3',
      )
    })
  })
})

describe('processHtmlAst — edge cases', () => {
  it('skips template literal values containing ${', () => {
    const ast = {
      attributes: [{ name: 'class', value: 'container ${dynamic} p-3' }],
    }
    processHtmlAst(ast, ['class'])
    expect(ast.attributes[0].value).toBe('container ${dynamic} p-3')
  })

  it('handles attr.value as object with .value property', () => {
    const ast = {
      attributes: [{ name: 'class', value: { value: 'mt-3 container' } }],
    }
    processHtmlAst(ast, ['class'])
    expect(ast.attributes[0].value.value).toBe('container mt-3')
  })

  it('skips attr.value object containing template literal', () => {
    const ast = {
      attributes: [{ name: 'class', value: { value: 'container ${x} p-3' } }],
    }
    processHtmlAst(ast, ['class'])
    expect(ast.attributes[0].value.value).toBe('container ${x} p-3')
  })

  it('skips non-quoted attribute kinds', () => {
    const ast = {
      attributes: [{ name: 'class', value: 'mt-3 container', kind: 'expression' }],
    }
    processHtmlAst(ast, ['class'])
    expect(ast.attributes[0].value).toBe('mt-3 container')
  })

  it('processes quoted attribute kinds', () => {
    const ast = {
      attributes: [{ name: 'class', value: 'mt-3 container', kind: 'quoted' }],
    }
    processHtmlAst(ast, ['class'])
    expect(ast.attributes[0].value).toBe('container mt-3')
  })

  it('resolves name from attr.key.value', () => {
    const ast = {
      attributes: [{ key: { value: 'class' }, value: { value: 'mt-3 container' } }],
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

describe('processJsxAst — bootstrapFunctions', () => {
  it('sorts string args in CallExpression with matching callee', () => {
    const ast = {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'clsx' },
      arguments: [{ type: 'StringLiteral', value: 'mt-3 container' }],
    }
    processJsxAst(ast, ['className'], ['clsx'])
    expect(ast.arguments[0].value).toBe('container mt-3')
  })

  it('sorts Literal args in CallExpression', () => {
    const ast = {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'cn' },
      arguments: [{ type: 'Literal', value: 'mt-3 container', raw: '"mt-3 container"' }],
    }
    processJsxAst(ast, ['className'], ['cn'])
    expect(ast.arguments[0].value).toBe('container mt-3')
    expect(ast.arguments[0].raw).toBe('"container mt-3"')
  })

  it('sorts TemplateLiteral without expressions', () => {
    const ast = {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'clsx' },
      arguments: [
        {
          type: 'TemplateLiteral',
          expressions: [],
          quasis: [{ value: { raw: 'mt-3 container', cooked: 'mt-3 container' } }],
        },
      ],
    }
    processJsxAst(ast, ['className'], ['clsx'])
    expect(ast.arguments[0].quasis[0].value.raw).toBe('container mt-3')
    expect(ast.arguments[0].quasis[0].value.cooked).toBe('container mt-3')
  })

  it('ignores TemplateLiteral with expressions', () => {
    const ast = {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'clsx' },
      arguments: [
        {
          type: 'TemplateLiteral',
          expressions: [{ type: 'Identifier', name: 'x' }],
          quasis: [
            { value: { raw: 'mt-3 ', cooked: 'mt-3 ' } },
            { value: { raw: ' container', cooked: ' container' } },
          ],
        },
      ],
    }
    processJsxAst(ast, ['className'], ['clsx'])
    expect(ast.arguments[0].quasis[0].value.raw).toBe('mt-3 ')
  })

  it('ignores CallExpression with non-matching callee', () => {
    const ast = {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'other' },
      arguments: [{ type: 'StringLiteral', value: 'mt-3 container' }],
    }
    processJsxAst(ast, ['className'], ['clsx'])
    expect(ast.arguments[0].value).toBe('mt-3 container')
  })

  it('ignores CallExpression with MemberExpression callee', () => {
    const ast = {
      type: 'CallExpression',
      callee: {
        type: 'MemberExpression',
        object: { type: 'Identifier', name: 'utils' },
        property: { name: 'cn' },
      },
      arguments: [{ type: 'StringLiteral', value: 'mt-3 container' }],
    }
    processJsxAst(ast, ['className'], ['cn'])
    expect(ast.arguments[0].value).toBe('mt-3 container')
  })

  it('ignores when targetFunctions is empty', () => {
    const ast = {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'clsx' },
      arguments: [{ type: 'StringLiteral', value: 'mt-3 container' }],
    }
    processJsxAst(ast, ['className'], [])
    expect(ast.arguments[0].value).toBe('mt-3 container')
  })
})

describe('processSvelteAst', () => {
  it('sorts class Text nodes in Svelte 5 attributes', () => {
    const ast = {
      fragment: {
        nodes: [
          {
            type: 'RegularElement',
            attributes: [
              {
                type: 'Attribute',
                name: 'class',
                value: [{ type: 'Text', data: 'mt-3 container', raw: 'mt-3 container' }],
              },
            ],
          },
        ],
      },
    }
    processSvelteAst(ast, ['class'])
    expect(ast.fragment.nodes[0].attributes[0].value[0].data).toBe('container mt-3')
    expect(ast.fragment.nodes[0].attributes[0].value[0].raw).toBe('container mt-3')
  })

  it('skips ExpressionTag nodes in attribute value', () => {
    const ast = {
      fragment: {
        nodes: [
          {
            attributes: [
              {
                type: 'Attribute',
                name: 'class',
                value: [
                  { type: 'Text', data: 'mt-3 container', raw: 'mt-3 container' },
                  { type: 'ExpressionTag', expression: { type: 'Identifier', name: 'x' } },
                ],
              },
            ],
          },
        ],
      },
    }
    processSvelteAst(ast, ['class'])
    expect(ast.fragment.nodes[0].attributes[0].value[0].data).toBe('container mt-3')
  })

  it('skips non-Attribute types', () => {
    const ast = {
      fragment: {
        nodes: [
          {
            attributes: [{ type: 'SpreadAttribute', expression: {} }],
          },
        ],
      },
    }
    processSvelteAst(ast, ['class'])
    expect(ast.fragment.nodes[0].attributes[0].type).toBe('SpreadAttribute')
  })

  it('skips attributes not in targetAttrs', () => {
    const ast = {
      fragment: {
        nodes: [
          {
            attributes: [
              {
                type: 'Attribute',
                name: 'id',
                value: [{ type: 'Text', data: 'mt-3 container', raw: 'mt-3 container' }],
              },
            ],
          },
        ],
      },
    }
    processSvelteAst(ast, ['class'])
    expect(ast.fragment.nodes[0].attributes[0].value[0].data).toBe('mt-3 container')
  })

  it('handles nested elements via fragment.nodes', () => {
    const ast = {
      fragment: {
        nodes: [
          {
            attributes: [
              {
                type: 'Attribute',
                name: 'class',
                value: [{ type: 'Text', data: 'p-3 container', raw: 'p-3 container' }],
              },
            ],
            fragment: {
              nodes: [
                {
                  attributes: [
                    {
                      type: 'Attribute',
                      name: 'class',
                      value: [{ type: 'Text', data: 'mt-3 btn', raw: 'mt-3 btn' }],
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    }
    processSvelteAst(ast, ['class'])
    expect(ast.fragment.nodes[0].attributes[0].value[0].data).toBe('container p-3')
    expect(ast.fragment.nodes[0].fragment.nodes[0].attributes[0].value[0].data).toBe('btn mt-3')
  })

  it('handles nodes with children (Svelte 4 compat)', () => {
    const ast = {
      children: [
        {
          attributes: [
            {
              type: 'Attribute',
              name: 'class',
              value: [{ type: 'Text', data: 'mt-3 container', raw: 'mt-3 container' }],
            },
          ],
        },
      ],
    }
    processSvelteAst(ast, ['class'])
    expect(ast.children[0].attributes[0].value[0].data).toBe('container mt-3')
  })

  it('handles Text node without raw property', () => {
    const ast = {
      fragment: {
        nodes: [
          {
            attributes: [
              {
                type: 'Attribute',
                name: 'class',
                value: [{ type: 'Text', data: 'mt-3 container' }],
              },
            ],
          },
        ],
      },
    }
    processSvelteAst(ast, ['class'])
    expect(ast.fragment.nodes[0].attributes[0].value[0].data).toBe('container mt-3')
  })

  it('accepts a function as attrMatcher', () => {
    const ast = {
      fragment: {
        nodes: [
          {
            attributes: [
              {
                type: 'Attribute',
                name: 'class',
                value: [{ type: 'Text', data: 'mt-3 container', raw: 'mt-3 container' }],
              },
            ],
          },
        ],
      },
    }
    processSvelteAst(ast, (name: string) => name === 'class')
    expect(ast.fragment.nodes[0].attributes[0].value[0].data).toBe('container mt-3')
  })
})

describe('branch coverage — remaining edges', () => {
  it('processJsxAst handles CallExpression with null argument', () => {
    const ast = {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'clsx' },
      arguments: [null, { type: 'StringLiteral', value: 'mt-3 container' }],
    }
    processJsxAst(ast, ['className'], ['clsx'])
    expect(ast.arguments[1]!.value).toBe('container mt-3')
  })

  it('processJsxAst handles CallExpression without arguments property', () => {
    const ast = {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'clsx' },
    }
    processJsxAst(ast, ['className'], ['clsx'])
    expect(ast.callee.name).toBe('clsx')
  })

  it('processSvelteAst handles null nodes in fragment', () => {
    const ast = {
      fragment: {
        nodes: [
          null,
          {
            attributes: [
              {
                type: 'Attribute',
                name: 'class',
                value: [{ type: 'Text', data: 'mt-3 container', raw: 'mt-3 container' }],
              },
            ],
          },
        ],
      },
    }
    processSvelteAst(ast, ['class'])
    expect(ast.fragment.nodes[1]!.attributes[0].value[0].data).toBe('container mt-3')
  })
})
