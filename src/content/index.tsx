import React from 'react'
import ReactDOM from 'react-dom/client'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { scan } from './scanner'
import { TooltipLayer } from './TooltipLayer'
import { color } from '@/styles/tokens'

function injectHighlightStyles(): void {
  if (document.getElementById('pinkkok-styles')) return
  const style = document.createElement('style')
  style.id = 'pinkkok-styles'
  style.textContent = `
    [data-pinkkok] {
      background-color: ${color.highlight.bg};
      border-bottom: 1.5px dashed ${color.highlight.border};
      border-radius: 2px;
      padding: 1px 3px;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
      cursor: default;
    }
  `
  document.head.appendChild(style)
}

function mount(): void {
  if (document.getElementById('pinkkok-root')) return

  injectHighlightStyles()

  const host = document.createElement('div')
  host.id = 'pinkkok-root'
  document.body.appendChild(host)

  const shadowRoot = host.attachShadow({ mode: 'open' })
  const mountPoint = document.createElement('div')
  shadowRoot.appendChild(mountPoint)

  const emotionCache = createCache({ key: 'pinkkok', container: shadowRoot })

  ReactDOM.createRoot(mountPoint).render(
    <React.StrictMode>
      <CacheProvider value={emotionCache}>
        <TooltipLayer />
      </CacheProvider>
    </React.StrictMode>
  )

  scan()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount)
} else {
  mount()
}
