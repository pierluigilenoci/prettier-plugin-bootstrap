import { describe, it, expect } from 'vitest'
import { sortClasses } from '../src/class-order'

describe('integration — realistic class lists', () => {
  it('handles a typical Bootstrap HTML class attribute value', () => {
    const input = 'text-center p-3 container bg-primary text-white mb-4 rounded'
    const sorted = sortClasses(input.split(/\s+/))
    const result = sorted.join(' ')
    expect(result).toMatch(/^container/)
    expect(result).toMatch(/rounded$/)
  })

  it('handles Bootstrap card example', () => {
    const input = 'shadow-sm card mb-3 border-0'
    const sorted = sortClasses(input.split(/\s+/))
    expect(sorted.indexOf('card')).toBeLessThan(sorted.indexOf('shadow-sm'))
    expect(sorted.indexOf('card')).toBeLessThan(sorted.indexOf('mb-3'))
    expect(sorted.indexOf('card')).toBeLessThan(sorted.indexOf('border-0'))
  })

  it('handles Bootstrap navbar example', () => {
    const input = 'bg-body-tertiary fixed-top navbar navbar-expand-lg'
    const sorted = sortClasses(input.split(/\s+/))
    expect(sorted.indexOf('navbar')).toBeLessThan(sorted.indexOf('bg-body-tertiary'))
  })

  it('handles complex responsive grid layout', () => {
    const input = 'p-3 col-md-6 col-lg-4 col mb-2'
    const sorted = sortClasses(input.split(/\s+/))
    expect(sorted.indexOf('col')).toBeLessThan(sorted.indexOf('p-3'))
  })

  it('handles flexbox utility combinations', () => {
    const input = 'gap-3 align-items-center justify-content-between d-flex'
    const sorted = sortClasses(input.split(/\s+/))
    expect(sorted.indexOf('d-flex')).toBeLessThan(sorted.indexOf('justify-content-between'))
    expect(sorted.indexOf('d-flex')).toBeLessThan(sorted.indexOf('align-items-center'))
    expect(sorted.indexOf('align-items-center')).toBeLessThan(sorted.indexOf('gap-3'))
  })

  it('handles button variants', () => {
    const input = 'px-4 btn btn-primary btn-lg rounded-pill'
    const sorted = sortClasses(input.split(/\s+/))
    expect(sorted.indexOf('btn')).toBeLessThan(sorted.indexOf('px-4'))
    expect(sorted.indexOf('btn')).toBeLessThan(sorted.indexOf('rounded-pill'))
  })

  it('handles form elements', () => {
    const input = 'mb-3 form-control form-control-lg is-invalid'
    const sorted = sortClasses(input.split(/\s+/))
    expect(sorted.indexOf('form-control')).toBeLessThan(sorted.indexOf('mb-3'))
  })
})
