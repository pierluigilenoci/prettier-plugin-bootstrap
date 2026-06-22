import type { SortKey } from './types'

export function buildClassSorter(classOrder: readonly string[], breakpoints: readonly string[]) {
  const responsiveRe = new RegExp(`^(.+?)-(${breakpoints.join('|')})-(.+)$`)

  const orderMap = new Map<string, number>()
  for (const [index, prefix] of classOrder.entries()) {
    orderMap.set(prefix, index)
  }

  function classKey(className: string): SortKey {
    let base = className
    let breakpointIdx = 0

    const match = className.match(responsiveRe)
    if (match) {
      base = `${match[1]}-${match[3]}`
      breakpointIdx = breakpoints.indexOf(match[2]) + 1
    }

    let bestIdx = -1
    let bestLen = 0

    for (const [prefix, idx] of orderMap) {
      if (base === prefix || (prefix.endsWith('-') && base.startsWith(prefix))) {
        if (prefix.length > bestLen) {
          bestLen = prefix.length
          bestIdx = idx
        }
      }
    }

    const categoryIndex = bestIdx === -1 ? Infinity : bestIdx
    return [categoryIndex, breakpointIdx]
  }

  function sortClasses(classes: string[]): string[] {
    const annotated = classes.map((cls, i) => ({
      cls,
      key: classKey(cls),
      orig: i,
    }))

    annotated.sort((a, b) => {
      if (a.key[0] !== b.key[0]) return a.key[0] - b.key[0]
      if (a.key[1] !== b.key[1]) return a.key[1] - b.key[1]
      return a.orig - b.orig
    })

    return annotated.map((entry) => entry.cls)
  }

  return { classKey, sortClasses, orderMap }
}
