import { useState } from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'
import Modal from '../Modal/Modal'
import styles from './Featured.module.css'

const TOOLTIPS = {
  mac: { title: 'MAC Unit', desc: 'INT8 Multiply-Accumulate — core compute element in the systolic array' },
  wmem: { title: 'Weight Memory', desc: 'Stores 8-bit weights for the systolic array, loaded once per layer' },
  amem: { title: 'Activation Memory', desc: 'Streams input activations through the array during compute' },
  fsm: { title: 'FSM Controller', desc: 'IDLE → LOAD → COMPUTE → OUTPUT state machine orchestrating execution' },
  bus: { title: 'Data Bus', desc: 'Interconnect fabric for weight/activation routing and result collection' },
}

const FEATURED_DECORATIONS = [
  { char: '⊕', x: '2%',  y: '15%', size: 16, color: 'var(--pastel-pink)',   delay: 0 },
  { char: '⟐', x: '92%', y: '20%', size: 14, color: 'var(--pastel-blue)',   delay: 1.5 },
  { char: '⬡', x: '4%',  y: '80%', size: 18, color: 'var(--pastel-green)',  delay: 0.8 },
  { char: '⊠', x: '88%', y: '75%', size: 15, color: 'var(--pastel-yellow)', delay: 2.0 },
  { char: '⟡', x: '8%',  y: '50%', size: 12, color: 'var(--pastel-purple)', delay: 1.2 },
  { char: '⏣', x: '95%', y: '45%', size: 16, color: 'var(--pastel-peach)',  delay: 0.4 },
]

function InteractiveSVG({ hovered, setHovered }) {
  const macColors = ['#ff7eb3', '#7ec8e3', '#5cff8a', '#c77dff']
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className={styles.svg} data-theme="dark">
      <defs>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="wmemGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7ec8e3" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#7ec8e3" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="amemGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff7eb3" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ff7eb3" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="fsmGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe066" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ffe066" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="400" height="300" fill="#060610" />
      <pattern id="fdots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="1" height="1" fill="#1a1a2a" opacity="0.4" />
      </pattern>
      <rect width="400" height="300" fill="url(#fdots)" />

      {/* Title bar */}
      <rect x="0" y="0" width="400" height="30" fill="#0a0a14" stroke="#2a2a3a" strokeWidth="1" />
      <text x="200" y="20" textAnchor="middle" fontFamily="'Press Start 2P'" fontSize="8" fill="#5cff8a" filter="url(#softGlow)">4×4 SYSTOLIC NPU</text>

      {/* ── MAC ARRAY ── */}
      <g
        onMouseEnter={() => setHovered('mac')}
        onMouseLeave={() => setHovered(null)}
        style={{ cursor: 'pointer' }}
      >
        {hovered === 'mac' && (
          <rect x="30" y="38" width="340" height="4" fill="#5cff8a" rx="2" opacity="0.6" filter="url(#softGlow)" />
        )}
        {[0,1,2,3].flatMap(row => [0,1,2,3].map(col => {
          const isDiag = row === col
          const baseColor = macColors[col]
          const fill = isDiag ? baseColor : (hovered === 'mac' ? '#1a2a1a' : '#0e0e1a')
          return (
            <g key={`${row}-${col}`}>
              <rect
                x={35+col*85} y={44+row*40} width={72} height={34} rx={2}
                fill={fill} stroke="#2a2a3a" strokeWidth={isDiag ? 1.5 : 1}
                opacity={isDiag ? 0.9 : 0.7}
                style={{ transition: 'all 0.2s' }}
                filter={hovered === 'mac' ? 'url(#softGlow)' : undefined}
              />
              <text x={71+col*85} y={66+row*40} textAnchor="middle" fontFamily="'Press Start 2P'" fontSize="6"
                fill={isDiag ? '#0a0a0a' : '#e0e0e0'}
                style={{ transition: 'fill 0.2s' }}>MAC</text>
            </g>
          )
        }))}
      </g>

      {/* ── CONNECTIONS (array → memories) ── */}
      <line x1="71" y1="204" x2="71" y2="222" stroke="#3a3a4a" strokeWidth="1.5" strokeDasharray="3 2" />
      <line x1="200" y1="204" x2="200" y2="222" stroke="#3a3a4a" strokeWidth="1.5" strokeDasharray="3 2" />
      <line x1="329" y1="204" x2="329" y2="222" stroke="#3a3a4a" strokeWidth="1.5" strokeDasharray="3 2" />

      {/* Animated data flow dots — always running */}
      {[71, 200, 329].map((x, i) => (
        <circle key={`fd-${i}`} r="2.5" fill="#5cff8a" filter="url(#softGlow)" opacity="0.9">
          <animateMotion dur="1.5s" repeatCount="indefinite" path={`M${x},204 L${x},222`} begin={`${i * 0.3}s`} />
        </circle>
      ))}
      <circle r="2.5" fill="#7ec8e3" filter="url(#softGlow)" opacity="0.9">
        <animateMotion dur="1.2s" repeatCount="indefinite" path="M71,222 L71,204" begin="0.5s" />
      </circle>
      <circle r="2.5" fill="#ff7eb3" filter="url(#softGlow)" opacity="0.9">
        <animateMotion dur="1.2s" repeatCount="indefinite" path="M329,222 L329,204" begin="0.8s" />
      </circle>

      {/* ── W-MEM ── */}
      <g
        onMouseEnter={() => setHovered('wmem')}
        onMouseLeave={() => setHovered(null)}
        style={{ cursor: 'pointer' }}
      >
        <rect x="0" y="224" width="130" height="52" rx="2"
          fill="url(#wmemGrad)" stroke="#2a2a3a" strokeWidth="1"
          style={{ transition: 'all 0.2s' }} filter={hovered === 'wmem' ? 'url(#softGlow)' : undefined} />
        <text x="65" y="244" textAnchor="middle" fontFamily="'Press Start 2P'" fontSize="6"
          fill={hovered === 'wmem' ? '#7ec8e3' : '#c0d8e8'} style={{ transition: 'fill 0.2s' }}>W-MEM</text>
        <text x="65" y="260" textAnchor="middle" fontFamily="'VT323'" fontSize="12" fill="#8ab4c8">8-bit weights</text>
        {hovered === 'wmem' && <rect x="0" y="220" width="130" height="3" fill="#7ec8e3" rx="1" opacity="0.5" filter="url(#softGlow)" />}
      </g>

      {/* ── FSM ── */}
      <g
        onMouseEnter={() => setHovered('fsm')}
        onMouseLeave={() => setHovered(null)}
        style={{ cursor: 'pointer' }}
      >
        <rect x="138" y="224" width="124" height="52" rx="2"
          fill="url(#fsmGrad)" stroke="#2a2a3a" strokeWidth="1"
          style={{ transition: 'all 0.2s' }} filter={hovered === 'fsm' ? 'url(#softGlow)' : undefined} />
        <text x="200" y="244" textAnchor="middle" fontFamily="'Press Start 2P'" fontSize="6"
          fill={hovered === 'fsm' ? '#ffe066' : '#e0d8a0'} style={{ transition: 'fill 0.2s' }}>FSM</text>
        <text x="200" y="260" textAnchor="middle" fontFamily="'VT323'" fontSize="12" fill="#c8c090">CTRL</text>
        {hovered === 'fsm' && <rect x="138" y="220" width="124" height="3" fill="#ffe066" rx="1" opacity="0.5" filter="url(#softGlow)" />}
      </g>

      {/* ── A-MEM ── */}
      <g
        onMouseEnter={() => setHovered('amem')}
        onMouseLeave={() => setHovered(null)}
        style={{ cursor: 'pointer' }}
      >
        <rect x="270" y="224" width="130" height="52" rx="2"
          fill="url(#amemGrad)" stroke="#2a2a3a" strokeWidth="1"
          style={{ transition: 'all 0.2s' }} filter={hovered === 'amem' ? 'url(#softGlow)' : undefined} />
        <text x="335" y="244" textAnchor="middle" fontFamily="'Press Start 2P'" fontSize="6"
          fill={hovered === 'amem' ? '#ff7eb3' : '#e8c0c8'} style={{ transition: 'fill 0.2s' }}>A-MEM</text>
        <text x="335" y="260" textAnchor="middle" fontFamily="'VT323'" fontSize="12" fill="#d8a0a8">8-bit activations</text>
        {hovered === 'amem' && <rect x="270" y="220" width="130" height="3" fill="#ff7eb3" rx="1" opacity="0.5" filter="url(#softGlow)" />}
      </g>

      {/* ── BUS ── */}
      <g
        onMouseEnter={() => setHovered('bus')}
        onMouseLeave={() => setHovered(null)}
        style={{ cursor: 'pointer' }}
      >
        <rect x="0" y="286" width="400" height="14" rx="2"
          fill={hovered === 'bus' ? '#1a1a2a' : '#0a0a14'}
          stroke="#2a2a3a" strokeWidth="0.5"
          style={{ transition: 'all 0.2s' }} filter={hovered === 'bus' ? 'url(#softGlow)' : undefined} />
        {hovered === 'bus' && <rect x="0" y="283" width="400" height="3" fill="#c77dff" rx="1" opacity="0.4" filter="url(#softGlow)" />}
      </g>

      {/* ── TOOLTIP BAR ── */}
      {hovered && TOOLTIPS[hovered] && (
        <g className={styles.svgTooltip}>
          <rect x="0" y="296" width="400" height="14" fill="#0a0a14" stroke="#2a2a3a" strokeWidth="0.5" />
          <text x="200" y="306" textAnchor="middle" fontFamily="'VT323'" fontSize="9"
            fill="#5cff8a" filter="url(#softGlow)">
            {TOOLTIPS[hovered].title}: {TOOLTIPS[hovered].desc}
          </text>
        </g>
      )}
    </svg>
  )
}

export default function Featured() {
  const ref = useScrollReveal()
  const [showModal, setShowModal] = useState(false)
  const [hovered, setHovered] = useState(null)

  return (
    <section className={`${styles.featured} section-pastel-yellow`} id="featured" aria-label="Featured project">
      {FEATURED_DECORATIONS.map((d, i) => (
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
        <div>
          <span className={styles.featuredLabel}>Featured Project</span>
        </div>
        <article className={`${styles.card} reveal`} ref={ref} aria-label="FPGA-Based Mini NPU">
          <div className={styles.cardBar}>
            <div className={styles.dots}>
              <span /><span /><span />
            </div>
            <span className={styles.filename}>fpga_npu.v</span>

          </div>
          <div className={styles.cardBody}>
            <div className={styles.cardLeft}>
              <div className={styles.tags}>
                <span className="tag">Verilog</span>
                <span className="tag">Systolic Array</span>
                <span className="tag">NPU</span>
                <span className="tag">CNN</span>
                <span className="tag">FPGA</span>
              </div>
              <h3 className={styles.title}>FPGA-Based Mini NPU<br />Systolic Array Architecture</h3>
              <p className={styles.desc}>
                Designed a 4×4 FPGA-based Neural Processing Unit in Verilog using INT8 MAC units and weight-stationary systolic-array architecture for CNN acceleration. Built RTL-to-bitstream accelerator pipeline with FSM-controlled execution, im2col-based convolution lowering, and DSP48E1 inference in Vivado.
              </p>
              <ul className={styles.metrics}>
                <li><span className={styles.metricN}>4×4</span><span className={styles.metricL}>MAC Array</span></li>
                <li><span className={styles.metricN}>INT8</span><span className={styles.metricL}>Precision</span></li>
                <li><span className={styles.metricN}>+0.153</span><span className={styles.metricL}>WNS (ns)</span></li>
              </ul>
              <div className={styles.actions}>
                <a href="https://github.com/ansh07verma/fpga-mini-npu" target="_blank" rel="noopener" className="btn btn--primary">GitHub ↗</a>
                <button className="btn btn--outline" onClick={() => setShowModal(true)}>Case Study →</button>
              </div>
            </div>
            <div className={styles.cardRight} aria-hidden="true">
              <InteractiveSVG hovered={hovered} setHovered={setHovered} />
            </div>
          </div>
        </article>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className={styles.header}>
          <span className={styles.filename}>fpga_npu.v</span>
          <h2 className={styles.title}>FPGA-Based Mini NPU — Case Study</h2>
          <div className={styles.tags}>
            <span className="tag">Verilog</span>
            <span className="tag">Systolic Array</span>
            <span className="tag">NPU</span>
            <span className="tag">CNN</span>
            <span className="tag">FPGA</span>
            <span className="tag">INT8</span>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Overview</span>
            <p className={styles.desc}>
              Designed a complete 4×4 FPGA-based Neural Processing Unit for CNN inference acceleration. The design uses weight-stationary dataflow on a systolic array of INT8 MAC (Multiply-Accumulate) units, controlled by a finite state machine with im2col-based convolution lowering.
            </p>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>Architecture</span>
            <ul className={styles.list}>
              <li>4×4 weight-stationary systolic array with INT8 precision</li>
              <li>FSM-controlled execution: IDLE → LOAD → COMPUTE → OUTPUT</li>
              <li>Weight memory (W-MEM) and activation memory (A-MEM) for data staging</li>
              <li>im2col convolution lowering for direct mapping onto systolic array</li>
              <li>DSP48E1 inference for high-speed multiply-accumulate operations</li>
              <li>RTL-to-bitstream pipeline fully validated in Xilinx Vivado</li>
            </ul>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>Design Pipeline</span>
            <ul className={styles.list}>
              <li>RTL design and functional simulation in Verilog</li>
              <li>Synthesis with Xilinx Vivado targeting Artix-7 FPGA</li>
              <li>Place & Route with timing-driven optimization</li>
              <li>Timing closure achieved: WNS = +0.153 ns (positive slack)</li>
              <li>Post-implementation validation with bitstream generation</li>
            </ul>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>Results</span>
            <div className={styles.resultsGrid}>
              <div className={`${styles.resultCard} ${styles.resultPink}`}>
                <span className={styles.resultN}>4×4</span>
                <span className={styles.resultL}>MAC Array</span>
              </div>
              <div className={`${styles.resultCard} ${styles.resultBlue}`}>
                <span className={styles.resultN}>INT8</span>
                <span className={styles.resultL}>Precision</span>
              </div>
              <div className={`${styles.resultCard} ${styles.resultGreen}`}>
                <span className={styles.resultN}>+0.153</span>
                <span className={styles.resultL}>WNS (ns)</span>
              </div>
              <div className={`${styles.resultCard} ${styles.resultPurple}`}>
                <span className={styles.resultN}>DSP48E1</span>
                <span className={styles.resultL}>Inference</span>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <a href="https://github.com/ansh07verma/fpga-mini-npu" target="_blank" rel="noopener" className={styles.btnPrimary}>GitHub ↗</a>
            <button className={styles.btnOutline} onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      </Modal>
    </section>
  )
}
