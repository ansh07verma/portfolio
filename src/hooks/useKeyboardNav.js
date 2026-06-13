import { useEffect } from 'react'

const SECTIONS = ['hero', 'about', 'featured', 'projects', 'playground', 'contact']

export default function useKeyboardNav() {
  useEffect(() => {
    function handler(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return

      const current = SECTIONS.findIndex(id => {
        const el = document.getElementById(id)
        if (!el) return false
        const rect = el.getBoundingClientRect()
        return rect.top <= 200 && rect.bottom > 200
      })

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault()
        const next = Math.min(current + 1, SECTIONS.length - 1)
        document.getElementById(SECTIONS[next])?.scrollIntoView({ behavior: 'smooth' })
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault()
        const prev = Math.max(current - 1, 0)
        document.getElementById(SECTIONS[prev])?.scrollIntoView({ behavior: 'smooth' })
      } else if (e.key === 'Home') {
        e.preventDefault()
        document.getElementById(SECTIONS[0])?.scrollIntoView({ behavior: 'smooth' })
      } else if (e.key === 'End') {
        e.preventDefault()
        document.getElementById(SECTIONS[SECTIONS.length - 1])?.scrollIntoView({ behavior: 'smooth' })
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}
