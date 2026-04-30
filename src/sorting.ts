import { sortClasses } from './class-order'

export function sortClassString(value: string): string {
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

  const sorted = sortClasses(classes)

  const leadingWs = value.match(/^\s*/)![0]
  const trailingWs = value.match(/\s*$/)![0]

  return `${leadingWs}${sorted.join(' ')}${trailingWs}`
}
