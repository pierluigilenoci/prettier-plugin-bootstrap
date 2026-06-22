import type { Rule } from 'eslint'
import { sortClassString } from 'prettier-plugin-bootstrap/sorter'

type LiteralValue = { type: 'Literal'; value: unknown; raw?: string }
type JSXValue = LiteralValue | { type: string }

type JSXAttributeShape = {
  name: { name?: string; namespace?: unknown } | { name: unknown }
  value: JSXValue | null
}

const sortClasses: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    schema: [],
    messages: {
      unsorted: 'Bootstrap classes should be sorted. Expected: "{{expected}}"',
    },
    docs: {
      description: 'Enforce sorted Bootstrap CSS class order',
      recommended: true,
    },
  },
  create(context) {
    return {
      JSXAttribute(node: Rule.Node) {
        const jsxAttr = node as Rule.Node & JSXAttributeShape
        if (!jsxAttr.value) return
        const attrName =
          'name' in jsxAttr.name && typeof jsxAttr.name.name === 'string'
            ? jsxAttr.name.name
            : ''
        if (attrName !== 'className' && attrName !== 'class') return

        const val = jsxAttr.value
        if (val.type === 'Literal' && typeof (val as LiteralValue).value === 'string') {
          const litVal = val as LiteralValue
          const valueNode = { ...litVal } as unknown as Rule.Node
          const rawValue = context.sourceCode.getText(node).match(/=(.+)$/)?.[1] ?? `"${litVal.value}"`
          const quote = rawValue[0] ?? '"'
          const value = litVal.value as string
          const sorted = sortClassString(value)
          if (sorted !== value) {
            context.report({
              node,
              messageId: 'unsorted',
              data: { expected: sorted },
              fix: (fixer) =>
                fixer.replaceText(valueNode, `${quote}${sorted}${quote}`),
            })
          }
        }
      },
    }
  },
}

export const rules = { 'sort-classes': sortClasses }

export default {
  rules,
  configs: {
    recommended: {
      plugins: ['bootstrap-order'],
      rules: {
        'bootstrap-order/sort-classes': 'warn',
      },
    },
  },
}
