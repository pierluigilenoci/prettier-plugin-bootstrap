import type { Rule } from 'eslint'
import { sortClassString } from 'prettier-plugin-bootstrap/sorter'

function normalizeValue(raw: string): string {
  return raw.slice(1, -1)
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
      JSXAttribute(node) {
        if (!node.name || !node.value) return
        const attrName =
          typeof node.name.name === 'string'
            ? node.name.name
            : node.name.name?.name ?? ''
        if (attrName !== 'className' && attrName !== 'class') return

        if (
          node.value.type === 'Literal' &&
          typeof node.value.value === 'string'
        ) {
          const raw = context.getSourceCode().getText(node.value)
          const quote = raw[0]
          const value = node.value.value
          const sorted = sortClassString(value)
          if (sorted !== value) {
            context.report({
              node: node.value,
              messageId: 'unsorted',
              data: { expected: sorted },
              fix: (fixer) => fixer.replaceText(node.value!, `${quote}${sorted}${quote}`),
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
