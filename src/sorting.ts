import { sortClasses } from './class-order'
import type { SortOptions } from './types'

export function sortClassString(value: string, options?: SortOptions): string {
  if (!value || typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return value
  }

  const classes = trimmed.split(/\s+/)
  if (classes.length <= 1) {
    return value
  }

  const leadingWs = value.slice(0, value.length - value.trimStart().length)
  const trailingWs = value.slice(value.trimEnd().length)

  let toSort = classes
  if (options?.preserveDuplicates === false) {
    toSort = classes.filter((c, i) => classes.indexOf(c) === i)
  }

  const sorted = sortClasses(toSort)

  if (options?.preserveWhitespace) {
    const separators = trimmed.split(/\S+/).slice(1, -1)
    const result = sorted
      .map((cls, i) => (i < separators.length ? cls + separators[i] : cls))
      .join('')
    return `${leadingWs}${result}${trailingWs}`
  }

  return `${leadingWs}${sorted.join(' ')}${trailingWs}`
}
