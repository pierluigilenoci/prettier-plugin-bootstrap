import { describe, it, expect } from 'vitest'
import {
  createSorter,
  sortClasses,
  sortClassString,
  sortClassesV4,
  CLASS_ORDER_V4,
  BREAKPOINTS_V4,
  classKeyV4,
} from '../src/sorter'
import type { SortKey } from '../src/sorter'

describe('createSorter', () => {
  it('returns a Sorter with sort and sortClasses methods', () => {
    const sorter = createSorter()
    expect(typeof sorter.sort).toBe('function')
    expect(typeof sorter.sortClasses).toBe('function')
  })

  it('sort() sorts a class string', () => {
    const sorter = createSorter()
    expect(sorter.sort('mt-3 container p-2')).toBe('container mt-3 p-2')
  })

  it('sortClasses() sorts an array of classes', () => {
    const sorter = createSorter()
    expect(sorter.sortClasses(['mt-3', 'container', 'p-2'])).toEqual(['container', 'mt-3', 'p-2'])
  })

  it('respects preserveDuplicates: false', () => {
    const sorter = createSorter({ preserveDuplicates: false })
    expect(sorter.sort('mt-3 container mt-3 p-2')).toBe('container mt-3 p-2')
    expect(sorter.sortClasses(['mt-3', 'container', 'mt-3', 'p-2'])).toEqual([
      'container',
      'mt-3',
      'p-2',
    ])
  })

  it('preserves duplicates by default', () => {
    const sorter = createSorter()
    expect(sorter.sort('mt-3 container mt-3')).toBe('container mt-3 mt-3')
  })

  it('respects preserveWhitespace', () => {
    const sorter = createSorter({ preserveWhitespace: true })
    expect(sorter.sort('mt-3  container')).toBe('container  mt-3')
  })
})

describe('direct exports', () => {
  it('exports sortClasses', () => {
    expect(sortClasses(['mt-3', 'container'])).toEqual(['container', 'mt-3'])
  })

  it('exports sortClassString', () => {
    expect(sortClassString('mt-3 container')).toBe('container mt-3')
  })
})

describe('Bootstrap 4 public API exports', () => {
  it('exports sortClassesV4', () => {
    expect(sortClassesV4(['mt-3', 'container'])).toEqual(['container', 'mt-3'])
  })

  it('exports CLASS_ORDER_V4 as a non-empty array', () => {
    expect(Array.isArray(CLASS_ORDER_V4)).toBe(true)
    expect(CLASS_ORDER_V4.length).toBeGreaterThan(0)
  })

  it('exports BREAKPOINTS_V4 without xxl', () => {
    expect(BREAKPOINTS_V4).toContain('sm')
    expect(BREAKPOINTS_V4).toContain('xl')
    expect(BREAKPOINTS_V4).not.toContain('xxl')
  })

  it('exports classKeyV4 as a function', () => {
    expect(typeof classKeyV4).toBe('function')
    const key: SortKey = classKeyV4('container')
    expect(key[0]).not.toBe(Infinity)
    expect(key[1]).toBe(0)
  })

  it('SortKey type is usable at call sites', () => {
    const key: SortKey = classKeyV4('btn')
    expect(Array.isArray(key)).toBe(true)
    expect(key).toHaveLength(2)
  })

  it('Bootstrap 4 sorter uses ml-/mr- instead of ms-/me-', () => {
    const sorted = sortClassesV4(['container', 'ml-3', 'mr-2'])
    expect(sorted[0]).toBe('container')
    const mlIdx = sorted.indexOf('ml-3')
    const mrIdx = sorted.indexOf('mr-2')
    expect(mlIdx).toBeGreaterThan(-1)
    expect(mrIdx).toBeGreaterThan(-1)
  })
})
