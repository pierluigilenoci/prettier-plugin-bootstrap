import type { Options } from 'prettier'

export interface SortOptions {
  preserveWhitespace?: boolean
  preserveDuplicates?: boolean
  bootstrapVersion?: number
  sortTemplateLiterals?: boolean
}

export interface BootstrapPluginOptions extends Options {
  bootstrapAttributes?: string[]
  bootstrapFunctions?: string[]
  bootstrapPreserveWhitespace?: boolean
  bootstrapPreserveDuplicates?: boolean
  bootstrapVersion?: number
  bootstrapSortTemplateLiterals?: boolean
}

export type SortKey = [categoryIndex: number, breakpointIndex: number]
