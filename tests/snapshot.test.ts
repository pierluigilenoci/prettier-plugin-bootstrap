import { describe, it, expect } from 'vitest'
import * as prettier from 'prettier'
import * as plugin from '../src/index'

async function format(code: string, parser: string, options?: Record<string, any>) {
  return prettier.format(code, {
    parser,
    plugins: [plugin],
    ...options,
  })
}

describe('snapshot — full formatting output', () => {
  it('HTML with multiple Bootstrap classes', async () => {
    const input = `<div class="text-center p-3 container bg-primary text-white mb-4 rounded">
  <button class="px-4 btn btn-primary btn-lg rounded-pill">Click</button>
</div>
`
    const result = await format(input, 'html')
    expect(result).toMatchInlineSnapshot(`
      "<div class="container mb-4 p-3 text-center text-white bg-primary rounded">
        <button class="btn btn-primary btn-lg px-4 rounded-pill">Click</button>
      </div>
      "
    `)
  })

  it('Vue template', async () => {
    const input = `<template>
  <div class="gap-3 align-items-center justify-content-between d-flex">
    <span class="text-primary fw-bold fs-4"></span>
  </div>
</template>
`
    const result = await format(input, 'vue')
    expect(result).toMatchInlineSnapshot(`
      "<template>
        <div class="d-flex justify-content-between align-items-center gap-3">
          <span class="fs-4 fw-bold text-primary"></span>
        </div>
      </template>
      "
    `)
  })

  it('JSX with className', async () => {
    const input = `export default function Card() {
  return <div className="shadow-sm card mb-3 border-0"><h5 className="text-primary card-title">Title</h5></div>;
}
`
    const result = await format(input, 'babel')
    expect(result).toMatchInlineSnapshot(`
      "export default function Card() {
        return (
          <div className="card shadow-sm border-0 mb-3">
            <h5 className="card-title text-primary">Title</h5>
          </div>
        );
      }
      "
    `)
  })

  it('bootstrapFunctions with clsx', async () => {
    const input = `const classes = clsx("mt-3 container p-2", "text-white bg-primary");
`
    const result = await format(input, 'babel', { bootstrapFunctions: ['clsx'] })
    expect(result).toMatchInlineSnapshot(`
      "const classes = clsx("container mt-3 p-2", "text-white bg-primary");
      "
    `)
  })
})
