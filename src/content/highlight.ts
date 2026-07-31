import type { Term } from '@/types/term'

export function createHighlightSpan(originalText: string, term: Term): HTMLSpanElement {
  const span = document.createElement('span')
  span.setAttribute('data-light', term.name)
  span.setAttribute('data-light-category', term.category)
  span.textContent = originalText
  return span
}

export function isAlreadyProcessed(element: Element): boolean {
  return element.closest('[data-light]') !== null
}
