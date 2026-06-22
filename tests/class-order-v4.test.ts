import { describe, it, expect } from 'vitest'
import { sortClassesV4, classKeyV4, CLASS_ORDER_V4, BREAKPOINTS_V4 } from '../src/class-order-v4'
import { sortClassString } from '../src/sorting'

describe('Bootstrap 4 class order', () => {
  it('sorts Bootstrap 4 layout classes correctly', () => {
    const sorted = sortClassesV4(['mt-3', 'container', 'row'])
    expect(sorted.indexOf('container')).toBeLessThan(sorted.indexOf('row'))
    expect(sorted.indexOf('row')).toBeLessThan(sorted.indexOf('mt-3'))
  })

  it('uses ml-/mr- instead of ms-/me-', () => {
    const sorted = sortClassesV4(['mr-3', 'container', 'ml-2'])
    expect(sorted.indexOf('container')).toBeLessThan(sorted.indexOf('ml-2'))
    expect(sorted.indexOf('container')).toBeLessThan(sorted.indexOf('mr-3'))
    const [mlIdx] = classKeyV4('ml-2')
    const [mrIdx] = classKeyV4('mr-3')
    expect(mlIdx).not.toBe(Infinity)
    expect(mrIdx).not.toBe(Infinity)
  })

  it('handles Bootstrap 4-specific classes (sr-only, jumbotron, media)', () => {
    const [srIdx] = classKeyV4('sr-only')
    const [jumbotronIdx] = classKeyV4('jumbotron')
    const [mediaIdx] = classKeyV4('media')
    expect(srIdx).not.toBe(Infinity)
    expect(jumbotronIdx).not.toBe(Infinity)
    expect(mediaIdx).not.toBe(Infinity)
  })

  it('treats Bootstrap 5-only classes as unknown', () => {
    const [msIdx] = classKeyV4('ms-3')
    const [vstackIdx] = classKeyV4('vstack')
    const [gapIdx] = classKeyV4('gap-3')
    expect(msIdx).toBe(Infinity)
    expect(vstackIdx).toBe(Infinity)
    expect(gapIdx).toBe(Infinity)
  })

  it('handles Bootstrap 4 breakpoints (no xxl)', () => {
    expect(BREAKPOINTS_V4).not.toContain('xxl')
    const [, bpIdx] = classKeyV4('d-xl-flex')
    expect(bpIdx).not.toBe(0)
  })

  it('CLASS_ORDER_V4 has no duplicates', () => {
    const seen = new Set<string>()
    for (const entry of CLASS_ORDER_V4) {
      expect(seen.has(entry)).toBe(false)
      seen.add(entry)
    }
  })

  it('sortClassString uses Bootstrap 4 order when bootstrapVersion is 4', () => {
    const result = sortClassString('mr-3 container ml-2', { bootstrapVersion: 4 })
    const parts = result.split(' ')
    expect(parts.indexOf('container')).toBeLessThan(parts.indexOf('ml-2'))
    expect(parts.indexOf('container')).toBeLessThan(parts.indexOf('mr-3'))
  })

  it('sortClassString uses Bootstrap 5 order by default', () => {
    const result = sortClassString('ms-3 container me-2')
    const parts = result.split(' ')
    expect(parts.indexOf('container')).toBeLessThan(parts.indexOf('ms-3'))
  })

  it('sorts responsive Bootstrap 4 classes (breakpoint branch)', () => {
    const sorted = sortClassesV4(['d-md-flex', 'd-flex', 'd-lg-none'])
    expect(sorted).toEqual(['d-flex', 'd-md-flex', 'd-lg-none'])
  })

  it('preserves original order for two unknown classes with same key (tiebreaker branch)', () => {
    const sorted = sortClassesV4(['acme-b', 'acme-a'])
    expect(sorted).toEqual(['acme-b', 'acme-a'])
  })

  it('resolves longest matching prefix over shorter one (false branch of prefix.length > bestLen)', () => {
    const [floatLeftIdx] = classKeyV4('float-left')
    const [floatIdx] = classKeyV4('float-start')
    expect(floatLeftIdx).not.toBe(Infinity)
    expect(floatLeftIdx).not.toBe(floatIdx)
  })
})
