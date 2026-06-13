import { useState, useRef, useCallback, useEffect } from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'
import styles from './About.module.css'

const INTERESTS = [
  { icon: '⚡', label: 'Hardware Design' },
  { icon: '🧠', label: 'AI/ML' },
  { icon: '🔬', label: 'Research' },
  { icon: '🎮', label: 'Gaming' },
  { icon: '🎵', label: 'Music' },
  { icon: '🎬', label: 'Movies' },
]

const ABOUT_DECORATIONS = [
  { char: '⚙', x: '2%',  y: '10%', size: 14, color: 'var(--pastel-blue)',   delay: 0 },
  { char: '⚡', x: '95%', y: '15%', size: 12, color: 'var(--pastel-yellow)', delay: 1.5 },
  { char: '◆', x: '4%',  y: '85%', size: 16, color: 'var(--pastel-green)',  delay: 0.8 },
  { char: '●', x: '92%', y: '80%', size: 13, color: 'var(--pastel-pink)',   delay: 2.0 },
  { char: '▲', x: '6%',  y: '50%', size: 11, color: 'var(--pastel-purple)', delay: 1.2 },
  { char: '★', x: '96%', y: '45%', size: 15, color: 'var(--pastel-peach)',  delay: 0.4 },
]

const AMP_STEPS = [0.5, 1, 1.5, 2]
const FREQ_STEPS = [1, 2, 3, 4]
const TIME_STEPS = [0.5, 1, 1.5, 2]
const WAVE_TYPES = ['sine', 'square', 'triangle', 'sawtooth']

function LabScene() {
  const [ampIdx, setAmpIdx] = useState(1)
  const [freqIdx, setFreqIdx] = useState(1)
  const [timeIdx, setTimeIdx] = useState(1)
  const [waveIdx, setWaveIdx] = useState(0)
  const [mode, setMode] = useState('run')

  const phaseRef = useRef(0)
  const rafRef = useRef(null)
  const lastTimeRef = useRef(null)
  const [wavePoints, setWavePoints] = useState('')

  const genPoints = useCallback((phase) => {
    const pts = []
    const cy = 31
    const maxAmp = 16
    const freq = FREQ_STEPS[freqIdx]
    const amp = AMP_STEPS[ampIdx]
    const wave = WAVE_TYPES[waveIdx]

    for (let x = 0; x <= 96; x += 1) {
      const t = (x / (24 / freq)) + phase
      let y
      switch (wave) {
        case 'square':
          y = Math.sin(2 * Math.PI * t) >= 0 ? 1 : -1
          break
        case 'triangle':
          y = 2 * Math.abs(2 * ((t % 1 + 1) % 1 - 0.5)) - 1
          break
        case 'sawtooth':
          y = 2 * ((t % 1 + 1) % 1) - 1
          break
        default:
          y = Math.sin(2 * Math.PI * t)
      }
      pts.push(`${x},${(cy - y * amp * maxAmp / 2).toFixed(1)}`)
    }
    return pts.join(' ')
  }, [ampIdx, freqIdx, waveIdx])

  useEffect(() => {
    if (mode !== 'run') {
      lastTimeRef.current = null
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }
    const animate = (now) => {
      if (lastTimeRef.current !== null) {
        const dt = (now - lastTimeRef.current) / 1000
        phaseRef.current += dt * TIME_STEPS[timeIdx] * 0.5
        setWavePoints(genPoints(phaseRef.current))
      }
      lastTimeRef.current = now
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [mode, genPoints, timeIdx])

  useEffect(() => {
    if (mode !== 'run') setWavePoints(genPoints(phaseRef.current))
  }, [genPoints, mode])

  const cycleAmp = () => setAmpIdx(i => (i + 1) % AMP_STEPS.length)
  const cycleFreq = () => setFreqIdx(i => (i + 1) % FREQ_STEPS.length)
  const cycleTime = () => setTimeIdx(i => (i + 1) % TIME_STEPS.length)
  const cycleWave = () => setWaveIdx(i => (i + 1) % WAVE_TYPES.length)

  const ampAngle = ampIdx * 30
  const freqAngle = freqIdx * 30
  const timeAngle = timeIdx * 30

  const modeColors = { run: '#5cff8a', stop: '#ff7eb3', hold: '#ffe066' }

  return (
    <svg className={styles.labSvg} viewBox="0 0 110 90" aria-label="Interactive oscilloscope" data-theme="dark">
      <defs>
        <filter id="neon" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.5" result="b1" />
          <feGaussianBlur stdDeviation="3" result="b2" />
          <feMerge>
            <feMergeNode in="b2" />
            <feMergeNode in="b1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform="translate(4, 6)">
        {/* ── BODY ── */}
        <rect x={2} y={4} width={96} height={72} rx={3} fill="#14141e" stroke="#3a3a5a" strokeWidth="1.5" />

        {/* ── SCREEN ── */}
        <rect x={8} y={10} width={60} height={42} rx={1} fill="#040810" stroke="#2a3a4a" strokeWidth="0.8" />

        {/* Grid */}
        {Array.from({length: 6}, (_, i) => (
          <line key={`sg-${i}`} x1={8 + i * 10} y1={10} x2={8 + i * 10} y2={52} stroke="#0a1a1a" strokeWidth="0.3" />
        ))}
        {Array.from({length: 5}, (_, i) => (
          <line key={`sh-${i}`} x1={8} y1={10 + i * 8.4} x2={68} y2={10 + i * 8.4} stroke="#0a1a1a" strokeWidth="0.3" />
        ))}

        {/* Waveform */}
        <defs>
          <clipPath id="scrClip"><rect x={9} y={11} width={58} height={40} /></clipPath>
        </defs>
        <g clipPath="url(#scrClip)">
          <polyline
            points={wavePoints}
            fill="none"
            stroke="#5cff8a"
            strokeWidth="1.2"
            strokeLinecap="square"
            filter="url(#neon)"
          />
        </g>

        {/* Wave type label on screen */}
        <text x={14} y={50} fill="#5cff8a" fontSize="2" fontFamily="'Press Start 2P'" opacity="0.5">
          {WAVE_TYPES[waveIdx].toUpperCase()}
        </text>

        {/* ── KNOBS ── */}
        <g style={{cursor: 'pointer'}} onClick={cycleAmp}>
          <circle cx={16} cy={62} r={5} fill="#0e0e18" stroke="#3a3a5a" strokeWidth="0.8" />
          <circle cx={16} cy={62} r={3.5} fill="#1a1a2a" stroke="#4a4a6a" strokeWidth="0.5" />
          <line x1={16} y1={62} x2={16} y2={58} stroke="#6a6a8a" strokeWidth="0.8" strokeLinecap="round"
            transform={`rotate(${ampAngle}, 16, 62)`} />
          <text x={16} y={72} textAnchor="middle" fill="#3a3a5a" fontSize="2" fontFamily="'Press Start 2P'">CH1</text>
        </g>

        <g style={{cursor: 'pointer'}} onClick={cycleFreq}>
          <circle cx={34} cy={62} r={5} fill="#0e0e18" stroke="#3a3a5a" strokeWidth="0.8" />
          <circle cx={34} cy={62} r={3.5} fill="#1a1a2a" stroke="#4a4a6a" strokeWidth="0.5" />
          <line x1={34} y1={62} x2={34} y2={58} stroke="#6a6a8a" strokeWidth="0.8" strokeLinecap="round"
            transform={`rotate(${freqAngle}, 34, 62)`} />
          <text x={34} y={72} textAnchor="middle" fill="#3a3a5a" fontSize="2" fontFamily="'Press Start 2P'">CH2</text>
        </g>

        <g style={{cursor: 'pointer'}} onClick={cycleTime}>
          <circle cx={52} cy={62} r={5} fill="#0e0e18" stroke="#3a3a5a" strokeWidth="0.8" />
          <circle cx={52} cy={62} r={3.5} fill="#1a1a2a" stroke="#4a4a6a" strokeWidth="0.5" />
          <line x1={52} y1={62} x2={52} y2={58} stroke="#6a6a8a" strokeWidth="0.8" strokeLinecap="round"
            transform={`rotate(${timeAngle}, 52, 62)`} />
          <text x={52} y={72} textAnchor="middle" fill="#3a3a5a" fontSize="2" fontFamily="'Press Start 2P'">SEC</text>
        </g>

        {/* ── LEDs ── */}
        <rect x={80} y={14} width={3} height={3} rx={0.5}
          fill={mode === 'run' ? '#5cff8a' : '#1a2a1a'} filter="url(#softGlow)" />
        <rect x={80} y={20} width={3} height={3} rx={0.5}
          fill={mode === 'stop' ? '#ff7eb3' : '#2a1a1a'} filter="url(#softGlow)" />
        <rect x={80} y={26} width={3} height={3} rx={0.5}
          fill={mode === 'hold' ? '#ffe066' : '#2a2a1a'} filter="url(#softGlow)" />

        {/* ── SIDE BUTTONS ── */}
        <g style={{cursor: 'pointer'}} onClick={() => setMode('run')}>
          <rect x={73} y={36} width={18} height={6} rx={1}
            fill={mode === 'run' ? '#1a2a1a' : '#0e0e18'} stroke={mode === 'run' ? '#5cff8a' : '#3a3a5a'} strokeWidth="0.6" />
          <text x={82} y={40} textAnchor="middle" fill={mode === 'run' ? '#5cff8a' : '#5a5a7a'} fontSize="2.2" fontFamily="'Press Start 2P'">RUN</text>
        </g>
        <g style={{cursor: 'pointer'}} onClick={() => setMode('stop')}>
          <rect x={73} y={46} width={18} height={6} rx={1}
            fill={mode === 'stop' ? '#2a1a1a' : '#0e0e18'} stroke={mode === 'stop' ? '#ff7eb3' : '#3a3a5a'} strokeWidth="0.6" />
          <text x={82} y={50} textAnchor="middle" fill={mode === 'stop' ? '#ff7eb3' : '#5a5a7a'} fontSize="2.2" fontFamily="'Press Start 2P'">STOP</text>
        </g>
        <g style={{cursor: 'pointer'}} onClick={() => setMode('hold')}>
          <rect x={73} y={56} width={18} height={6} rx={1}
            fill={mode === 'hold' ? '#2a2a1a' : '#0e0e18'} stroke={mode === 'hold' ? '#ffe066' : '#3a3a5a'} strokeWidth="0.6" />
          <text x={82} y={60} textAnchor="middle" fill={mode === 'hold' ? '#ffe066' : '#5a5a7a'} fontSize="2.2" fontFamily="'Press Start 2P'">HOLD</text>
        </g>
        <g style={{cursor: 'pointer'}} onClick={cycleWave}>
          <rect x={73} y={66} width={18} height={6} rx={1} fill="#0e0e18" stroke="#3a3a5a" strokeWidth="0.6" />
          <text x={82} y={70} textAnchor="middle" fill="#5a5a7a" fontSize="2.2" fontFamily="'Press Start 2P'">MENU</text>
        </g>
      </g>
    </svg>
  )
}

export default function About() {
  const leftRef = useScrollReveal()
  const rightRef = useScrollReveal()

  return (
    <section className={styles.about} id="about" aria-label="About">
      {ABOUT_DECORATIONS.map((d, i) => (
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
          <div className={styles.left} ref={leftRef}>
            <span className={styles.aboutLabel}>About Me</span>
            <h2 className="section-title">I build real<br />hardware systems.</h2>
            <LabScene />
            <div className={styles.interests}>
              <span className={styles.interestsLabel}>Interests</span>
              <div className={styles.interestsGrid}>
                {INTERESTS.map(i => (
                  <span key={i.label} className={styles.interest}>
                    <span className={styles.interestIcon}>{i.icon}</span>
                    <span className={styles.interestLabel}>{i.label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.right} ref={rightRef}>
            <p className={styles.para}>
              I design the chips that make AI work. Processors, accelerators, the physical layer behind it all. VLSI, RISC-V, FPGAs — the whole deal.
            </p>
            <p className={styles.para}>
              While everyone's building models, I'm building the silicon that makes them worth running. Gate-level stuff with real-world impact.
            </p>
            <p className={styles.para}>
              Someone's gotta build the hardware. I just happen to enjoy it.
            </p>
            <div className={styles.facts}>
              <div className={styles.fact}>
                <span className={styles.factK}>Location</span>
                <span className={styles.factV}>Chennai, India</span>
              </div>
              <div className={styles.fact}>
                <span className={styles.factK}>Education</span>
                <span className={styles.factV}>B.Tech ECE · 2023–2027</span>
              </div>
              <div className={styles.fact}>
                <span className={styles.factK}>Focus</span>
                <span className={styles.factV}>AI Hardware, Embedded, VLSI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
