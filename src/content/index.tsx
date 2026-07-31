import React from 'react'
import ReactDOM from 'react-dom/client'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { scan } from './scanner'
import { PinkKokApp } from './PinkKokApp'
import { DEFAULT_SETTINGS } from '@/types/settings'

function injectHighlightStyles(): void {
  if (document.getElementById('pinkkok-styles')) return
  const style = document.createElement('style')
  style.id = 'pinkkok-styles'
  const hex = DEFAULT_SETTINGS.color.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  style.textContent = `
    [data-pinkkok] {
      background-color: rgba(${r}, ${g}, ${b}, 0.2);
      border-bottom: 1.5px dashed ${DEFAULT_SETTINGS.color};
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

  const detectedTerms = scan()

  ReactDOM.createRoot(mountPoint).render(
    <React.StrictMode>
      <CacheProvider value={emotionCache}>
        <PinkKokApp detectedTerms={detectedTerms} />
      </CacheProvider>
    </React.StrictMode>
  )
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount)
} else {
  mount()
}
