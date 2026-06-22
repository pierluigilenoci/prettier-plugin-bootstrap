import type { Parser, Plugin } from 'prettier'
import { processHtmlAst, processJsxAst, processSvelteAst } from './traversal'
import type { SortOptions } from './types'

const DEFAULT_ATTRIBUTES = ['class', 'className']

const IGNORE_RE =
  /(?:<!--\s*prettier-bootstrap-ignore\s*-->|\/\/\s*prettier-bootstrap-ignore|\/\*\s*prettier-bootstrap-ignore\s*\*\/)/

type AstProcessor = (
  ast: any,
  attrMatcher: (name: string) => boolean,
  targetFunctions: string[],
  sortOptions: SortOptions,
  sourceText: string,
) => any

export const options = {
  bootstrapAttributes: {
    type: 'string' as const,
    array: true as const,
    default: [{ value: [] }],
    category: 'Bootstrap',
    description: 'Additional HTML attributes containing Bootstrap class lists to sort.',
  },
  bootstrapFunctions: {
    type: 'string' as const,
    array: true as const,
    default: [{ value: [] }],
    category: 'Bootstrap',
    description:
      'Function names whose arguments are Bootstrap class lists (e.g. clsx, classNames).',
  },
  bootstrapPreserveWhitespace: {
    type: 'boolean' as const,
    default: false,
    category: 'Bootstrap',
    description:
      'Preserve original whitespace between classes instead of normalizing to single spaces.',
  },
  bootstrapPreserveDuplicates: {
    type: 'boolean' as const,
    default: true,
    category: 'Bootstrap',
    description: 'Keep duplicate class names. Set to false to remove duplicates.',
  },
  bootstrapVersion: {
    type: 'int' as const,
    default: 5,
    category: 'Bootstrap',
    description: 'Bootstrap version (for future version-specific sorting rules).',
  },
}

function buildAttrMatcher(allAttrs: string[]): (name: string) => boolean {
  const plainAttrs: string[] = []
  const regexAttrs: RegExp[] = []
  for (const attr of allAttrs) {
    const m = attr.match(/^\/(.+)\/([gimsuy]*)$/)
    if (m) regexAttrs.push(new RegExp(m[1], m[2]))
    else plainAttrs.push(attr)
  }
  return (name: string) => plainAttrs.includes(name) || regexAttrs.some((re) => re.test(name))
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

        if (resolved && typeof resolved.parse === 'function' && resolved.parse !== wrapper.parse) {
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

      if (originalParser.astFormat) {
        wrapper.astFormat = originalParser.astFormat
      }

      const ast = await originalParser.parse(text, options as any)

      if (IGNORE_RE.test(text.slice(0, 1500))) {
        return ast
      }

      const targetAttrs = [...DEFAULT_ATTRIBUTES, ...(options.bootstrapAttributes || [])]
      const targetFunctions = options.bootstrapFunctions || []
      const attrMatcher = buildAttrMatcher(targetAttrs)

      const sortOptions: SortOptions = {
        preserveWhitespace: options.bootstrapPreserveWhitespace ?? false,
        preserveDuplicates: options.bootstrapPreserveDuplicates ?? true,
        bootstrapVersion: options.bootstrapVersion ?? 5,
      }

      return processAst(ast, attrMatcher, targetFunctions, sortOptions, text)
    },
  }

  return wrapper
}

export const parsers: Record<string, Parser> = {
  html: createParserWrapper('html', processHtmlAst, 'html') as Parser,
  vue: createParserWrapper('vue', processHtmlAst, 'html') as Parser,
  angular: createParserWrapper('angular', processHtmlAst, 'html') as Parser,
  babel: createParserWrapper('babel', processJsxAst, 'estree') as Parser,
  'babel-ts': createParserWrapper('babel-ts', processJsxAst, 'estree') as Parser,
  typescript: createParserWrapper('typescript', processJsxAst, 'estree') as Parser,
  acorn: createParserWrapper('acorn', processJsxAst, 'estree') as Parser,
  meriyah: createParserWrapper('meriyah', processJsxAst, 'estree') as Parser,
  astro: createParserWrapper('astro', processHtmlAst, 'astro') as Parser,
  svelte: createParserWrapper('svelte', processSvelteAst, 'svelte-ast') as Parser,
}

export { buildAttrMatcher }
export type { BootstrapPluginOptions, SortOptions } from './types'
export { sortClasses, classKey, CLASS_ORDER, BREAKPOINTS } from './class-order'
