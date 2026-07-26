import createCache from '@emotion/cache'

export function createShadowCache(container: ShadowRoot) {
  return createCache({ key: 'pinkkok', container })
}
