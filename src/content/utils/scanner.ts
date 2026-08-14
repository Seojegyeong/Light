import type { Term } from '@/types/term'
import { termService } from '@/services/termService'
import { createHighlightSpan, isAlreadyProcessed } from './highlight'

const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT',
  'NOSCRIPT', 'SELECT', 'CODE', 'PRE',
])

function buildRegexFromKeys(keys: string[]): RegExp {
  const escaped = keys
    .sort((a, b) => b.length - a.length)
    .map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  return new RegExp(`(?<![a-zA-Z])(${escaped.join('|')})(?![a-zA-Z])`, 'gi')
}

const TERM_REGEX = buildRegexFromKeys([...termService.keys])

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

function runScan(
  root: Node,
  regex: RegExp,
  lookup: (text: string) => Term | undefined
): Term[] {
  const walker = createTextWalker(root)
  const replacements: Array<{ node: Text; fragment: DocumentFragment }> = []
  const detected = new Map<string, Term>()

  let node: Node | null
  while ((node = walker.nextNode())) {
    const text = (node as Text).textContent ?? ''
    const parts = text.split(regex)
    if (parts.length === 1) continue

    const fragment = document.createDocumentFragment()
    for (const part of parts) {
      if (!part) continue
      const term = lookup(part)
      if (term) {
        fragment.appendChild(createHighlightSpan(part, term))
        detected.set(term.name, term)
      } else {
        fragment.appendChild(document.createTextNode(part))
      }
    }
    replacements.push({ node: node as Text, fragment })
  }

  // 순회 완료 후 일괄 교체 — 순회 중 DOM 변경 시 TreeWalker 커서 상태가 깨짐
  for (const { node, fragment } of replacements) {
    node.parentNode?.replaceChild(fragment, node)
  }

  return [...detected.values()]
}

export function scan(root: Node = document.body): Term[] {
  return runScan(root, TERM_REGEX, text => termService.match(text))
}

export function scanWithTerms(terms: Term[], root: Node = document.body): Term[] {
  const lookup = new Map<string, Term>()
  for (const term of terms) {
    lookup.set(term.name.toLowerCase(), term)
    for (const alias of term.aliases ?? []) {
      lookup.set(alias.toLowerCase(), term)
    }
  }
  const regex = buildRegexFromKeys([...lookup.keys()])
  return runScan(root, regex, text => lookup.get(text.trim().toLowerCase()))
}
