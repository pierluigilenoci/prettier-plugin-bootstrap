declare module 'prettier-plugin-astro' {
  import type { Plugin } from 'prettier'
  const parsers: Plugin['parsers']
  const printers: Plugin['printers']
  const languages: Plugin['languages']
  const options: Plugin['options']
  const defaultOptions: Plugin['defaultOptions']
  export { parsers, printers, languages, options, defaultOptions }
}
