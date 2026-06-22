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

  it('sorts static segments of TemplateLiteral with expressions', () => {
    const ast = {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'clsx' },
      arguments: [
        {
          type: 'TemplateLiteral',
          expressions: [{ type: 'Identifier', name: 'x' }],
          quasis: [
            { value: { raw: 'text-white container ', cooked: 'text-white container ' } },
            { value: { raw: ' mt-3 p-2', cooked: ' mt-3 p-2' } },
          ],
        },
      ],
    }
    processJsxAst(ast, ['className'], ['clsx'])
    expect(ast.arguments[0].quasis[0].value.raw).toBe('container text-white ')
    expect(ast.arguments[0].quasis[1].value.raw).toBe(' mt-3 p-2')
  })

  it('skips TemplateLiteral with expressions when sortTemplateLiterals is false', () => {
    const ast = {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'clsx' },
      arguments: [
        {
          type: 'TemplateLiteral',
          expressions: [{ type: 'Identifier', name: 'x' }],
          quasis: [
            { value: { raw: 'text-white container ', cooked: 'text-white container ' } },
            { value: { raw: ' mt-3 p-2', cooked: ' mt-3 p-2' } },
          ],
        },
      ],
    }
    processJsxAst(ast, ['className'], ['clsx'], { sortTemplateLiterals: false })
    expect(ast.arguments[0].quasis[0].value.raw).toBe('text-white container ')
    expect(ast.arguments[0].quasis[1].value.raw).toBe(' mt-3 p-2')
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

  it('walk traverses node.body as object (non-array)', () => {
    const ast = {
      body: {
        type: 'JSXAttribute',
        name: { name: 'className' },
        value: { type: 'StringLiteral', value: 'mt-3 container' },
      },
    }
    processJsxAst(ast, ['className'])
    expect(ast.body.value.value).toBe('container mt-3')
  })

  it('sortStringNode handles Literal without raw field', () => {
    const ast = {
      type: 'JSXAttribute',
      name: { name: 'className' },
      value: { type: 'Literal', value: 'mt-3 container' },
    }
    processJsxAst(ast, ['className'])
    expect(ast.value.value).toBe('container mt-3')
  })

  it('sortStringNode handles TemplateLiteral quasi without value.raw', () => {
    const ast = {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'clsx' },
      arguments: [
        {
          type: 'TemplateLiteral',
          expressions: [],
          quasis: [{ value: null }],
        },
      ],
    }
    processJsxAst(ast, ['className'], ['clsx'])
    expect(ast.arguments[0].quasis[0].value).toBeNull()
  })

  it('processHtmlAst resolves attr.name when attr.key.value is undefined', () => {
    const ast = {
      attributes: [{ name: 'class', value: { value: 'mt-3 container' } }],
    }
    processHtmlAst(ast, ['class'])
    expect(ast.attributes[0].value.value).toBe('container mt-3')
  })

  it('processJsxAst handles JSXAttribute with name.value (not name.name)', () => {
    const ast = {
      type: 'JSXAttribute',
      name: { value: 'className' },
      value: { type: 'StringLiteral', value: 'mt-3 container' },
    }
    processJsxAst(ast, ['className'])
    expect(ast.value.value).toBe('container mt-3')
  })

  it('processJsxAst skips JSXSpreadAttribute with null name', () => {
    const ast = {
      type: 'JSXSpreadAttribute',
      argument: { type: 'Identifier', name: 'props' },
    }
    processJsxAst(ast, ['className'])
    expect(ast.argument.name).toBe('props')
  })

  it('processSvelteAst skips attribute with non-array value', () => {
    const ast = {
      fragment: {
        nodes: [
          {
            attributes: [
              {
                type: 'Attribute',
                name: 'class',
                value: 'mt-3 container',
              },
            ],
          },
        ],
      },
    }
    processSvelteAst(ast, ['class'])
    expect(ast.fragment.nodes[0].attributes[0].value).toBe('mt-3 container')
  })

  it('processHtmlAst skips attr when both attr.name and attr.key.value are falsy', () => {
    const ast = {
      attributes: [{ key: { value: null }, value: { value: 'mt-3 container' } }],
    }
    processHtmlAst(ast, ['class'])
    expect(ast.attributes[0].value.value).toBe('mt-3 container')
  })

  it('processHtmlAst skips attr.value object with non-string .value', () => {
    const ast = {
      attributes: [{ name: 'class', value: { value: 42 } }],
    }
    processHtmlAst(ast, ['class'])
    expect(ast.attributes[0].value.value).toBe(42)
  })

  it('processJsxAst skips JSXAttribute with non-string value type', () => {
    const ast = {
      type: 'JSXAttribute',
      name: { name: 'className' },
      value: { type: 'JSXExpressionContainer', expression: { type: 'Identifier', name: 'styles' } },
    }
    processJsxAst(ast, ['className'])
    expect(ast.value.type).toBe('JSXExpressionContainer')
  })

  it('processJsxAst skips JSXAttribute with falsy name.name and falsy name.value', () => {
    const ast = {
      type: 'JSXAttribute',
      name: { name: null, value: null },
      value: { type: 'StringLiteral', value: 'mt-3 container' },
    }
    processJsxAst(ast, ['className'])
    expect(ast.value.value).toBe('mt-3 container')
  })

  it('walk skips node.body when it is a non-object truthy value', () => {
    const ast = {
      body: 'not-an-object',
      type: 'JSXAttribute',
      name: { name: 'className' },
      value: { type: 'StringLiteral', value: 'mt-3 container' },
    }
    processJsxAst(ast, ['className'])
    expect(ast.value.value).toBe('container mt-3')
  })

  it('sortStringNode handles Literal with falsy raw field', () => {
    const ast = {
      type: 'JSXAttribute',
      name: { name: 'className' },
      value: { type: 'Literal', value: 'mt-3 container', raw: '' },
    }
    processJsxAst(ast, ['className'])
    expect(ast.value.value).toBe('container mt-3')
  })

  it('sortStringNode in CallExpression handles Literal without raw (false branch)', () => {
    const ast = {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'clsx' },
      arguments: [{ type: 'Literal', value: 'mt-3 container' }],
    }
    processJsxAst(ast, ['className'], ['clsx'])
    expect(ast.arguments[0].value).toBe('container mt-3')
  })

  it('processJsxAst handles JSXAttribute with name.name falsy but name.value set', () => {
    const ast = {
      type: 'JSXAttribute',
      name: { name: '', value: 'className' },
      value: { type: 'StringLiteral', value: 'mt-3 container' },
    }
    processJsxAst(ast, ['className'])
    expect(ast.value.value).toBe('container mt-3')
  })

  it('sortStringNode skips unknown node types (false branch of TemplateLiteral check)', () => {
    const ast = {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'clsx' },
      arguments: [{ type: 'Identifier', name: 'myClasses' }],
    }
    processJsxAst(ast, ['className'], ['clsx'])
    expect(ast.arguments[0].name).toBe('myClasses')
  })
})

describe('inline ignore — coverage branches', () => {
  it('sorts normally when sourceText is empty (isIgnored returns false)', () => {
    const ast = {
      attrs: [{ name: 'class', value: 'mt-3 container' }],
      range: [0, 30],
    }
    processHtmlAst(ast, ['class'], [], {}, '')
    expect(ast.attrs[0].value).toBe('container mt-3')
  })

  it('sorts normally when nodeStart is -1 (no range/start/sourceSpan)', () => {
    const ast = {
      attrs: [{ name: 'class', value: 'mt-3 container' }],
    }
    processHtmlAst(ast, ['class'], [], {}, 'some source')
    expect(ast.attrs[0].value).toBe('container mt-3')
  })

  it('uses node.start when node.range is absent', () => {
    const sourceText = '<!-- prettier-bootstrap-ignore-next -->\n<div class="mt-3 container"></div>'
    const nodeStart = sourceText.indexOf('<div')
    const ast = {
      attrs: [{ name: 'class', value: 'mt-3 container' }],
      start: nodeStart,
    }
    processHtmlAst(ast, ['class'], [], {}, sourceText)
    expect(ast.attrs[0].value).toBe('mt-3 container')
  })

  it('uses node.sourceSpan.start.offset when range and start are absent', () => {
    const sourceText = '<!-- prettier-bootstrap-ignore-next -->\n<div class="mt-3 container"></div>'
    const nodeStart = sourceText.indexOf('<div')
    const ast = {
      attrs: [{ name: 'class', value: 'mt-3 container' }],
      sourceSpan: { start: { offset: nodeStart } },
    }
    processHtmlAst(ast, ['class'], [], {}, sourceText)
    expect(ast.attrs[0].value).toBe('mt-3 container')
  })

  it('skips node.attributes path when prettier-bootstrap-ignore-next is set (line 137)', () => {
    const sourceText = '<!-- prettier-bootstrap-ignore-next -->\n<div class="mt-3 container"></div>'
    const nodeStart = sourceText.indexOf('<div')
    const ast = {
      attributes: [{ name: 'class', value: 'mt-3 container' }],
      range: [nodeStart, sourceText.length],
    }
    processHtmlAst(ast, ['class'], [], {}, sourceText)
    expect(ast.attributes[0].value).toBe('mt-3 container')
  })

  it('skips CallExpression path when prettier-bootstrap-ignore-next is set (line 190)', () => {
    const sourceText = '// prettier-bootstrap-ignore-next\nclsx("mt-3 container")'
    const nodeStart = sourceText.indexOf('clsx')
    const ast = {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'clsx' },
      arguments: [{ type: 'StringLiteral', value: 'mt-3 container' }],
      range: [nodeStart, sourceText.length],
    }
    processJsxAst(ast, ['className'], ['clsx'], {}, sourceText)
    expect(ast.arguments[0].value).toBe('mt-3 container')
  })

  it('skips Svelte attribute when prettier-bootstrap-ignore-next is set (line 236)', () => {
    const sourceText = '<!-- prettier-bootstrap-ignore-next -->\n<div class="mt-3 container"></div>'
    const nodeStart = sourceText.indexOf('<div')
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
            range: [nodeStart, sourceText.length],
          },
        ],
      },
    }
    processSvelteAst(ast, ['class'], [], {}, sourceText)
    expect(ast.fragment.nodes[0].attributes[0].value[0].data).toBe('mt-3 container')
  })
})
