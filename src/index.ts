import type { Parser, Plugin } from 'prettier'
import type { BootstrapPluginOptions } from './types'
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
): Partial<Parser> {
  const wrapper: Partial<Parser> = {
    astFormat:
      parserName === 'html' || parserName === 'vue' || parserName === 'angular'
        ? 'html'
        : undefined,
    async parse(text: string, options: any) {
      const plugins = (options.plugins || []) as Plugin[]

      const originalParser = plugins
        .flatMap((plugin) => {
          if (
            typeof plugin === 'object' &&
            plugin.parsers &&
            plugin.parsers[parserName]
          ) {
            return [plugin.parsers[parserName]]
          }
          return []
        })
        .find((parser) => parser.parse !== wrapper.parse)

      if (!originalParser) {
        throw new Error(
          `prettier-plugin-bootstrap: could not find the "${parserName}" parser. ` +
            'Make sure Prettier and the relevant parser plugin are installed.',
        )
      }

      const ast = await originalParser.parse!(text, options as any)

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
  html: createParserWrapper('html', processHtmlAst),
  vue: createParserWrapper('vue', processHtmlAst),
  angular: createParserWrapper('angular', processHtmlAst),
  babel: createParserWrapper('babel', processJsxAst),
  'babel-ts': createParserWrapper('babel-ts', processJsxAst),
  typescript: createParserWrapper('typescript', processJsxAst),
  acorn: createParserWrapper('acorn', processJsxAst),
  meriyah: createParserWrapper('meriyah', processJsxAst),
  astro: createParserWrapper('astro', processHtmlAst),
}

export type { BootstrapPluginOptions } from './types'
export { sortClasses, classKey, CLASS_ORDER, BREAKPOINTS } from './class-order'
