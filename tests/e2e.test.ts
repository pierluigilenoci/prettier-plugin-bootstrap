import { describe, it, expect } from 'vitest'
import * as prettier from 'prettier'
import * as plugin from '../src/index'
import { buildAttrMatcher } from '../src/index'

async function format(code: string, parser: string, options?: Record<string, any>) {
  return prettier.format(code, {
    parser,
    plugins: [plugin],
    ...options,
  })
}

describe('e2e — prettier.format() with plugin', () => {
  describe('HTML parser', () => {
    it('sorts class attributes in HTML', async () => {
      const input = '<div class="text-center container p-3 bg-primary"></div>\n'
      const result = await format(input, 'html')
      expect(result).toContain('class="container p-3 text-center bg-primary"')
    })

    it('preserves non-class attributes', async () => {
      const input = '<div id="main" class="mt-3 container" data-bs-toggle="modal"></div>\n'
      const result = await format(input, 'html')
      expect(result).toContain('id="main"')
      expect(result).toContain('data-bs-toggle="modal"')
      expect(result).toContain('class="container mt-3"')
    })

    it('handles multiple elements', async () => {
      const input = `<div class="p-3 container">
  <span class="text-primary fw-bold"></span>
</div>
`
      const result = await format(input, 'html')
      expect(result).toContain('class="container p-3"')
      expect(result).toContain('class="fw-bold text-primary"')
    })

    it('skips template literal attributes', async () => {
      const input = '<div class="container ${dynamicClass} p-3"></div>\n'
      const result = await format(input, 'html')
      expect(result).toContain('${dynamicClass}')
    })
  })

  describe('Angular parser', () => {
    it('sorts class attributes in Angular templates', async () => {
      const input = '<div class="mt-3 container p-2"></div>\n'
      const result = await format(input, 'angular')
      expect(result).toContain('class="container mt-3 p-2"')
    })
  })

  describe('Vue parser', () => {
    it('sorts class attributes in Vue templates', async () => {
      const input = '<template><div class="mb-3 btn btn-primary"></div></template>\n'
      const result = await format(input, 'vue')
      expect(result).toContain('class="btn btn-primary mb-3"')
    })
  })

  describe('JSX parsers', () => {
    it('sorts className in JSX (babel)', async () => {
      const input = 'export default () => <div className="text-white container p-4"></div>;\n'
      const result = await format(input, 'babel')
      expect(result).toContain('className="container p-4 text-white"')
    })

    it('sorts className in TSX (typescript)', async () => {
      const input =
        'const App: React.FC = () => <div className="mt-3 d-flex align-items-center"></div>;\n'
      const result = await format(input, 'typescript')
      expect(result).toContain('className="d-flex align-items-center mt-3"')
    })
  })

  describe('edge cases', () => {
    it('handles empty class attribute', async () => {
      const input = '<div class=""></div>\n'
      const result = await format(input, 'html')
      expect(result).toContain('class=""')
    })

    it('handles single class', async () => {
      const input = '<div class="container"></div>\n'
      const result = await format(input, 'html')
      expect(result).toContain('class="container"')
    })

    it('preserves unknown classes in original order', async () => {
      const input = '<div class="custom-class another-custom"></div>\n'
      const result = await format(input, 'html')
      expect(result).toContain('class="custom-class another-custom"')
    })

    it('throws when parser is not available', async () => {
      const parser = plugin.parsers.html!
      await expect(parser.parse!('<div></div>', { plugins: [] } as any)).rejects.toThrow(
        'could not find the "html" parser',
      )
    })

    it('locStart/locEnd use fallback values', async () => {
      // Import fresh to get unmodified locStart/locEnd before any parse() call overwrites them
      const freshPlugin = await import('../src/index')
      const parser = freshPlugin.parsers.meriyah!
      expect(parser.locStart!({ range: [5, 10] })).toBe(5)
      expect(parser.locEnd!({ range: [5, 10] })).toBe(10)
      expect(parser.locStart!({ start: 3 })).toBe(3)
      expect(parser.locEnd!({ end: 7 })).toBe(7)
      expect(parser.locStart!({ sourceSpan: { start: { offset: 2 } } })).toBe(2)
      expect(parser.locEnd!({ sourceSpan: { end: { offset: 9 } } })).toBe(9)
      expect(parser.locStart!({})).toBe(0)
      expect(parser.locEnd!({})).toBe(0)
    })

    it('handles lazy parser function (candidate as async function)', async () => {
      const realHtmlParser = (await import('prettier/plugins/html')).default.parsers!.html
      const lazyPlugin = {
        parsers: {
          html: Object.assign(async () => realHtmlParser, {}),
        },
      }
      const parser = plugin.parsers.html!
      const ast = await parser.parse!('<div class="mt-3 container"></div>', {
        plugins: [{ parsers: { html: lazyPlugin.parsers.html } }],
        bootstrapAttributes: [],
      } as any)
      expect(ast).toBeDefined()
    })

    it('skips plugin whose resolved parse is the wrapper itself', async () => {
      const result = await prettier.format('<div class="mt-3 container"></div>\n', {
        parser: 'html',
        plugins: [plugin, { parsers: { html: plugin.parsers.html } } as any],
      })
      expect(result).toContain('class="container mt-3"')
    })

    it('uses fallback empty array when bootstrapAttributes is undefined', async () => {
      const parser = plugin.parsers.html!
      const realHtmlParser = (await import('prettier/plugins/html')).default.parsers!.html
      const wrapperPlugin = { parsers: { html: realHtmlParser } }
      const ast = await parser.parse!('<div class="mt-3 container"></div>', {
        plugins: [wrapperPlugin],
        bootstrapAttributes: undefined,
      } as any)
      expect(ast).toBeDefined()
    })

    it('handles options.plugins being undefined', async () => {
      const parser = plugin.parsers.html!
      await expect(parser.parse!('<div></div>', { plugins: undefined } as any)).rejects.toThrow(
        'could not find the "html" parser',
      )
    })

    it('skips string plugins and plugins without parsers', async () => {
      const parser = plugin.parsers.html!
      const realHtmlParser = (await import('prettier/plugins/html')).default.parsers!.html
      const result = await parser.parse!('<div class="mt-3 container"></div>', {
        plugins: [
          'some-string-plugin',
          { name: 'no-parsers' },
          { parsers: { html: realHtmlParser } },
        ],
        bootstrapAttributes: [],
      } as any)
      expect(result).toBeDefined()
    })

    it('skips plugin where resolved.parse equals wrapper.parse', async () => {
      const parser = plugin.parsers.html!
      const realHtmlParser = (await import('prettier/plugins/html')).default.parsers!.html
      const selfRef = { parsers: { html: { parse: parser.parse } } }
      const result = await parser.parse!('<div class="mt-3 container"></div>', {
        plugins: [selfRef, { parsers: { html: realHtmlParser } }],
        bootstrapAttributes: [],
      } as any)
      expect(result).toBeDefined()
    })

    it('handles whitespace-only class value', async () => {
      const input = '<div class="   "></div>\n'
      const result = await format(input, 'html')
      expect(result).toBeDefined()
    })
  })

  describe('bootstrapFunctions', () => {
    it('sorts string arguments in configured function calls', async () => {
      const input = 'const x = clsx("mt-3 container p-2");\n'
      const result = await format(input, 'babel', { bootstrapFunctions: ['clsx'] })
      expect(result).toContain('clsx("container mt-3 p-2")')
    })

    it('sorts multiple arguments', async () => {
      const input = 'const x = clsx("mt-3 container", "p-2 row");\n'
      const result = await format(input, 'babel', { bootstrapFunctions: ['clsx'] })
      expect(result).toContain('"container mt-3"')
      expect(result).toContain('"row p-2"')
    })

    it('ignores non-configured function calls', async () => {
      const input = 'const x = someOther("mt-3 container");\n'
      const result = await format(input, 'babel', { bootstrapFunctions: ['clsx'] })
      expect(result).toContain('"mt-3 container"')
    })

    it('works with typescript parser', async () => {
      const input = 'const x: string = cn("mt-3 container");\n'
      const result = await format(input, 'typescript', { bootstrapFunctions: ['cn'] })
      expect(result).toContain('cn("container mt-3")')
    })

    it('handles template literals without expressions', async () => {
      const input = 'const x = clsx(`mt-3 container`);\n'
      const result = await format(input, 'babel', { bootstrapFunctions: ['clsx'] })
      expect(result).toContain('`container mt-3`')
    })

    it('does nothing when bootstrapFunctions is empty', async () => {
      const input = 'const x = clsx("mt-3 container");\n'
      const result = await format(input, 'babel')
      expect(result).toContain('"mt-3 container"')
    })
  })

  describe('regex bootstrapAttributes', () => {
    it('matches attributes via regex pattern', async () => {
      const input = '<div data-class="mt-3 container"></div>\n'
      const result = await format(input, 'html', {
        bootstrapAttributes: ['/^data-class/'],
      })
      expect(result).toContain('data-class="container mt-3"')
    })

    it('does not match non-matching regex', async () => {
      const input = '<div title="mt-3 container"></div>\n'
      const result = await format(input, 'html', {
        bootstrapAttributes: ['/^data-/'],
      })
      expect(result).toContain('title="mt-3 container"')
    })

    it('supports mixed plain and regex attributes', async () => {
      const input = '<div ngClass="mt-3 container" data-cls="p-3 row"></div>\n'
      const result = await format(input, 'html', {
        bootstrapAttributes: ['ngClass', '/^data-cls/'],
      })
      expect(result).toContain('ngClass="container mt-3"')
      expect(result).toContain('data-cls="row p-3"')
    })
  })

  describe('buildAttrMatcher', () => {
    it('matches plain attributes', () => {
      const matcher = buildAttrMatcher(['class', 'className'])
      expect(matcher('class')).toBe(true)
      expect(matcher('className')).toBe(true)
      expect(matcher('id')).toBe(false)
    })

    it('matches regex patterns', () => {
      const matcher = buildAttrMatcher(['/^data-class/'])
      expect(matcher('data-class')).toBe(true)
      expect(matcher('data-classes')).toBe(true)
      expect(matcher('class')).toBe(false)
    })

    it('supports regex flags', () => {
      const matcher = buildAttrMatcher(['/^CLASS$/i'])
      expect(matcher('CLASS')).toBe(true)
      expect(matcher('class')).toBe(true)
      expect(matcher('Class')).toBe(true)
    })
  })

  describe('prettier-bootstrap-ignore comment', () => {
    it('skips sorting with HTML ignore comment', async () => {
      const input = '<!-- prettier-bootstrap-ignore -->\n<div class="mt-3 container"></div>\n'
      const result = await format(input, 'html')
      expect(result).toContain('class="mt-3 container"')
    })

    it('skips sorting with JS single-line ignore comment', async () => {
      const input =
        '// prettier-bootstrap-ignore\nexport default () => <div className="mt-3 container"></div>;\n'
      const result = await format(input, 'babel')
      expect(result).toContain('className="mt-3 container"')
    })

    it('skips sorting with JS block ignore comment', async () => {
      const input =
        '/* prettier-bootstrap-ignore */\nexport default () => <div className="mt-3 container"></div>;\n'
      const result = await format(input, 'babel')
      expect(result).toContain('className="mt-3 container"')
    })

    it('sorts normally without ignore comment', async () => {
      const input = '<div class="mt-3 container"></div>\n'
      const result = await format(input, 'html')
      expect(result).toContain('class="container mt-3"')
    })
  })

  describe('bootstrapVersion option', () => {
    it('accepts bootstrapVersion without error', async () => {
      const input = '<div class="mt-3 container"></div>\n'
      const result = await format(input, 'html', { bootstrapVersion: 5 })
      expect(result).toContain('class="container mt-3"')
    })
  })

  describe('bootstrapPreserveWhitespace option', () => {
    it('preserves multi-space separators in JSX', async () => {
      const input = 'export default () => <div className="mt-3  container"></div>;\n'
      const result = await format(input, 'babel', { bootstrapPreserveWhitespace: true })
      expect(result).toContain('className="container  mt-3"')
    })
  })

  describe('bootstrapPreserveDuplicates option', () => {
    it('removes duplicates when set to false', async () => {
      const input = '<div class="mt-3 container mt-3"></div>\n'
      const result = await format(input, 'html', { bootstrapPreserveDuplicates: false })
      expect(result).toContain('class="container mt-3"')
    })

    it('preserves duplicates by default', async () => {
      const input = '<div class="mt-3 container mt-3"></div>\n'
      const result = await format(input, 'html')
      expect(result).toContain('class="container mt-3 mt-3"')
    })
  })
})
