function SignalDot({ x1, y1, x2, y2, active, delay = 0 }) {
  return (
    <circle r="2.5" fill={active ? '#5cff8a' : '#8888aa'} opacity="0.9" calcMode="linear">
      <animate
        attributeName="cx"
        values={`${x1};${x2}`}
        dur="0.4s"
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
      <animate
        attributeName="cy"
        values={`${y1};${y2}`}
        dur="0.4s"
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
    </circle>
  )
}

export default function GateSVG({ type, active, inputA = 0, inputB = 0 }) {
  const on = '#5cff8a'
  const off = '#262640'
  const gateOn = '#5cff8a'
  const gateOff = '#262640'
  const stroke = '#0a0a0a'
  const boxOff = '#1e1e30'

  const gates = {
    AND: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="10" width="60" height="60" fill={active ? gateOn : gateOff} stroke={stroke} strokeWidth="3" rx="0"/>
        <text x="60" y="46" textAnchor="middle" fontFamily="'Press Start 2P'" fontSize="8" fill={stroke}>AND</text>
        <line x1="0" y1="25" x2="30" y2="25" stroke={stroke} strokeWidth="2"/>
        <line x1="0" y1="55" x2="30" y2="55" stroke={stroke} strokeWidth="2"/>
        <line x1="90" y1="40" x2="120" y2="40" stroke={stroke} strokeWidth="2"/>
        <rect x="0" y="21" width="8" height="8" fill={inputA ? on : boxOff} stroke={stroke} strokeWidth="2"/>
        <rect x="0" y="51" width="8" height="8" fill={inputB ? on : boxOff} stroke={stroke} strokeWidth="2"/>
        <rect x="112" y="36" width="8" height="8" fill={active ? on : boxOff} stroke={stroke} strokeWidth="2"/>
        {active && (
          <g>
            <SignalDot x1={8} y1={25} x2={30} y2={25} active={inputA} delay={0} />
            <SignalDot x1={8} y1={55} x2={30} y2={55} active={inputB} delay={0.1} />
            <SignalDot x1={90} y1={40} x2={112} y2={40} active={true} delay={0.25} />
          </g>
        )}
      </svg>
    ),
    OR: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <path d="M30,10 Q60,10 90,40 Q60,70 30,70 Z" fill={active ? gateOn : gateOff} stroke={stroke} strokeWidth="3"/>
        <text x="55" y="46" textAnchor="middle" fontFamily="'Press Start 2P'" fontSize="8" fill={stroke}>OR</text>
        <line x1="0" y1="25" x2="35" y2="25" stroke={stroke} strokeWidth="2"/>
        <line x1="0" y1="55" x2="35" y2="55" stroke={stroke} strokeWidth="2"/>
        <line x1="90" y1="40" x2="120" y2="40" stroke={stroke} strokeWidth="2"/>
        <rect x="0" y="21" width="8" height="8" fill={inputA ? on : boxOff} stroke={stroke} strokeWidth="2"/>
        <rect x="0" y="51" width="8" height="8" fill={inputB ? on : boxOff} stroke={stroke} strokeWidth="2"/>
        <rect x="112" y="36" width="8" height="8" fill={active ? on : boxOff} stroke={stroke} strokeWidth="2"/>
        {active && (
          <g>
            <SignalDot x1={8} y1={25} x2={35} y2={25} active={inputA} delay={0} />
            <SignalDot x1={8} y1={55} x2={35} y2={55} active={inputB} delay={0.1} />
            <SignalDot x1={90} y1={40} x2={112} y2={40} active={true} delay={0.25} />
          </g>
        )}
      </svg>
    ),
    XOR: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <path d="M35,10 Q65,10 95,40 Q65,70 35,70 Z" fill={active ? gateOn : gateOff} stroke={stroke} strokeWidth="3"/>
        <path d="M30,10 Q30,40 30,70" fill="none" stroke={stroke} strokeWidth="3"/>
        <text x="60" y="46" textAnchor="middle" fontFamily="'Press Start 2P'" fontSize="8" fill={stroke}>XOR</text>
        <line x1="0" y1="25" x2="38" y2="25" stroke={stroke} strokeWidth="2"/>
        <line x1="0" y1="55" x2="38" y2="55" stroke={stroke} strokeWidth="2"/>
        <line x1="95" y1="40" x2="120" y2="40" stroke={stroke} strokeWidth="2"/>
        <rect x="0" y="21" width="8" height="8" fill={inputA ? on : boxOff} stroke={stroke} strokeWidth="2"/>
        <rect x="0" y="51" width="8" height="8" fill={inputB ? on : boxOff} stroke={stroke} strokeWidth="2"/>
        <rect x="112" y="36" width="8" height="8" fill={active ? on : boxOff} stroke={stroke} strokeWidth="2"/>
        {active && (
          <g>
            <SignalDot x1={8} y1={25} x2={38} y2={25} active={inputA} delay={0} />
            <SignalDot x1={8} y1={55} x2={38} y2={55} active={inputB} delay={0.1} />
            <SignalDot x1={95} y1={40} x2={112} y2={40} active={true} delay={0.25} />
          </g>
        )}
      </svg>
    ),
    NAND: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="10" width="60" height="60" fill={active ? gateOn : gateOff} stroke={stroke} strokeWidth="3" rx="0"/>
        <circle cx="95" cy="40" r="5" fill={active ? gateOn : gateOff} stroke={stroke} strokeWidth="2"/>
        <text x="60" y="46" textAnchor="middle" fontFamily="'Press Start 2P'" fontSize="6" fill={stroke}>NAND</text>
        <line x1="0" y1="25" x2="30" y2="25" stroke={stroke} strokeWidth="2"/>
        <line x1="0" y1="55" x2="30" y2="55" stroke={stroke} strokeWidth="2"/>
        <line x1="100" y1="40" x2="120" y2="40" stroke={stroke} strokeWidth="2"/>
        <rect x="0" y="21" width="8" height="8" fill={inputA ? on : boxOff} stroke={stroke} strokeWidth="2"/>
        <rect x="0" y="51" width="8" height="8" fill={inputB ? on : boxOff} stroke={stroke} strokeWidth="2"/>
        <rect x="112" y="36" width="8" height="8" fill={active ? on : boxOff} stroke={stroke} strokeWidth="2"/>
        {active && (
          <g>
            <SignalDot x1={8} y1={25} x2={30} y2={25} active={inputA} delay={0} />
            <SignalDot x1={8} y1={55} x2={30} y2={55} active={inputB} delay={0.1} />
            <SignalDot x1={100} y1={40} x2={112} y2={40} active={true} delay={0.25} />
          </g>
        )}
      </svg>
    ),
    NOR: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <path d="M30,10 Q60,10 90,40 Q60,70 30,70 Z" fill={active ? gateOn : gateOff} stroke={stroke} strokeWidth="3"/>
        <circle cx="95" cy="40" r="5" fill={active ? gateOn : gateOff} stroke={stroke} strokeWidth="2"/>
        <text x="55" y="46" textAnchor="middle" fontFamily="'Press Start 2P'" fontSize="8" fill={stroke}>NOR</text>
        <line x1="0" y1="25" x2="35" y2="25" stroke={stroke} strokeWidth="2"/>
        <line x1="0" y1="55" x2="35" y2="55" stroke={stroke} strokeWidth="2"/>
        <line x1="100" y1="40" x2="120" y2="40" stroke={stroke} strokeWidth="2"/>
        <rect x="0" y="21" width="8" height="8" fill={inputA ? on : boxOff} stroke={stroke} strokeWidth="2"/>
        <rect x="0" y="51" width="8" height="8" fill={inputB ? on : boxOff} stroke={stroke} strokeWidth="2"/>
        <rect x="112" y="36" width="8" height="8" fill={active ? on : boxOff} stroke={stroke} strokeWidth="2"/>
        {active && (
          <g>
            <SignalDot x1={8} y1={25} x2={35} y2={25} active={inputA} delay={0} />
            <SignalDot x1={8} y1={55} x2={35} y2={55} active={inputB} delay={0.1} />
            <SignalDot x1={100} y1={40} x2={112} y2={40} active={true} delay={0.25} />
          </g>
        )}
      </svg>
    ),
    NOT: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <polygon points="30,10 90,40 30,70" fill={active ? gateOn : gateOff} stroke={stroke} strokeWidth="3"/>
        <circle cx="95" cy="40" r="5" fill={active ? gateOn : gateOff} stroke={stroke} strokeWidth="2"/>
        <text x="52" y="46" textAnchor="middle" fontFamily="'Press Start 2P'" fontSize="8" fill={stroke}>NOT</text>
        <line x1="0" y1="40" x2="30" y2="40" stroke={stroke} strokeWidth="2"/>
        <line x1="100" y1="40" x2="120" y2="40" stroke={stroke} strokeWidth="2"/>
        <rect x="0" y="36" width="8" height="8" fill={inputA ? on : boxOff} stroke={stroke} strokeWidth="2"/>
        <rect x="112" y="36" width="8" height="8" fill={active ? on : boxOff} stroke={stroke} strokeWidth="2"/>
        {active && (
          <g>
            <SignalDot x1={8} y1={40} x2={30} y2={40} active={inputA} delay={0} />
            <SignalDot x1={100} y1={40} x2={112} y2={40} active={true} delay={0.2} />
          </g>
        )}
      </svg>
    ),
  }

  return gates[type] || null
}
