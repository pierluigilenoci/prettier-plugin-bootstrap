import { describe, it, expect } from 'vitest'
import * as prettier from 'prettier'
import * as plugin from '../src/index'

async function format(code: string, parser: string) {
  return prettier.format(code, {
    parser,
    plugins: [plugin],
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
  })
})
