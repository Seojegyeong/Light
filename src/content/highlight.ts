import type { Term } from '@/types/term'

export function createHighlightSpan(originalText: string, term: Term): HTMLSpanElement {
  const span = document.createElement('span')
  span.setAttribute('data-pinkkok', term.name)
  span.setAttribute('data-pinkkok-category', term.category)
  span.textContent = originalText
  return span
}

export function isAlreadyProcessed(element: Element): boolean {
  return element.closest('[data-pinkkok]') !== null
}
