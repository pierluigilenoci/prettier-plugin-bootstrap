import type { Options } from 'prettier'

export interface BootstrapPluginOptions extends Options {
  bootstrapAttributes?: string[]
  bootstrapFunctions?: string[]
}

export type SortKey = [categoryIndex: number, breakpointIndex: number]
