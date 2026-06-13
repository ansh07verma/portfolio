import useScrollReveal from '../../hooks/useScrollReveal'
import styles from './Projects.module.css'

const _ = null
const PK = '#ff7eb3'
const BL = '#7ec8e3'
const GR = '#5cff8a'
const YL = '#ffe066'
const PR = '#c77dff'
const DK = '#1a2a3a'
const ED = '#3a4a5a'
const ND = '#2a3a4a'
const TL = '#4ecdc4'
const DG = '#2d3436'
const LT = '#c8d6e5'

/* ── TORUS MESH (16×16) ─────────────────────── */
const TORUS = [
  [_,_,_,_,PK,PK,PK,PK,PK,PK,PK,PK,_,_,_,_],
  [_,_,PK,PK,ED,ND,ED,ND,ND,ED,ND,ED,PK,PK,_,_],
  [_,PK,ED,_,ED,_,ED,_,_,ED,_,ED,_,ED,PK,_],
  [PK,ND,ED,ND,ED,ND,ED,ND,ND,ED,ND,ED,ND,ED,ND,PK],
  [PK,ED,_,ED,_,ED,_,GR,GR,_,ED,_,ED,_,ED,PK],
  [PK,ND,ED,ND,ED,ND,GR,ND,ND,GR,ND,ND,ED,ND,ND,PK],
  [PK,ED,_,ED,_,GR,_,ND,ND,_,GR,_,ED,_,ED,PK],
  [PK,ND,ED,ND,GR,ND,ND,ND,ND,ND,ND,GR,ND,ED,ND,PK],
  [PK,ED,_,ED,_,GR,_,ND,ND,_,GR,_,ED,_,ED,PK],
  [PK,ND,ED,ND,ED,ND,GR,ND,ND,GR,ND,ND,ED,ND,ND,PK],
  [PK,ED,_,ED,_,ED,_,GR,GR,_,ED,_,ED,_,ED,PK],
  [PK,ND,ED,ND,ED,ND,ED,ND,ND,ED,ND,ED,ND,ED,ND,PK],
  [_,PK,ED,_,ED,_,ED,_,_,ED,_,ED,_,ED,PK,_],
  [_,_,PK,PK,ED,ND,ED,ND,ND,ED,ND,ED,PK,PK,_,_],
  [_,_,_,_,PK,PK,PK,PK,PK,PK,PK,PK,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
]

/* ── NEURAL BRAIN (16×16) ────────────────────── */
const BRAIN = [
  [_,_,_,_,_,BL,BL,BL,BL,BL,BL,_,_,_,_,_],
  [_,_,_,_,BL,BL,LT,LT,LT,LT,BL,BL,_,_,_,_],
  [_,_,_,BL,LT,_,_,_,_,_,_,LT,BL,_,_,_],
  [_,_,BL,LT,_,_,_,_,_,_,_,_,LT,BL,_,_],
  [_,BL,LT,_,_,GR,_,GR,_,GR,_,_,_,LT,BL,_],
  [_,BL,_,_,GR,_,GR,_,GR,_,GR,_,_,_,BL,_],
  [BL,LT,_,_,_,GR,_,GR,_,GR,_,_,_,_,LT,BL],
  [BL,_,_,_,GR,_,GR,_,GR,_,GR,_,_,_,_,BL],
  [BL,LT,_,_,_,GR,_,GR,_,GR,_,_,_,_,LT,BL],
  [_,BL,_,_,GR,_,GR,_,GR,_,GR,_,_,_,BL,_],
  [_,BL,LT,_,_,GR,_,GR,_,GR,_,_,_,LT,BL,_],
  [_,_,BL,LT,_,_,_,_,_,_,_,_,LT,BL,_,_],
  [_,_,_,BL,LT,_,_,_,_,_,_,LT,BL,_,_,_],
  [_,_,_,_,BL,BL,LT,LT,LT,LT,BL,BL,_,_,_,_],
  [_,_,_,_,_,BL,BL,BL,BL,BL,BL,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
]

/* ── ANTENNA TOWER (16×16) ──────────────────── */
const TOWER = [
  [_,_,_,_,_,_,YL,YL,YL,YL,_,_,_,_,_,_],
  [_,_,_,_,_,YL,_,_,_,_,YL,_,_,_,_,_],
  [_,_,_,_,_,_,YL,YL,YL,YL,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,YL,YL,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,YL,_,_,YL,_,_,_,_,_,_],
  [_,_,_,_,_,YL,_,YL,YL,_,YL,_,_,_,_,_],
  [_,_,_,_,YL,_,_,YL,YL,_,_,YL,_,_,_,_],
  [_,_,_,YL,_,_,YL,_,_,YL,_,_,YL,_,_,_],
  [_,_,_,_,_,_,YL,_,_,YL,_,_,_,_,_,_],
  [_,_,_,_,_,_,YL,_,_,YL,_,_,_,_,_,_],
  [_,_,_,_,_,_,YL,_,_,YL,_,_,_,_,_,_],
  [_,_,_,_,_,_,YL,_,_,YL,_,_,_,_,_,_],
  [_,DG,DG,DG,DG,DG,DG,DG,DG,DG,DG,DG,DG,DG,DG,_],
  [_,DG,YL,GR,YL,GR,YL,GR,GR,YL,GR,YL,GR,YL,DG,_],
  [_,DG,GR,GR,GR,GR,GR,GR,GR,GR,GR,GR,GR,GR,DG,_],
  [_,DG,DG,DG,DG,DG,DG,DG,DG,DG,DG,DG,DG,DG,DG,_],
]

/* ── CHIP DIE (16×16) ───────────────────────── */
const CHIP = [
  [_,PR,_,PR,_,PR,_,PR,PR,_,PR,_,PR,_,PR,_],
  [PR,DK,PR,DK,PR,DK,PR,DK,DK,PR,DK,PR,DK,PR,DK,PR],
  [_,PR,_,PR,_,PR,_,PR,PR,_,PR,_,PR,_,PR,_],
  [PR,DK,_,_,_,_,_,_,_,_,_,_,_,_,DK,PR],
  [_,PR,_,_,DK,DK,DK,DK,DK,DK,DK,DK,_,_,PR,_],
  [PR,DK,_,_,DK,GR,GR,GR,GR,GR,GR,DK,_,_,DK,PR],
  [_,PR,_,_,DK,GR,TL,TL,TL,TL,GR,DK,_,_,PR,_],
  [PR,DK,_,_,DK,GR,TL,PR,PR,TL,GR,DK,_,_,DK,PR],
  [_,PR,_,_,DK,GR,TL,PR,PR,TL,GR,DK,_,_,PR,_],
  [PR,DK,_,_,DK,GR,TL,TL,TL,TL,GR,DK,_,_,DK,PR],
  [_,PR,_,_,DK,GR,GR,GR,GR,GR,GR,DK,_,_,PR,_],
  [PR,DK,_,_,DK,DK,DK,DK,DK,DK,DK,DK,_,_,DK,PR],
  [_,PR,_,PR,_,PR,_,PR,PR,_,PR,_,PR,_,PR,_],
  [PR,DK,PR,DK,PR,DK,PR,DK,DK,PR,DK,PR,DK,PR,DK,PR],
  [_,PR,_,PR,_,PR,_,PR,PR,_,PR,_,PR,_,PR,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
]

function PixelArt({ grid }) {
  const rows = grid.length
  const cols = grid[0].length
  return (
    <div className={styles.pixelArt} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
      {grid.flat().map((c, i) => <div key={i} className={styles.pixel} style={{ background: c || 'transparent' }} />)}
    </div>
  )
}

const PROJECT_DECORATIONS = [
  { char: '◆', x: '3%',  y: '12%', size: 14, color: 'var(--pastel-pink)',   delay: 0 },
  { char: '▲', x: '94%', y: '18%', size: 12, color: 'var(--pastel-blue)',   delay: 1.5 },
  { char: '●', x: '5%',  y: '85%', size: 16, color: 'var(--pastel-green)',  delay: 0.8 },
  { char: '■', x: '90%', y: '80%', size: 13, color: 'var(--pastel-yellow)', delay: 2.0 },
  { char: '◇', x: '7%',  y: '50%', size: 11, color: 'var(--pastel-purple)', delay: 1.2 },
  { char: '★', x: '96%', y: '48%', size: 15, color: 'var(--pastel-peach)',  delay: 0.4 },
  { char: '⊕', x: '50%', y: '5%',  size: 10, color: 'var(--pastel-mint)',   delay: 1.8 },
  { char: '⊗', x: '48%', y: '92%', size: 12, color: 'var(--pastel-lavender)', delay: 0.6 },
]

const PROJECTS = [
  {
    filename: 'grl_torus.py',
    title: 'Adaptive Routing for 2D Torus Interconnects',
    tags: ['GraphSAGE', 'Dueling DQN', 'Optical', 'NoC', 'Python'],
    github: 'https://github.com/ansh07verma/grl-torus',
    art: TORUS,
  },
  {
    filename: 'gnn_power.py',
    title: 'Gate-Level Power Prediction using GNNs',
    tags: ['PyTorch', 'GNN', 'GraphSAGE', 'sklearn', 'Power'],
    github: 'https://github.com/ansh07verma/gate-level-power-gnn',
    art: BRAIN,
  },
  {
    filename: 'beam_predict.py',
    title: 'AI-Powered 6G Beam Prediction',
    tags: ['Deep Learning', 'MLP', '6G', 'MIMO', 'PyTorch'],
    github: 'https://github.com/ansh07verma/6g-beam-predictor',
    art: TOWER,
  },
  {
    filename: 'silicon_npu.sv',
    title: 'SiliconNPU — RTL-to-GDSII ASIC Flow',
    tags: ['SystemVerilog', 'Sky130', 'OpenLane', 'Yosys', 'ASIC'],
    github: 'https://github.com/ansh07verma/SiliconNPU',
    art: CHIP,
  },
]

function ProjectCard({ project, index }) {
  const ref = useScrollReveal()
  const pastelColors = ['var(--pastel-pink)', 'var(--pastel-blue)', 'var(--pastel-green)', 'var(--pastel-yellow)', 'var(--pastel-purple)']

  return (
    <article className={styles.card} ref={ref} aria-label={project.title} style={{ borderLeft: `5px solid ${pastelColors[index % 5]}` }}>
      <div className={styles.vis}>
        <PixelArt grid={project.art} />
      </div>
      <div className={styles.body}>
        <span className={styles.filename}>{project.filename}</span>
        <div className={styles.tags}>
          {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <h3 className={styles.title}>{project.title}</h3>
        <div className={styles.footer}>
          <a href={project.github} target="_blank" rel="noopener" className={`${styles.btn} ${styles.btnFilled}`}>GitHub &#8599;</a>
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const headerRef = useScrollReveal()

  return (
    <section className={styles.projects} id="projects" aria-label="Projects">
      {PROJECT_DECORATIONS.map((d, i) => (
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
          <div>
            <span className={styles.projectsLabel}>Selected Work</span>
            <h2 className="section-title">Projects</h2>
          </div>
        </div>
        <div className={styles.grid}>
          {PROJECTS.map((p, i) => <ProjectCard key={p.filename} project={p} index={i} />)}
        </div>
      </div>
    </section>
  )
}
