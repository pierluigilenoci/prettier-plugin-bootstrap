import type { Options } from 'prettier'

export interface SortOptions {
  preserveWhitespace?: boolean
  preserveDuplicates?: boolean
}

export interface BootstrapPluginOptions extends Options {
  bootstrapAttributes?: string[]
  bootstrapFunctions?: string[]
  bootstrapPreserveWhitespace?: boolean
  bootstrapPreserveDuplicates?: boolean
  bootstrapVersion?: number
}

export type SortKey = [categoryIndex: number, breakpointIndex: number]
