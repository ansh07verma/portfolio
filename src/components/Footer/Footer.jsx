import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer} id="footer" aria-label="Footer">
      <div className="container">
        <div className={styles.inner}>
          <span className={styles.tagline}>made with way too much coffee</span>
        </div>
      </div>
    </footer>
  )
}
