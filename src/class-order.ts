import { buildClassSorter } from './sorting-core'

export const BREAKPOINTS = ['sm', 'md', 'lg', 'xl', 'xxl'] as const

export const CLASS_ORDER: readonly string[] = [
  // ── Layout ──────────────────────────────────────────────────
  'container-fluid',
  'container-sm',
  'container-md',
  'container-lg',
  'container-xl',
  'container-xxl',
  'container',
  'row',
  'row-cols-',
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
  'g-',
  'gx-',
  'gy-',

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
  'dropend',
  'dropstart',

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

  // ── Accordion ───────────────────────────────────────────────
  'accordion',
  'accordion-',

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
  'progress-',
  'progress-bar',
  'progress-bar-',

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

  // ── Offcanvas ───────────────────────────────────────────────
  'offcanvas',
  'offcanvas-',

  // ── Placeholders ────────────────────────────────────────────
  'placeholder',
  'placeholder-',

  // ── Helpers ─────────────────────────────────────────────────
  'clearfix',
  'color-body',
  'link-',
  'icon-link',
  'icon-link-',
  'ratio',
  'ratio-',
  'fixed-top',
  'fixed-bottom',
  'sticky-top',
  'sticky-bottom',
  'sticky-',
  'hstack',
  'vstack',
  'stretched-link',
  'text-truncate',
  'text-break',
  'vr',
  'visually-hidden',
  'visually-hidden-focusable',

  // ── Utilities (order follows scss/_utilities.scss $utilities map) ──
  'align-',
  'float-',
  'object-fit-',
  'opacity-',
  'overflow-x-',
  'overflow-y-',
  'overflow-',
  'd-',
  'shadow',
  'shadow-',
  'focus-ring',
  'focus-ring-',
  'position-',
  'top-',
  'bottom-',
  'start-',
  'end-',
  'translate-middle',
  'translate-middle-',
  'border',
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
  'me-',
  'mb-',
  'ms-',
  'p-',
  'px-',
  'py-',
  'pt-',
  'pe-',
  'pb-',
  'ps-',
  'gap-',
  'row-gap-',
  'column-gap-',
  'font-monospace',
  'fs-',
  'fst-',
  'fw-',
  'lh-',
  'text-decoration-',
  'text-',
  'text-opacity-',
  'link-opacity-',
  'link-offset-',
  'link-underline',
  'link-underline-',
  'bg-',
  'bg-opacity-',
  'bg-gradient',
  'user-select-',
  'pe-none',
  'pe-auto',
  'rounded',
  'rounded-',
  'visible',
  'invisible',
  'z-',
]

const { classKey, sortClasses, orderMap: ORDER_MAP } = buildClassSorter(CLASS_ORDER, BREAKPOINTS)

export { classKey, sortClasses, ORDER_MAP }
