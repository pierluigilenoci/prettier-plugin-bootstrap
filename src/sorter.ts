import { sortClasses, CLASS_ORDER, BREAKPOINTS, classKey } from './class-order'
import { sortClassesV4, CLASS_ORDER_V4, BREAKPOINTS_V4, classKeyV4 } from './class-order-v4'
import { sortClassString } from './sorting'
import type { SortOptions } from './types'

export interface Sorter {
  sort(classString: string): string
  sortClasses(classes: string[]): string[]
}

export function createSorter(options?: SortOptions): Sorter {
  const sortFn = options?.bootstrapVersion === 4 ? sortClassesV4 : sortClasses
  return {
    sort: (classString) => sortClassString(classString, options),
    sortClasses: (classes) => {
      const input =
        options?.preserveDuplicates === false
          ? classes.filter((c, i) => classes.indexOf(c) === i)
          : classes
      return sortFn(input)
    },
  }
}

export { sortClasses, sortClassString, CLASS_ORDER, BREAKPOINTS, classKey }
export { sortClassesV4, CLASS_ORDER_V4, BREAKPOINTS_V4, classKeyV4 }
export type { SortOptions }
export type { SortKey } from './types'
