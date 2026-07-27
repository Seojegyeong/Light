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
  return new RegExp(`(${escaped.join('|')})`, 'gi')
}

const TERM_REGEX = buildTermRegex()

function createTextWalker(root: Node): TreeWalker {
  return document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      if (!parent) return NodeFilter.FILTER_REJECT
      if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT
      if (isAlreadyProcessed(parent)) return NodeFilter.FILTER_REJECT
      if (!node.textContent?.trim()) return NodeFilter.FILTER_SKIP
      return NodeFilter.FILTER_ACCEPT
    },
  })
}

function replaceTextNode(textNode: Text): DocumentFragment | null {
  const text = textNode.textContent ?? ''
  const parts = text.split(TERM_REGEX)

  if (parts.length === 1) return null

  const fragment = document.createDocumentFragment()
  for (const part of parts) {
    if (!part) continue
    const term = termService.match(part)
    if (term) {
      fragment.appendChild(createHighlightSpan(part, term))
    } else {
      fragment.appendChild(document.createTextNode(part))
    }
  }

  return fragment
}

export function scan(root: Node = document.body): void {
  const walker = createTextWalker(root)
  const replacements: Array<{ node: Text; fragment: DocumentFragment }> = []

  let node: Node | null
  while ((node = walker.nextNode())) {
    const fragment = replaceTextNode(node as Text)
    if (fragment) replacements.push({ node: node as Text, fragment })
  }

  // 순회 완료 후 일괄 교체 — 순회 중 DOM 변경 시 TreeWalker 커서 상태가 깨짐
  for (const { node, fragment } of replacements) {
    node.parentNode?.replaceChild(fragment, node)
  }
}
