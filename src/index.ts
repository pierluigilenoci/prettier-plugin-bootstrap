import type { Parser, Plugin } from 'prettier'
import { processHtmlAst, processJsxAst } from './traversal'

const DEFAULT_ATTRIBUTES = ['class', 'className']

type AstProcessor = (ast: any, targetAttrs: string[]) => any

export const options = {
  bootstrapAttributes: {
    type: 'string' as const,
    array: true,
    default: [{ value: [] }],
    category: 'Bootstrap',
    description: 'Additional HTML attributes containing Bootstrap class lists to sort.',
  },
  bootstrapFunctions: {
    type: 'string' as const,
    array: true,
    default: [{ value: [] }],
    category: 'Bootstrap',
    description:
      'Function names whose arguments are Bootstrap class lists (e.g. clsx, classNames).',
  },
}

function createParserWrapper(
  parserName: string,
  processAst: AstProcessor,
  astFormat: string,
): Partial<Parser> {
  const wrapper: Partial<Parser> = {
    astFormat,
    locStart(node: any) {
      return node.range?.[0] ?? node.start ?? node.sourceSpan?.start?.offset ?? 0
    },
    locEnd(node: any) {
      return node.range?.[1] ?? node.end ?? node.sourceSpan?.end?.offset ?? 0
    },
    async parse(text: string, options: any) {
      const plugins = (options.plugins || []) as Plugin[]

      let originalParser: any = null

      for (const plugin of plugins) {
        if (typeof plugin !== 'object' || !plugin.parsers) continue
        const candidate: any = plugin.parsers[parserName]
        if (!candidate) continue

        let resolved: any = candidate
        if (typeof candidate === 'function' && !candidate.parse) {
          resolved = await candidate()
        }

        if (
          resolved &&
          typeof resolved.parse === 'function' &&
          resolved.parse !== wrapper.parse
        ) {
          originalParser = resolved
          break
        }
      }

      if (!originalParser) {
        throw new Error(
          `prettier-plugin-bootstrap: could not find the "${parserName}" parser. ` +
            'Make sure Prettier and the relevant parser plugin are installed.',
        )
      }

      if (originalParser.locStart) {
        wrapper.locStart = originalParser.locStart
      }
      if (originalParser.locEnd) {
        wrapper.locEnd = originalParser.locEnd
      }

      const ast = await originalParser.parse(text, options as any)

      const targetAttrs = [
        ...DEFAULT_ATTRIBUTES,
        ...(options.bootstrapAttributes || []),
      ]

      return processAst(ast, targetAttrs)
    },
  }

  return wrapper
}

export const parsers: Record<string, Partial<Parser>> = {
  html: createParserWrapper('html', processHtmlAst, 'html'),
  vue: createParserWrapper('vue', processHtmlAst, 'html'),
  angular: createParserWrapper('angular', processHtmlAst, 'html'),
  babel: createParserWrapper('babel', processJsxAst, 'estree'),
  'babel-ts': createParserWrapper('babel-ts', processJsxAst, 'estree'),
  typescript: createParserWrapper('typescript', processJsxAst, 'estree'),
  acorn: createParserWrapper('acorn', processJsxAst, 'estree'),
  meriyah: createParserWrapper('meriyah', processJsxAst, 'estree'),
  astro: createParserWrapper('astro', processHtmlAst, 'astro'),
}

export type { BootstrapPluginOptions } from './types'
export { sortClasses, classKey, CLASS_ORDER, BREAKPOINTS } from './class-order'
