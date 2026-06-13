import { useState, useEffect, useRef, useCallback } from 'react'
import PixelParticles from '../PixelParticles/PixelParticles'
import Modal from '../Modal/Modal'
import styles from './Hero.module.css'

const INTRO_LINES = [
  '> whoami',
  'ansh — hardware enthusiast',
  '',
  '> cat /etc/motd',
  'I build things that think.',
  'Processors. Accelerators. Silicon.',
  '',
  '> ping brain.local',
  '64 bytes from curiosity: time=0.42ms',
  '',
]

const COMMANDS = {
  'whoami': 'ansh — hardware enthusiast',
  'ls projects': 'fpga-npu/    grl-torus/  6g-beam/\nv2x-sim/     silicon-npu/  turret/',
  'cat skills.txt': '[ RTL: Verilog · Systolic Arrays ]\n[ Arch: RISC-V · FPGA NPUs      ]\n[ ML: GNNs · PyTorch · CNN Accel ]\n[ Embedded: C · TM4C123          ]',
  'cat about.txt': 'I build things that think.\nProcessors. Accelerators. Silicon.',
  'help': 'available commands:\n  whoami          ls projects\n  cat skills.txt  cat about.txt\n  cat resume.txt  date\n  history         help\n  clear',
  'cat resume.txt': 'Ansh Verma\nB.Tech Engineering · 2023–2027\nFocus: VLSI · RISC-V · AI Hardware\nCerts: NVIDIA Deep Learning · AWS Cloud',
  'history': '(use arrow keys to recall previous commands)',
  'clear': '__CLEAR__',
}

const PIXEL_DECORATIONS = [
  { char: '◇', x: '10%', y: '20%', size: 18, color: 'var(--pastel-pink)', delay: 0 },
  { char: '△', x: '85%', y: '15%', size: 16, color: 'var(--pastel-blue)', delay: 1.2 },
  { char: '□', x: '5%', y: '70%', size: 14, color: 'var(--pastel-green)', delay: 0.6 },
  { char: '○', x: '90%', y: '65%', size: 20, color: 'var(--pastel-yellow)', delay: 1.8 },
  { char: '⬡', x: '15%', y: '85%', size: 12, color: 'var(--pastel-purple)', delay: 2.4 },
  { char: '◈', x: '80%', y: '85%', size: 15, color: 'var(--pastel-peach)', delay: 0.3 },
]

function PixelChip({ label, sub, style }) {
  return (
    <div className={styles.chip} style={style}>
      <div className={styles.chipPin}>
        <span /><span /><span />
      </div>
      <div className={styles.chipBody}>
        {label}<br /><small>{sub}</small>
      </div>
      <div className={styles.chipPin}>
        <span /><span /><span />
      </div>
    </div>
  )
}

function GitHubIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-theme="dark">
      <rect width="16" height="16" fill="transparent" />
      {/* Head */}
      <rect x="5" y="1" width="6" height="5" fill="currentColor" />
      <rect x="4" y="2" width="1" height="3" fill="currentColor" />
      <rect x="11" y="2" width="1" height="3" fill="currentColor" />
      {/* Eyes */}
      <rect x="6" y="3" width="1" height="1" fill="var(--bg)" />
      <rect x="9" y="3" width="1" height="1" fill="var(--bg)" />
      {/* Body */}
      <rect x="3" y="6" width="10" height="1" fill="currentColor" />
      <rect x="2" y="7" width="12" height="1" fill="currentColor" />
      <rect x="2" y="8" width="12" height="1" fill="currentColor" />
      <rect x="3" y="9" width="10" height="1" fill="currentColor" />
      <rect x="4" y="10" width="8" height="1" fill="currentColor" />
      {/* Arms */}
      <rect x="1" y="6" width="1" height="2" fill="currentColor" />
      <rect x="14" y="6" width="1" height="2" fill="currentColor" />
      <rect x="0" y="7" width="1" height="1" fill="currentColor" />
      <rect x="15" y="7" width="1" height="1" fill="currentColor" />
      {/* Legs */}
      <rect x="4" y="11" width="2" height="1" fill="currentColor" />
      <rect x="10" y="11" width="2" height="1" fill="currentColor" />
      <rect x="3" y="12" width="2" height="2" fill="currentColor" />
      <rect x="11" y="12" width="2" height="2" fill="currentColor" />
      <rect x="5" y="13" width="1" height="1" fill="currentColor" />
      <rect x="10" y="13" width="1" height="1" fill="currentColor" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-theme="dark">
      <rect width="16" height="16" fill="transparent" />
      {/* Outer box */}
      <rect x="2" y="1" width="12" height="14" fill="currentColor" />
      <rect x="3" y="2" width="10" height="12" fill="var(--bg)" />
      <rect x="4" y="3" width="8" height="10" fill="currentColor" />
      {/* i dot */}
      <rect x="5" y="4" width="2" height="2" fill="var(--bg)" />
      {/* i stem */}
      <rect x="5" y="7" width="2" height="3" fill="var(--bg)" />
      {/* n arch */}
      <rect x="8" y="6" width="1" height="4" fill="var(--bg)" />
      <rect x="9" y="5" width="2" height="1" fill="var(--bg)" />
      <rect x="10" y="6" width="1" height="4" fill="var(--bg)" />
      {/* Bottom bar */}
      <rect x="4" y="11" width="8" height="1" fill="var(--bg)" />
      <rect x="4" y="12" width="7" height="1" fill="var(--bg)" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-theme="dark">
      <rect width="16" height="16" fill="transparent" />
      {/* Envelope body */}
      <rect x="1" y="3" width="14" height="10" fill="currentColor" />
      <rect x="2" y="4" width="12" height="8" fill="var(--bg)" />
      {/* Envelope flap - V shape */}
      <rect x="2" y="4" width="12" height="1" fill="currentColor" />
      <rect x="3" y="5" width="2" height="1" fill="currentColor" />
      <rect x="11" y="5" width="2" height="1" fill="currentColor" />
      <rect x="5" y="6" width="2" height="1" fill="currentColor" />
      <rect x="9" y="6" width="2" height="1" fill="currentColor" />
      <rect x="7" y="7" width="2" height="1" fill="currentColor" />
      {/* Bottom edge */}
      <rect x="2" y="11" width="12" height="1" fill="currentColor" />
      <rect x="1" y="12" width="14" height="1" fill="currentColor" />
      {/* Seal dot */}
      <rect x="7" y="8" width="2" height="2" fill="currentColor" />
    </svg>
  )
}

export default function Hero() {
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [showResume, setShowResume] = useState(false)
  const terminalRef = useRef(null)
  const inputRef = useRef(null)
  const introIdx = useRef(0)
  const introCharIdx = useRef(0)

  // Blink cursor
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 530)
    return () => clearInterval(interval)
  }, [])

  // Mouse parallax for terminal
  useEffect(() => {
    function onMouseMove(e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 6
      const y = (e.clientY / window.innerHeight - 0.5) * 6
      setMousePos({ x, y })
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  // Typewriter intro
  useEffect(() => {
    if (!isTyping) return
    let timeout

    function nextChar() {
      if (introIdx.current >= INTRO_LINES.length) {
        setIsTyping(false)
        return
      }
      const line = INTRO_LINES[introIdx.current]

      if (introCharIdx.current < line.length) {
        const ch = line[introCharIdx.current]
        if (ch !== undefined) {
          setHistory(prev => {
            const copy = [...prev]
            if (copy.length === 0 || copy[copy.length - 1].type !== 'current') {
              copy.push({ type: 'current', text: ch })
            } else {
              copy[copy.length - 1] = { ...copy[copy.length - 1], text: copy[copy.length - 1].text + ch }
            }
            return copy
          })
        }
        introCharIdx.current++
        timeout = setTimeout(nextChar, line.startsWith('>') ? 55 : 18)
      } else {
        setHistory(prev => {
          const copy = [...prev]
          if (copy.length > 0 && copy[copy.length - 1].type === 'current') {
            copy[copy.length - 1] = { type: 'line', text: copy[copy.length - 1].text }
          }
          return [...copy, { type: 'line', text: '' }]
        })
        introIdx.current++
        introCharIdx.current = 0
        const pauseMs = introIdx.current > 0 && INTRO_LINES[introIdx.current - 1]?.startsWith('>') ? 120 : 40
        timeout = setTimeout(nextChar, pauseMs)
      }
    }

    timeout = setTimeout(nextChar, 600)
    return () => clearTimeout(timeout)
  }, [isTyping])

  // Auto-scroll
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history, input])

  // Focus terminal on click
  const focusTerminal = useCallback(() => {
    if (!isTyping && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isTyping])

  // Handle keyboard
  const handleKeyDown = useCallback((e) => {
    if (isTyping) return

    if (e.key === 'Enter') {
      e.preventDefault()
      const cmd = input.trim()
      const newLines = [...history, { type: 'line', text: `> ${cmd}` }]

      if (cmd === 'clear') {
        setHistory([])
      } else if (cmd === '') {
        setHistory(newLines)
      } else {
        const output = cmd === 'date' ? new Date().toLocaleString() : (COMMANDS[cmd] || `command not found: ${cmd}\ntype 'help' for available commands`)
        const outputLines = output.split('\n').map(t => ({ type: 'line', text: t }))
        setHistory([...newLines, ...outputLines])
      }
      setInput('')
    } else if (e.key === 'Backspace') {
      e.preventDefault()
      setInput(prev => prev.slice(0, -1))
    } else if (e.key === 'Escape') {
      setInput('')
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      setInput(prev => prev + e.key)
    }
  }, [input, history, isTyping])

  return (
    <section className={styles.hero} id="hero" aria-label="Hero">
      <PixelParticles />

      {/* Floating pixel decorations */}
      {PIXEL_DECORATIONS.map((d, i) => (
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
        <div className={styles.grid}>

          <div className={styles.text}>
            <h1 className={`${styles.headline} hero-anim hero-anim--1`}>
              <span className={styles.hello}>Hello.</span>
              <span className={styles.nameLine}>I'm <span className={`${styles.name} ${styles.glitch}`} data-text="Ansh Verma">Ansh Verma</span></span>
            </h1>
            <p className={`${styles.role} hero-anim hero-anim--2`}>
              AI Hardware &nbsp;|&nbsp; VLSI
            </p>
            <p className={`${styles.sub} hero-anim hero-anim--3`}>
              I design hardware so AI doesn't have to be slow.
            </p>
            <div className={`${styles.actions} hero-anim hero-anim--4`}>
              <a href="#projects" className="btn btn--primary">View My Work ↓</a>
              <button className="btn btn--outline" onClick={() => setShowResume(true)}>Resume ↗</button>
            </div>
            <div className={`${styles.socialLinks} hero-anim hero-anim--5`}>
              <a href="https://github.com/ansh07verma" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="GitHub">
                <GitHubIcon /><span className={styles.socialLabel}>GitHub</span>
              </a>
              <a href="https://linkedin.com/in/ansh07verma" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
                <LinkedInIcon /><span className={styles.socialLabel}>LinkedIn</span>
              </a>
              <a href="mailto:07anshverma@gmail.com" className={styles.socialLink} aria-label="Email">
                <EmailIcon /><span className={styles.socialLabel}>Email</span>
              </a>
            </div>
          </div>

          <div
            className={`${styles.visual} hero-anim hero-anim--3`}
            style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
            aria-hidden="true"
          >
            <div
              className={styles.terminalBox}
              ref={terminalRef}
              onClick={focusTerminal}
              tabIndex={0}
              role="textbox"
              aria-label="Interactive terminal"
            >
              <div className={styles.terminalBar}>
                <span className={styles.wdot} /><span className={styles.wdot} /><span className={styles.wdot} />
                <span className={styles.terminalTitle}>terminal</span>
              </div>
              <div className={styles.terminalScreen}>
                <pre className={styles.terminalContent}>
                  {history.map((line, i) => (
                    <div key={i} className={line.text?.startsWith('>') ? styles.cmdLine : undefined}>
                      {line.text}
                    </div>
                  ))}
                  {!isTyping && (
                    <div className={styles.inputLine}>
                      <span className={styles.promptChar}>{'>'} </span>
                      <span>{input}</span>
                      <span className={`${styles.cursorBlock} ${cursorVisible ? '' : styles.cursorHidden}`}>█</span>
                    </div>
                  )}
                </pre>
                {!isTyping && (
                  <input
                    ref={inputRef}
                    className={styles.hiddenInput}
                    value={input}
                    onChange={() => {}}
                    onKeyDown={handleKeyDown}
                    aria-label="Terminal input"
                  />
                )}
              </div>
              {!isTyping && (
                <div className={styles.cmdHints}>
                  {['whoami', 'ls projects', 'cat skills.txt', 'date', 'help'].map(cmd => (
                    <button
                      key={cmd}
                      className={styles.cmdHint}
                      onClick={(e) => {
                        e.stopPropagation()
                        const newLines = [...history, { type: 'line', text: `> ${cmd}` }]
                        const output = cmd === 'date' ? new Date().toLocaleString() : (COMMANDS[cmd] || '')
                        const outputLines = output.split('\n').map(t => ({ type: 'line', text: t }))
                        setHistory([...newLines, ...outputLines])
                        setInput('')
                      }}
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.chipDecor}>
              <PixelChip label="SYSTOLIC" sub="4×4" style={{ position: 'absolute', bottom: '80px', right: '-10px' }} />
              <PixelChip label="SKY130" sub="ASIC" style={{ position: 'absolute', top: '10px', right: '0px' }} />
            </div>
          </div>

        </div>
      </div>

      <div className={styles.ticker}>
        <div className={styles.tickerInner}>
          {['Verilog','FSM Design','Testbench Dev','Systolic Arrays','FPGA NPUs','CNN Acceleration','RISC-V','Parallel MAC','Python','Embedded C','Java','GNNs','Random Forest','Neural Networks','Feature Engg','Xilinx Vivado','ModelSim','Cadence Virtuoso','LTSpice'].map(t => (
            <span key={t}><span className={styles.tickerItem}>{t}</span><span className={styles.tickerDot}>·</span></span>
          ))}
          {['Verilog','FSM Design','Testbench Dev','Systolic Arrays','FPGA NPUs','CNN Acceleration','RISC-V','Parallel MAC','Python','Embedded C','Java','GNNs','Random Forest','Neural Networks','Feature Engg','Xilinx Vivado','ModelSim','Cadence Virtuoso','LTSpice'].map(t => (
            <span key={t + '2'}><span className={styles.tickerItem}>{t}</span><span className={styles.tickerDot}>·</span></span>
          ))}
        </div>
      </div>

      <Modal isOpen={showResume} onClose={() => setShowResume(false)}>
        <div className={styles.resumeModal}>
          <iframe src="/resume.pdf" className={styles.resumeFrame} title="Resume" />
          <a href="/resume.pdf" className="btn btn--primary" download style={{ marginTop: '12px', alignSelf: 'center' }}>Download ↗</a>
        </div>
      </Modal>
    </section>
  )
}
