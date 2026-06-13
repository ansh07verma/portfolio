import { useState, useEffect } from 'react'
import styles from './Loading.module.css'

export default function Loading({ onComplete }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 150)
    const t2 = setTimeout(() => setPhase(2), 600)
    const t3 = setTimeout(() => setPhase(3), 1100)
    const t4 = setTimeout(() => setPhase(4), 1600)
    const t5 = setTimeout(() => {
      setPhase(5)
      if (onComplete) onComplete()
    }, 2200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5) }
  }, [onComplete])

  return (
    <div className={`${styles.loading} ${phase >= 5 ? styles.done : ''}`}>
      <div className={styles.content}>
        {/* Chip body assembling */}
        <div className={styles.chipWrap}>
          <div className={`${styles.chipBody} ${phase >= 1 ? styles.chipAssemble : ''}`}>
            {/* 4x4 grid of blocks */}
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className={`${styles.pixel} ${phase >= 1 ? styles.pixelIn : ''} ${phase >= 2 ? styles.pixelColor : ''} ${phase >= 3 ? styles.pixelGlow : ''}`}
                style={{
                  animationDelay: `${i * 50 + 100}ms`,
                  background: phase >= 2
                    ? ['var(--pastel-pink)', 'var(--pastel-blue)', 'var(--pastel-green)', 'var(--pastel-yellow)'][i % 4]
                    : 'var(--ink)',
                }}
              />
            ))}
          </div>
          {/* Pins extending */}
          <div className={`${styles.pinsTop} ${phase >= 3 ? styles.pinsVisible : ''}`}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.pin} style={{ animationDelay: `${i * 80}ms` }} />
            ))}
          </div>
          <div className={`${styles.pinsBottom} ${phase >= 3 ? styles.pinsVisible : ''}`}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.pin} style={{ animationDelay: `${i * 80 + 200}ms` }} />
            ))}
          </div>
        </div>
        <div className={`${styles.text} ${phase >= 4 ? styles.textIn : ''}`}>
          ANSH VERMA
        </div>
        <div className={`${styles.subtitle} ${phase >= 4 ? styles.textIn : ''}`}>
          Loading portfolio...
        </div>
      </div>
    </div>
  )
}
