import { useEffect, useState } from 'react'
import styles from './Modal.module.css'

export default function Modal({ isOpen, onClose, children }) {
  const [closing, setClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(isOpen)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      setClosing(false)
    } else if (shouldRender) {
      setClosing(true)
      const timer = setTimeout(() => {
        setShouldRender(false)
        setClosing(false)
      }, 250)
      return () => clearTimeout(timer)
    }
  }, [isOpen, shouldRender])

  useEffect(() => {
    if (shouldRender) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [shouldRender])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    if (shouldRender) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [shouldRender, onClose])

  if (!shouldRender) return null

  return (
    <div
      className={`${styles.overlay} ${closing ? styles.overlayClosing : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`${styles.modal} ${closing ? styles.modalClosing : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>
        {children}
      </div>
    </div>
  )
}
