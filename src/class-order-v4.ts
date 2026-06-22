import type { SortKey } from './types'

export const BREAKPOINTS_V4 = ['sm', 'md', 'lg', 'xl'] as const

const RESPONSIVE_RE_V4 = new RegExp(`^(.+?)-(${BREAKPOINTS_V4.join('|')})-(.+)$`)

// Bootstrap 4 class order — mirrors the structure of class-order.ts for Bootstrap 5.
// Key differences from Bootstrap 5:
//   - Uses ml-/mr-/pl-/pr- instead of ms-/me-/ps-/pe-
//   - Uses float-left/float-right instead of float-start/float-end
//   - Uses font-weight-/font-style- instead of fw-/fst-
//   - Includes sr-only, embed-responsive, jumbotron, media (removed in Bootstrap 5)
//   - Does not include gap-*, vstack, hstack, z-*, object-fit-*, overflow-x/y-*, placeholder
export const CLASS_ORDER_V4: readonly string[] = [
  // ── Layout ──────────────────────────────────────────────────
  'container-fluid',
  'container-sm',
  'container-md',
  'container-lg',
  'container-xl',
  'container',
  'row',
  'row-cols-',
  'no-gutters',
  'col-auto',
  'col-1',
  'col-2',
  'col-3',
  'col-4',
  'col-5',
  'col-6',
  'col-7',
  'col-8',
  'col-9',
  'col-10',
  'col-11',
  'col-12',
  'col',
  'offset-',

  // ── Reboot / Typography ─────────────────────────────────────
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'lead',
  'display-',
  'list-unstyled',
  'list-inline',
  'list-inline-item',
  'initialism',
  'blockquote',
  'blockquote-footer',

  // ── Images ──────────────────────────────────────────────────
  'img-fluid',
  'img-thumbnail',
  'figure',
  'figure-img',
  'figure-caption',

  // ── Tables ──────────────────────────────────────────────────
  'table',
  'table-',
  'caption-top',

  // ── Forms ───────────────────────────────────────────────────
  'form-group',
  'form-label',
  'col-form-label',
  'form-text',
  'form-control',
  'form-control-',
  'form-select',
  'form-select-',
  'form-check',
  'form-check-',
  'form-switch',
  'form-inline',
  'custom-control',
  'custom-control-',
  'custom-checkbox',
  'custom-radio',
  'custom-select',
  'custom-select-',
  'custom-file',
  'custom-file-',
  'form-floating',
  'form-range',
  'input-group',
  'input-group-',
  'valid-feedback',
  'valid-tooltip',
  'invalid-feedback',
  'invalid-tooltip',
  'was-validated',

  // ── Buttons ─────────────────────────────────────────────────
  'btn',
  'btn-',
  'btn-close',
  'btn-close-',

  // ── Transitions ─────────────────────────────────────────────
  'fade',
  'collapse',
  'collapsing',
  'show',

  // ── Dropdown ────────────────────────────────────────────────
  'dropdown',
  'dropdown-',
  'dropup',
  'dropright',
  'dropleft',

  // ── Button group ────────────────────────────────────────────
  'btn-group',
  'btn-group-',
  'btn-toolbar',

  // ── Nav ─────────────────────────────────────────────────────
  'nav',
  'nav-',
  'tab-content',
  'tab-pane',

  // ── Navbar ──────────────────────────────────────────────────
  'navbar',
  'navbar-',

  // ── Card ────────────────────────────────────────────────────
  'card',
  'card-',

  // ── Breadcrumb ──────────────────────────────────────────────
  'breadcrumb',
  'breadcrumb-item',

  // ── Pagination ──────────────────────────────────────────────
  'pagination',
  'pagination-',
  'page-item',
  'page-link',

  // ── Badge ───────────────────────────────────────────────────
  'badge',

  // ── Alert ───────────────────────────────────────────────────
  'alert',
  'alert-',

  // ── Progress ────────────────────────────────────────────────
  'progress',
  'progress-bar',
  'progress-bar-',

  // ── Media object ────────────────────────────────────────────
  'media',
  'media-body',

  // ── List group ──────────────────────────────────────────────
  'list-group',
  'list-group-',

  // ── Toasts ──────────────────────────────────────────────────
  'toast',
  'toast-',

  // ── Modal ───────────────────────────────────────────────────
  'modal',
  'modal-',

  // ── Tooltip ─────────────────────────────────────────────────
  'tooltip',
  'tooltip-',

  // ── Popover ─────────────────────────────────────────────────
  'popover',
  'popover-',

  // ── Carousel ────────────────────────────────────────────────
  'carousel',
  'carousel-',

  // ── Spinners ────────────────────────────────────────────────
  'spinner-border',
  'spinner-border-',
  'spinner-grow',
  'spinner-grow-',

  // ── Jumbotron ───────────────────────────────────────────────
  'jumbotron',
  'jumbotron-',

  // ── Embed ───────────────────────────────────────────────────
  'embed-responsive',
  'embed-responsive-',

  // ── Helpers ─────────────────────────────────────────────────
  'clearfix',
  'link-',
  'ratio',
  'ratio-',
  'fixed-top',
  'fixed-bottom',
  'sticky-top',
  'stretched-link',
  'text-truncate',
  'sr-only',
  'sr-only-focusable',

  // ── Utilities ───────────────────────────────────────────────
  'align-',
  'float-left',
  'float-right',
  'float-',
  'overflow-',
  'opacity-',
  'd-',
  'shadow',
  'shadow-',
  'position-',
  'top-',
  'bottom-',
  'left-',
  'right-',
  'translate-middle',
  'translate-middle-',
  'border',
  'border-left',
  'border-right',
  'border-',
  'w-',
  'mw-',
  'vw-',
  'min-vw-',
  'h-',
  'mh-',
  'vh-',
  'min-vh-',
  'flex-',
  'justify-content-',
  'align-items-',
  'align-content-',
  'align-self-',
  'order-',
  'm-',
  'mx-',
  'my-',
  'mt-',
  'mr-',
  'mb-',
  'ml-',
  'p-',
  'px-',
  'py-',
  'pt-',
  'pr-',
  'pb-',
  'pl-',
  'font-weight-',
  'font-italic',
  'font-monospace',
  'fs-',
  'lh-',
  'text-left',
  'text-right',
  'text-decoration-',
  'text-',
  'bg-',
  'bg-gradient',
  'user-select-',
  'pointer-events-none',
  'pe-none',
  'pe-auto',
  'rounded-left',
  'rounded-right',
  'rounded',
  'rounded-',
  'visible',
  'invisible',
]

function buildOrderMapV4(): Map<string, number> {
  const map = new Map<string, number>()
  for (const [index, prefix] of CLASS_ORDER_V4.entries()) {
    map.set(prefix, index)
  }
  return map
}

export const ORDER_MAP_V4: Map<string, number> = buildOrderMapV4()

export function classKeyV4(className: string): SortKey {
  let base = className
  let breakpointIdx = 0

  const match = className.match(RESPONSIVE_RE_V4)
  if (match) {
    base = `${match[1]}-${match[3]}`
    breakpointIdx = BREAKPOINTS_V4.indexOf(match[2] as (typeof BREAKPOINTS_V4)[number]) + 1
  }

  let bestIdx = -1
  let bestLen = 0

  for (const [prefix, idx] of ORDER_MAP_V4) {
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

export function sortClassesV4(classes: string[]): string[] {
  const annotated = classes.map((cls, i) => ({
    cls,
    key: classKeyV4(cls),
    orig: i,
  }))

  annotated.sort((a, b) => {
    if (a.key[0] !== b.key[0]) return a.key[0] - b.key[0]
    if (a.key[1] !== b.key[1]) return a.key[1] - b.key[1]
    /* v8 ignore next */
    return a.orig - b.orig
  })

  return annotated.map((entry) => entry.cls)
}
