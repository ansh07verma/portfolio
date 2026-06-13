import useScrollReveal from '../../hooks/useScrollReveal'
import styles from './Skills.module.css'

const SKILLS_DECORATIONS = [
  { char: '◇', x: '3%',  y: '12%', size: 14, color: 'var(--pastel-purple)', delay: 0 },
  { char: '⊕', x: '94%', y: '18%', size: 12, color: 'var(--pastel-pink)',   delay: 1.5 },
  { char: '■', x: '5%',  y: '82%', size: 16, color: 'var(--pastel-blue)',   delay: 0.8 },
  { char: '★', x: '90%', y: '78%', size: 13, color: 'var(--pastel-yellow)', delay: 2.0 },
  { char: '◆', x: '7%',  y: '48%', size: 11, color: 'var(--pastel-green)',  delay: 1.2 },
  { char: '●', x: '96%', y: '42%', size: 15, color: 'var(--pastel-peach)',  delay: 0.4 },
]

const SKILLS = [
  {
    category: 'RTL Design',
    items: ['Verilog', 'FSM Design', 'Testbench Development', 'Systolic Arrays'],
  },
  {
    category: 'Computer Architecture & AI Hardware',
    items: ['FPGA-Based NPUs', 'CNN Acceleration', 'RISC-V', 'Parallel MAC Architectures'],
  },
  {
    category: 'Programming',
    items: ['Python', 'Embedded C', 'Java'],
  },
  {
    category: 'Machine Learning',
    items: ['Graph Neural Networks (GNNs)', 'Random Forest', 'Neural Networks', 'Feature Engineering'],
  },
  {
    category: 'Tools',
    items: ['Xilinx Vivado', 'ModelSim', 'Cadence Virtuoso', 'LTSpice'],
  },
]

export default function Skills() {
  const headerRef = useScrollReveal()

  return (
    <section className={`${styles.skills} section-pastel-blue`} id="skills" aria-label="Skills">
      {SKILLS_DECORATIONS.map((d, i) => (
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
        <div className={styles.header} ref={headerRef}>
          <span className={styles.skillsLabel}>Expertise</span>
          <h2 className="section-title">Skills & Tools</h2>
        </div>
        <div className={styles.grid}>
          {SKILLS.map((cat) => (
            <div key={cat.category} className={styles.category}>
              <h3 className={styles.catName}>{cat.category}</h3>
              <div className={styles.tags}>
                {cat.items.map((skill) => (
                  <span key={skill} className="tag">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
