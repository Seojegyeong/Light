import type { Term } from '@/types/term'
import { termService } from '@/services/termService'
import { createHighlightSpan, isAlreadyProcessed } from './highlight'

const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT',
  'NOSCRIPT', 'SELECT', 'CODE', 'PRE',
])

function buildTermRegex(): RegExp {
  const escaped = [...termService.keys]
    .sort((a, b) => b.length - a.length)
    .map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  return new RegExp(`(?<![a-zA-Z])(${escaped.join('|')})(?![a-zA-Z])`, 'gi')
}

const TERM_REGEX = buildTermRegex()

function hasSkipAncestor(el: Element): boolean {
  let cur: Element | null = el
  while (cur) {
    if (SKIP_TAGS.has(cur.tagName)) return true
    cur = cur.parentElement
  }
  return false
}

function createTextWalker(root: Node): TreeWalker {
  return document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      if (!parent) return NodeFilter.FILTER_REJECT
      if (hasSkipAncestor(parent)) return NodeFilter.FILTER_REJECT
      if (isAlreadyProcessed(parent)) return NodeFilter.FILTER_REJECT
      if (!node.textContent?.trim()) return NodeFilter.FILTER_SKIP
      return NodeFilter.FILTER_ACCEPT
    },
  })
}

function replaceTextNode(
  textNode: Text,
  detected: Map<string, Term>
): DocumentFragment | null {
  const text = textNode.textContent ?? ''
  const parts = text.split(TERM_REGEX)

  if (parts.length === 1) return null

  const fragment = document.createDocumentFragment()
  for (const part of parts) {
    if (!part) continue
    const term = termService.match(part)
    if (term) {
      fragment.appendChild(createHighlightSpan(part, term))
      detected.set(term.name, term)
    } else {
      fragment.appendChild(document.createTextNode(part))
    }
  }

  return fragment
}

export function scan(root: Node = document.body): Term[] {
  const walker = createTextWalker(root)
  const replacements: Array<{ node: Text; fragment: DocumentFragment }> = []
  const detected = new Map<string, Term>()

  let node: Node | null
  while ((node = walker.nextNode())) {
    const fragment = replaceTextNode(node as Text, detected)
    if (fragment) replacements.push({ node: node as Text, fragment })
  }

  // 순회 완료 후 일괄 교체 — 순회 중 DOM 변경 시 TreeWalker 커서 상태가 깨짐
  for (const { node, fragment } of replacements) {
    node.parentNode?.replaceChild(fragment, node)
  }

  return [...detected.values()]
}
