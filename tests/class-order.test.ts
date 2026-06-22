import { describe, it, expect } from 'vitest'
import { sortClasses, classKey, CLASS_ORDER, BREAKPOINTS } from '../src/class-order'

describe('classKey', () => {
  it('returns a finite category index for known Bootstrap classes', () => {
    const knownClasses = ['container', 'row', 'col', 'btn', 'd-flex', 'm-3', 'p-2', 'text-center']
    for (const cls of knownClasses) {
      const [catIdx] = classKey(cls)
      expect(catIdx).not.toBe(Infinity)
    }
  })

  it('returns Infinity for unknown classes', () => {
    const [catIdx] = classKey('acme-widget')
    expect(catIdx).toBe(Infinity)
  })

  it('returns breakpoint index 0 for base classes', () => {
    const [, bpIdx] = classKey('d-flex')
    expect(bpIdx).toBe(0)
  })

  it('extracts responsive infix correctly', () => {
    const [catIdx, bpIdx] = classKey('d-md-flex')
    expect(catIdx).not.toBe(Infinity)
    expect(bpIdx).toBe(BREAKPOINTS.indexOf('md') + 1)
  })

  it('handles all breakpoint sizes', () => {
    for (const [i, bp] of BREAKPOINTS.entries()) {
      const [, bpIdx] = classKey(`d-${bp}-flex`)
      expect(bpIdx).toBe(i + 1)
    }
  })

  it('matches exact prefixes over shorter ones', () => {
    const [fluidIdx] = classKey('container-fluid')
    const [containerIdx] = classKey('container')
    expect(fluidIdx).toBeLessThan(containerIdx)
  })

  it('resolves longest matching prefix when shorter prefix also matches', () => {
    // 'text-decoration-' (idx 199) appears before 'text-' (idx 200) in CLASS_ORDER.
    // Iterating ORDER_MAP: longer prefix is found first, then shorter — the false branch
    // of `prefix.length > bestLen` is hit when the shorter is encountered second.
    const [tdIdx] = classKey('text-decoration-underline')
    const [tIdx] = classKey('text-center')
    expect(tdIdx).not.toBe(tIdx)
    expect(tdIdx).not.toBe(Infinity)
  })
})

describe('sortClasses', () => {
  it('returns single-element arrays unchanged', () => {
    expect(sortClasses(['btn'])).toEqual(['btn'])
  })

  it('sorts layout before components', () => {
    const sorted = sortClasses(['btn', 'container', 'row'])
    expect(sorted.indexOf('container')).toBeLessThan(sorted.indexOf('btn'))
    expect(sorted.indexOf('row')).toBeLessThan(sorted.indexOf('btn'))
  })

  it('sorts components before utilities', () => {
    const sorted = sortClasses(['d-flex', 'btn', 'p-3'])
    expect(sorted.indexOf('btn')).toBeLessThan(sorted.indexOf('d-flex'))
    expect(sorted.indexOf('btn')).toBeLessThan(sorted.indexOf('p-3'))
  })

  it('sorts utilities in _utilities.scss order', () => {
    const classes = [
      'rounded',
      'bg-primary',
      'text-center',
      'p-3',
      'm-2',
      'd-flex',
      'border',
      'shadow',
      'w-100',
    ]
    const sorted = sortClasses(classes)
    const idx = (cls: string) => sorted.indexOf(cls)

    expect(idx('d-flex')).toBeLessThan(idx('shadow'))
    expect(idx('shadow')).toBeLessThan(idx('border'))
    expect(idx('border')).toBeLessThan(idx('w-100'))
    expect(idx('w-100')).toBeLessThan(idx('m-2'))
    expect(idx('m-2')).toBeLessThan(idx('p-3'))
    expect(idx('p-3')).toBeLessThan(idx('text-center'))
    expect(idx('bg-primary')).toBeLessThan(idx('rounded'))
  })

  it('sorts responsive variants after base class', () => {
    const sorted = sortClasses(['d-md-flex', 'd-flex', 'd-lg-none'])
    expect(sorted).toEqual(['d-flex', 'd-md-flex', 'd-lg-none'])
  })

  it('preserves order of unknown classes', () => {
    const sorted = sortClasses(['acme-b', 'acme-a', 'btn'])
    expect(sorted.indexOf('btn')).toBeLessThan(sorted.indexOf('acme-b'))
    expect(sorted.indexOf('acme-b')).toBeLessThan(sorted.indexOf('acme-a'))
  })

  it('handles a realistic Bootstrap class list', () => {
    const input = ['text-center', 'p-3', 'container', 'bg-primary', 'text-white', 'mb-4', 'rounded']
    const sorted = sortClasses(input)
    expect(sorted[0]).toBe('container')
    expect(sorted).toHaveLength(input.length)
  })

  it('handles mixed component and utility classes', () => {
    const input = ['mt-3', 'card', 'shadow-sm', 'card-body', 'p-4']
    const sorted = sortClasses(input)
    expect(sorted.indexOf('card')).toBeLessThan(sorted.indexOf('mt-3'))
    expect(sorted.indexOf('card-body')).toBeLessThan(sorted.indexOf('mt-3'))
  })

  it('handles spacing utility ordering (margin before padding)', () => {
    const sorted = sortClasses(['p-3', 'm-2', 'py-1', 'mx-auto'])
    expect(sorted.indexOf('m-2')).toBeLessThan(sorted.indexOf('p-3'))
    expect(sorted.indexOf('mx-auto')).toBeLessThan(sorted.indexOf('py-1'))
  })
})

describe('CLASS_ORDER', () => {
  it('has no duplicate entries', () => {
    const seen = new Set<string>()
    for (const entry of CLASS_ORDER) {
      expect(seen.has(entry)).toBe(false)
      seen.add(entry)
    }
  })

  it('starts with layout classes', () => {
    expect(CLASS_ORDER[0]).toMatch(/^container/)
  })
})

describe('sorter public API exports', () => {
  it('exports CLASS_ORDER, BREAKPOINTS, and classKey from sorter entry point', async () => {
    const sorterModule = await import('../src/sorter')
    expect(sorterModule.CLASS_ORDER).toBe(CLASS_ORDER)
    expect(sorterModule.BREAKPOINTS).toBeDefined()
    expect(typeof sorterModule.classKey).toBe('function')
  })
})

describe('Bootstrap 5.3 known classes are sortable', () => {
  const knownClasses = [
    // Layout
    'container', 'container-fluid', 'container-sm', 'row', 'col', 'col-1', 'col-md-6',
    'g-3', 'gx-2', 'gy-4',
    // Typography
    'h1', 'lead', 'display-1', 'blockquote',
    // Forms
    'form-control', 'form-select', 'form-check', 'form-floating', 'input-group',
    // Buttons
    'btn', 'btn-primary', 'btn-lg', 'btn-close',
    // Components
    'card', 'card-body', 'navbar', 'nav', 'modal', 'alert', 'badge',
    'dropdown', 'accordion', 'carousel', 'spinner-border', 'offcanvas', 'placeholder',
    'list-group', 'pagination', 'progress', 'toast', 'breadcrumb',
    // Helpers (Bootstrap 5.3)
    'clearfix', 'hstack', 'vstack', 'vr', 'stretched-link', 'text-truncate', 'text-break',
    'visually-hidden', 'fixed-top', 'sticky-top', 'icon-link', 'ratio',
    // Utilities
    'd-flex', 'd-none', 'd-md-block',
    'float-start', 'float-end',
    'overflow-hidden', 'overflow-x-auto', 'overflow-y-scroll',
    'object-fit-cover', 'object-fit-contain',
    'opacity-50',
    'shadow', 'shadow-sm',
    'focus-ring',
    'position-relative', 'position-absolute',
    'border', 'border-primary', 'border-2',
    'rounded', 'rounded-pill', 'rounded-3',
    'w-100', 'h-100', 'mw-100', 'vh-100',
    'flex-row', 'flex-column', 'justify-content-center', 'align-items-center',
    'order-1', 'order-last',
    'm-3', 'mx-auto', 'mt-2', 'mb-4', 'p-3', 'px-4', 'py-2',
    'gap-3', 'gap-md-3', 'row-gap-2', 'column-gap-2',
    'fs-1', 'fw-bold', 'fst-italic', 'lh-1',
    'text-center', 'text-primary', 'text-opacity-50',
    'text-decoration-underline',
    'bg-primary', 'bg-opacity-50', 'bg-gradient',
    'user-select-none', 'pe-none',
    'visible', 'invisible',
    // Bootstrap 5.3 new utilities
    'z-0', 'z-1', 'z-2', 'z-3', 'z-n1',
  ]

  knownClasses.forEach((cls) => {
    it(`"${cls}" is a known Bootstrap class (not unknown/Infinity)`, () => {
      const [catIdx] = classKey(cls)
      expect(catIdx).not.toBe(Infinity)
    })
  })
})
