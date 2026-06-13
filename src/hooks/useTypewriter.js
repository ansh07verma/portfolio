import { useState, useEffect, useRef } from 'react'

export default function useTypewriter(lines, opts = {}) {
  const { speed = 18, pause = 100, initialDelay = 600 } = opts
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const idx = useRef({ line: 0, char: 0 })

  useEffect(() => {
    let timeout
    const state = idx.current

    function nextChar() {
      if (state.line >= lines.length) { setDone(true); return }
      const line = lines[state.line]

      if (state.char < line.length) {
        const ch = line[state.char]
        if (ch !== undefined) setDisplayed(prev => prev + ch)
        state.char++
        timeout = setTimeout(nextChar, line.startsWith('>') ? 55 : speed)
      } else {
        setDisplayed(prev => prev + '\n')
        state.line++
        state.char = 0
        const pauseMs = state.line > 0 && lines[state.line - 1].startsWith('>') ? 120 : pause
        timeout = setTimeout(nextChar, pauseMs)
      }
    }

    timeout = setTimeout(nextChar, initialDelay)
    return () => clearTimeout(timeout)
  }, [lines, speed, pause, initialDelay])

  return { displayed, done }
}
