import { useState, useMemo, useEffect, useRef } from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'
import GateSVG from './GateSVG'
import styles from './Playground.module.css'

const PLAYGROUND_DECORATIONS = [
  { char: '⊕', x: '2%',  y: '8%',  size: 14, color: 'var(--pastel-green)',  delay: 0 },
  { char: '⟐', x: '95%', y: '12%', size: 12, color: 'var(--pastel-purple)', delay: 1.5 },
  { char: '⬡', x: '4%',  y: '88%', size: 16, color: 'var(--pastel-pink)',   delay: 0.8 },
  { char: '⊠', x: '92%', y: '85%', size: 13, color: 'var(--pastel-yellow)', delay: 2.0 },
  { char: '⟡', x: '6%',  y: '45%', size: 11, color: 'var(--pastel-blue)',   delay: 1.2 },
  { char: '★', x: '96%', y: '50%', size: 15, color: 'var(--pastel-peach)',  delay: 0.4 },
]

const GATE_LIST = ['AND', 'OR', 'XOR', 'NAND', 'NOR', 'NOT']

const GATE_FN = {
  AND:  (a, b) => a & b,
  OR:   (a, b) => a | b,
  XOR:  (a, b) => a ^ b,
  NAND: (a, b) => (a & b) ^ 1,
  NOR:  (a, b) => (a | b) ^ 1,
  NOT:  (a)    => a ^ 1,
}

const TRUTH_TABLE = {
  AND:  [[0,0,0],[0,1,0],[1,0,0],[1,1,1]],
  OR:   [[0,0,0],[0,1,1],[1,0,1],[1,1,1]],
  XOR:  [[0,0,0],[0,1,1],[1,0,1],[1,1,0]],
  NAND: [[0,0,1],[0,1,1],[1,0,1],[1,1,0]],
  NOR:  [[0,0,1],[0,1,0],[1,0,0],[1,1,0]],
  NOT:  [[0,1],[1,0]],
}

const CYCLE_LENGTH = 8

function TimingDiagram({ history }) {
  const cellWidth = 48
  const cellHeight = 32
  const labelWidth = 56
  const totalWidth = labelWidth + CYCLE_LENGTH * cellWidth
  const totalHeight = 3 * cellHeight + 16

  function renderWaveform(values, rowIndex) {
    const y = rowIndex * cellHeight
    if (values.length === 0) return null

    const segments = []
    let i = 0
    while (i < values.length) {
      const val = values[i]
      let runLength = 1
      while (i + runLength < values.length && values[i + runLength] === val) {
        runLength++
      }
      const x1 = labelWidth + i * cellWidth
      const x2 = labelWidth + (i + runLength) * cellWidth
      const highY = y + 4
      const lowY = y + cellHeight - 4

      if (val === 1) {
        segments.push(
          <path
            key={`h-${i}`}
            d={`M${x1},${highY} L${x2},${highY}`}
            className={styles.timingHigh}
          />
        )
      } else {
        segments.push(
          <path
            key={`l-${i}`}
            d={`M${x1},${lowY} L${x2},${lowY}`}
            className={styles.timingLow}
          />
        )
      }

      if (i > 0 && values[i] !== values[i - 1]) {
        const fromY = values[i - 1] === 1 ? highY : lowY
        const toY = val === 1 ? highY : lowY
        segments.push(
          <path
            key={`t-${i}`}
            d={`M${x1},${fromY} L${x1},${toY}`}
            className={styles.timingTransition}
          />
        )
      }

      i += runLength
    }

    return segments
  }

  const labels = ['A', 'B', 'OUT']
  const historyData = [
    history.map(h => h.a),
    history.map(h => h.b),
    history.map(h => h.out),
  ]

  return (
    <div className={styles.timingWrap}>
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className={styles.timingSvg}
      >
        {labels.map((label, ri) => (
          <g key={label}>
            <text
              x={labelWidth / 2}
              y={ri * cellHeight + cellHeight / 2 + 4}
              className={styles.timingLabel}
              textAnchor="middle"
            >
              {label}
            </text>
            <line
              x1={labelWidth}
              y1={(ri + 1) * cellHeight}
              x2={totalWidth}
              y2={(ri + 1) * cellHeight}
              className={styles.timingGridLine}
            />
            {renderWaveform(historyData[ri], ri)}
          </g>
        ))}
      </svg>
    </div>
  )
}

export default function Playground() {
  const [gate, setGate] = useState('AND')
  const [inputA, setInputA] = useState(0)
  const [inputB, setInputB] = useState(0)
  const [history, setHistory] = useState([])
  const ref = useScrollReveal()

  const isNot = gate === 'NOT'
  const output = isNot ? GATE_FN[gate](inputA) : GATE_FN[gate](inputA, inputB)
  const table = TRUTH_TABLE[gate]

  const highlightRow = useMemo(() => {
    if (isNot) return inputA
    return inputA * 2 + inputB
  }, [gate, inputA, inputB, isNot])

  const prevOutputRef = useRef(output)
  const prevARef = useRef(inputA)
  const prevBRef = useRef(inputB)

  useEffect(() => {
    setHistory([])
  }, [])

  useEffect(() => {
    if (output !== prevOutputRef.current || inputA !== prevARef.current || inputB !== prevBRef.current) {
      setHistory(prev => {
        const next = [...prev, { a: inputA, b: inputB, out: output }]
        if (next.length > CYCLE_LENGTH) {
          return next.slice(next.length - CYCLE_LENGTH)
        }
        return next
      })
      prevOutputRef.current = output
      prevARef.current = inputA
      prevBRef.current = inputB
    }
  }, [output, inputA, inputB])

  const resetHistory = () => setHistory([])

  return (
    <section className={`${styles.playground} section-pastel-mint`} id="playground" aria-label="Logic Gate Playground">
      {PLAYGROUND_DECORATIONS.map((d, i) => (
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
        <div ref={ref}>
          <span className={styles.playgroundLabel}>Interactive</span>
          <h2 className="section-title">Play With Logic</h2>
        </div>

        <div className={styles.layout}>
          {/* LEFT: Gate visualization */}
          <div className={styles.vizPanel}>
            {/* Gate selector */}
            <div className={styles.gateSelector}>
              {GATE_LIST.map(g => (
                <button
                  key={g}
                  className={`${styles.gateBtn} ${gate === g ? styles.gateBtnActive : ''}`}
                  onClick={() => { setGate(g); setInputA(0); setInputB(0) }}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Signal flow */}
            <div className={styles.signalFlow}>
              {/* Left: Inputs stacked vertically */}
              <div className={styles.inputStack}>
                <div className={styles.inputGroup}>
                  <span className={styles.inputLabel}>INPUT A</span>
                  <button
                    className={`${styles.toggle} ${inputA ? styles.toggleOn : ''}`}
                    onClick={() => setInputA(inputA ^ 1)}
                    aria-label={`Toggle input A: ${inputA}`}
                  >
                    <span className={styles.toggleTrack}>
                      <span className={styles.toggleThumb} />
                    </span>
                    <span className={styles.toggleValue}>{inputA}</span>
                  </button>
                </div>

                {!isNot ? (
                  <div className={styles.inputGroup}>
                    <span className={styles.inputLabel}>INPUT B</span>
                    <button
                      className={`${styles.toggle} ${inputB ? styles.toggleOn : ''}`}
                      onClick={() => setInputB(inputB ^ 1)}
                      aria-label={`Toggle input B: ${inputB}`}
                    >
                      <span className={styles.toggleTrack}>
                        <span className={styles.toggleThumb} />
                      </span>
                      <span className={styles.toggleValue}>{inputB}</span>
                    </button>
                  </div>
                ) : (
                  <div className={styles.inputGroup} />
                )}
              </div>

              {/* Center: Gate */}
              <div className={styles.gateBox}>
                <GateSVG type={gate} active={output === 1} inputA={inputA} inputB={inputB} />
              </div>

              {/* Right: Output */}
              <div className={styles.outputGroup}>
                <span className={styles.outputLabel}>OUTPUT</span>
                <div className={`${styles.led} ${output ? styles.ledOn : ''}`}>
                  <span className={styles.ledBulb} />
                </div>
                <span className={styles.outputValue}>{output}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Truth table */}
          <div className={styles.tablePanel}>
            <div className={styles.tableHeader}>TRUTH TABLE</div>
            <div className={styles.table}>
              <div className={styles.tableRow + ' ' + styles.tableHeadRow}>
                {!isNot && <span className={styles.tableCell}>A</span>}
                {!isNot && <span className={styles.tableCell}>B</span>}
                {isNot && <span className={styles.tableCell}>A</span>}
                <span className={styles.tableCell}>OUT</span>
              </div>
              {table.map((row, i) => (
                <div
                  key={i}
                  className={`${styles.tableRow} ${i === highlightRow ? styles.tableRowActive : ''}`}
                >
                  {row.slice(0, -1).map((val, j) => (
                    <span key={j} className={styles.tableCell}>{val}</span>
                  ))}
                  <span className={`${styles.tableCell} ${styles.tableCellOutput}`}>
                    {row[row.length - 1]}
                  </span>
                </div>
              ))}
            </div>
            <div className={styles.tableFormula}>
              {gate === 'AND' && 'OUT = A · B'}
              {gate === 'OR' && 'OUT = A + B'}
              {gate === 'XOR' && 'OUT = A ⊕ B'}
              {gate === 'NAND' && 'OUT = (A · B)\''}
              {gate === 'NOR' && 'OUT = (A + B)\''}
              {gate === 'NOT' && 'OUT = A\''}
            </div>
          </div>
        </div>

        {/* Timing Diagram */}
        <div className={styles.timingBox}>
          <div className={styles.timingHeader}>
            TIMING DIAGRAM — LAST {CYCLE_LENGTH} CYCLES
            <button
              onClick={resetHistory}
              className={styles.timingResetBtn}
            >
              RESET
            </button>
          </div>
          <TimingDiagram history={history} />
        </div>
      </div>
    </section>
  )
}
