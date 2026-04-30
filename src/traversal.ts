import { sortClassString } from './sorting'

/* eslint-disable @typescript-eslint/no-explicit-any */

const AST_KEYS = [
  'program', 'expression', 'left', 'right', 'argument', 'callee',
  'object', 'property', 'consequent', 'alternate', 'init', 'test',
  'update', 'declaration', 'declarations', 'openingElement',
  'closingElement', 'attributes', 'value', 'elements', 'properties',
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

export function processHtmlAst(ast: any, targetAttrs: string[]): any {
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
            attr.value = sortClassString(attr.value)
          } else if (attr.value && typeof attr.value.value === 'string') {
            attr.value.value = sortClassString(attr.value.value)
          }
        }
      }
    }
  })

  return ast
}

export function processJsxAst(ast: any, targetAttrs: string[]): any {
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
  })

  return ast
}
