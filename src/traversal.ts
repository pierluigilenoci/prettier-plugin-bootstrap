import { sortClassString } from './sorting'

const AST_KEYS = [
  'program',
  'expression',
  'left',
  'right',
  'argument',
  'callee',
  'object',
  'property',
  'consequent',
  'alternate',
  'init',
  'test',
  'update',
  'declaration',
  'declarations',
  'openingElement',
  'closingElement',
  'attributes',
  'value',
  'elements',
  'properties',
  'arguments',
] as const

function walk(node: any, visitor: (node: any) => void): void {
  if (!node) return
  visitor(node)

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      walk(child, visitor)
    }
  }

  if (node.body) {
    if (Array.isArray(node.body)) {
      for (const child of node.body) {
        walk(child, visitor)
      }
    } else if (typeof node.body === 'object') {
      walk(node.body, visitor)
    }
  }

  for (const key of AST_KEYS) {
    const child = node[key]
    if (child) {
      if (Array.isArray(child)) {
        for (const item of child) {
          if (item && typeof item === 'object') {
            walk(item, visitor)
          }
        }
      } else if (typeof child === 'object') {
        walk(child, visitor)
      }
    }
  }
}

function sortStringNode(node: any): void {
  if (!node) return

  if (node.type === 'StringLiteral') {
    const sorted = sortClassString(node.value)
    node.value = sorted
    if (node.extra) {
      node.extra.rawValue = sorted
      node.extra.raw = `"${sorted}"`
    }
    return
  }

  if (node.type === 'Literal' && typeof node.value === 'string') {
    const sorted = sortClassString(node.value)
    node.value = sorted
    if (node.raw) {
      const quote = node.raw[0]
      node.raw = `${quote}${sorted}${quote}`
    }
    return
  }

  if (node.type === 'TemplateLiteral' && (!node.expressions || node.expressions.length === 0)) {
    for (const quasi of node.quasis) {
      if (quasi.value && typeof quasi.value.raw === 'string') {
        const sorted = sortClassString(quasi.value.raw)
        quasi.value.raw = sorted
        quasi.value.cooked = sorted
      }
    }
  }
}

export function processHtmlAst(ast: any, targetAttrs: string[], _targetFunctions?: string[]): any {
  walk(ast, (node) => {
    if (node.attrs && Array.isArray(node.attrs)) {
      for (const attr of node.attrs) {
        if (targetAttrs.includes(attr.name) && typeof attr.value === 'string') {
          attr.value = sortClassString(attr.value)
        }
      }
    }

    if (node.attributes && Array.isArray(node.attributes)) {
      for (const attr of node.attributes) {
        const name = attr.name || (attr.key && attr.key.value)
        if (targetAttrs.includes(name) && attr.value) {
          if (typeof attr.value === 'string') {
            if (attr.kind && attr.kind !== 'quoted') continue
            if (attr.value.includes('${')) continue
            attr.value = sortClassString(attr.value)
          } else if (attr.value && typeof attr.value.value === 'string') {
            if (attr.value.value.includes('${')) continue
            attr.value.value = sortClassString(attr.value.value)
          }
        }
      }
    }
  })

  return ast
}

export function processJsxAst(
  ast: any,
  targetAttrs: string[],
  targetFunctions: string[] = [],
): any {
  const functionSet = new Set(targetFunctions)

  walk(ast, (node) => {
    if (node.type === 'JSXAttribute' || node.type === 'JSXSpreadAttribute') {
      const name = node.name && (node.name.name || node.name.value)
      if (targetAttrs.includes(name) && node.value) {
        if (node.value.type === 'StringLiteral' || node.value.type === 'Literal') {
          const sorted = sortClassString(node.value.value)
          node.value.value = sorted
          if (node.value.extra) {
            node.value.extra.rawValue = sorted
            node.value.extra.raw = `"${sorted}"`
          }
          if (node.value.raw) {
            const quote = node.value.raw[0]
            node.value.raw = `${quote}${sorted}${quote}`
          }
        }
      }
    }

    if (node.type === 'CallExpression' && functionSet.size > 0) {
      const callee = node.callee
      if (callee && callee.type === 'Identifier' && functionSet.has(callee.name)) {
        for (const arg of node.arguments || []) {
          sortStringNode(arg)
        }
      }
    }
  })

  return ast
}

function walkSvelte(node: any, visitor: (node: any) => void): void {
  if (!node) return
  visitor(node)

  if (node.fragment && Array.isArray(node.fragment.nodes)) {
    for (const child of node.fragment.nodes) {
      walkSvelte(child, visitor)
    }
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      walkSvelte(child, visitor)
    }
  }
}

export function processSvelteAst(
  ast: any,
  targetAttrs: string[],
  _targetFunctions?: string[],
): any {
  walkSvelte(ast, (node) => {
    if (!node.attributes || !Array.isArray(node.attributes)) return

    for (const attr of node.attributes) {
      if (attr.type !== 'Attribute') continue
      if (!targetAttrs.includes(attr.name)) continue

      if (Array.isArray(attr.value)) {
        for (const item of attr.value) {
          if (item.type === 'Text' && typeof item.data === 'string') {
            const sorted = sortClassString(item.data)
            item.data = sorted
            if (typeof item.raw === 'string') {
              item.raw = sorted
            }
          }
        }
      }
    }
  })

  return ast
}
