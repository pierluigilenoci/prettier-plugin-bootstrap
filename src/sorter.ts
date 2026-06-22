import { sortClasses, CLASS_ORDER, BREAKPOINTS, classKey } from './class-order'
import { sortClassString } from './sorting'
import type { SortOptions } from './types'

export interface Sorter {
  sort(classString: string): string
  sortClasses(classes: string[]): string[]
}

export function createSorter(options?: SortOptions): Sorter {
  return {
    sort: (classString) => sortClassString(classString, options),
    sortClasses: (classes) => {
      const input =
        options?.preserveDuplicates === false
          ? classes.filter((c, i) => classes.indexOf(c) === i)
          : classes
      return sortClasses(input)
    },
  }
}

export { sortClasses, sortClassString, CLASS_ORDER, BREAKPOINTS, classKey }
export type { SortOptions }
