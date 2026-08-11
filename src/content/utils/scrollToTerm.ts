export function scrollToTerm(termName: string): void {
  const el = document.querySelector(`[data-light="${termName}"]`)
  if (!el) return

  el.scrollIntoView({ behavior: 'smooth', block: 'center' })

  // 스크롤 완료 후 flash — 이동 중 실행하면 최종 위치에서 보이지 않음
  setTimeout(() => {
    el.classList.add('light-flash')
    el.addEventListener('animationend', () => el.classList.remove('light-flash'), { once: true })
  }, 400)
}
