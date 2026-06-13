import { useState, useEffect, useCallback } from 'react'

const KONAMI = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

export default function useKonamiCode() {
  const [activated, setActivated] = useState(false)
  const [progress, setProgress] = useState(0)

  const handler = useCallback((e) => {
    const expected = KONAMI[progress]
    const key = e.key

    if (key === expected) {
      const next = progress + 1
      setProgress(next)
      if (next === KONAMI.length) {
        setActivated(true)
        setProgress(0)
        setTimeout(() => setActivated(false), 5000)
      }
    } else {
      setProgress(0)
    }
  }, [progress])

  useEffect(() => {
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handler])

  return activated
}
