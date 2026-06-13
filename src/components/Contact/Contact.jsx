import { useState } from 'react'
import emailjs from '@emailjs/browser'
import useScrollReveal from '../../hooks/useScrollReveal'
import styles from './Contact.module.css'

const SERVICE_ID = 'service_j8iu8jq'
const TEMPLATE_ID = 'template_xcezl8f'
const PUBLIC_KEY = '4gWTpm1IuzwKH3itV'

emailjs.init(PUBLIC_KEY)

const CONTACT_DECORATIONS = [
  { char: '◆', x: '3%',  y: '10%', size: 14, color: 'var(--pastel-pink)',   delay: 0 },
  { char: '▲', x: '94%', y: '15%', size: 12, color: 'var(--pastel-green)',  delay: 1.5 },
  { char: '●', x: '5%',  y: '85%', size: 16, color: 'var(--pastel-blue)',   delay: 0.8 },
  { char: '■', x: '90%', y: '80%', size: 13, color: 'var(--pastel-yellow)', delay: 2.0 },
  { char: '◇', x: '7%',  y: '48%', size: 11, color: 'var(--pastel-purple)', delay: 1.2 },
  { char: '★', x: '96%', y: '42%', size: 15, color: 'var(--pastel-peach)',  delay: 0.4 },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Contact() {
  const ref = useScrollReveal()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name required'
    if (!form.email.trim()) e.email = 'Email required'
    else if (!EMAIL_RE.test(form.email)) e.email = 'Invalid email'
    if (!form.message.trim()) e.message = 'Message required'
    return e
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSending(true)
    emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      from_name: form.name,
      from_email: form.email,
      message: form.message,
    }).then((res) => {
      console.log('EmailJS success:', res)
      setSending(false)
      setSent(true)
    }).catch((err) => {
      console.error('EmailJS error:', err)
      setSending(false)
      setErrors({ message: 'Failed to send. Try again.' })
    })
  }

  return (
    <section className={`${styles.contact} section-pastel-purple`} id="contact" aria-label="Contact">
      {CONTACT_DECORATIONS.map((d, i) => (
        <span
          key={i}
          className={styles.pixelDeco}
          style={{
            left: d.x,
            top: d.y,
            fontSize: d.size,
            color: d.color,
            animationDelay: `${d.delay}s`,
          }}
          aria-hidden="true"
        >
          {d.char}
        </span>
      ))}
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.left} ref={ref}>
            <span className={styles.label}>Get In Touch</span>
            <h2 className="section-title">Let's build<br />something real.</h2>
            <p className={styles.sub}>Looking for hardware roles in VLSI, embedded systems, and AI hardware.</p>
          </div>

          <div className={styles.formSection}>
            {sent ? (
              <div className={styles.success}>
                <div className={styles.successPixel} aria-hidden="true">
                  <span className={styles.pixelBlock} /><span className={styles.pixelBlock} /><span className={styles.pixelBlock} />
                  <span className={styles.pixelBlock} /><span className={styles.pixelCheck} /><span className={styles.pixelBlock} />
                  <span className={styles.pixelBlock} /><span className={styles.pixelBlock} /><span className={styles.pixelBlock} />
                </div>
                <p className={styles.successText}>Message Sent!</p>
                <button className={styles.resetBtn} onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }) }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                  {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                  {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    className={`${styles.input} ${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Say hello..."
                  />
                  {errors.message && <span className={styles.errorMsg}>{errors.message}</span>}
                </div>
                <button className={styles.submitBtn} type="submit" disabled={sending}>
                  {sending ? (
                    <span className={styles.sendingDots}>
                      <span>Sending</span>
                      <span className={styles.dot1}>.</span>
                      <span className={styles.dot2}>.</span>
                      <span className={styles.dot3}>.</span>
                    </span>
                  ) : (
                    <>
                      <span className={styles.btnPixel} aria-hidden="true">&#9654;</span>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
