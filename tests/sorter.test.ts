import { describe, it, expect } from 'vitest'
import { createSorter, sortClasses, sortClassString } from '../src/sorter'

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
