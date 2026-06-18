import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts', './src/sorter.ts'],
  format: ['esm', 'cjs'],
  platform: 'node',
  target: 'node20',
  deps: { neverBundle: ['prettier'] },
  clean: true,
  outDir: 'dist',
})
