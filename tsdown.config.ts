import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  format: 'esm',
  platform: 'node',
  target: 'node20',
  external: ['prettier'],
  clean: true,
  outDir: 'dist',
})
