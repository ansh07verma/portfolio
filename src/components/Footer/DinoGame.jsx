import { useRef, useEffect, useCallback } from 'react'

const GROUND_Y = 42
const DINO_SIZE = 24
const DINO_X = 20
const CACTUS_WIDTH = 10
const CACTUS_GAP = 180
const GRAVITY = 0.7
const JUMP_FORCE = -10
const GAME_SPEED = 3

export default function DinoGame() {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    dinoY: GROUND_Y,
    dinoVelY: 0,
    cacti: [],
    score: 0,
    bestScore: 0,
    frameCount: 0,
    speed: GAME_SPEED,
    playing: false,
    dead: false,
  })

  const drawDino = useCallback((ctx, x, y, frameCount) => {
    const s = 1 // scale
    ctx.fillStyle = '#e8e8f0'
    // Head
    ctx.fillRect(x + 12*s, y, 18*s, 8*s)
    // Eye
    ctx.fillStyle = '#0a0a12'
    ctx.fillRect(x + 22*s, y + 2*s, 4*s, 4*s)
    ctx.fillStyle = '#e8e8f0'
    // Body
    ctx.fillRect(x + 8*s, y + 8*s, 22*s, 12*s)
    // Arms
    ctx.fillRect(x + 4*s, y + 12*s, 4*s, 8*s)
    ctx.fillRect(x + 30*s, y + 14*s, 4*s, 4*s)
    // Tail
    ctx.fillRect(x, y + 8*s, 8*s, 4*s)
    ctx.fillRect(x - 4*s, y + 6*s, 4*s, 4*s)
    // Legs
    if (frameCount % 20 < 10) {
      ctx.fillRect(x + 8*s, y + 20*s, 4*s, 16*s)
      ctx.fillRect(x + 20*s, y + 20*s, 4*s, 16*s)
    } else {
      ctx.fillRect(x + 12*s, y + 20*s, 4*s, 16*s)
      ctx.fillRect(x + 16*s, y + 20*s, 4*s, 16*s)
    }
  }, [])

  const drawCactus = useCallback((ctx, x, y, size) => {
    const s = 1 // scale
    ctx.fillStyle = '#e8e8f0'
    // Trunk
    ctx.fillRect(x, y, 10*s, size)
    // Left branch
    ctx.fillRect(x - 8*s, y + 6*s, 8*s, 8*s)
    ctx.fillRect(x - 8*s, y + 8*s, 6*s, 8*s)
    // Right branch
    ctx.fillRect(x + 10*s, y + 8*s, 8*s, 8*s)
    ctx.fillRect(x + 12*s, y + 10*s, 6*s, 8*s)
  }, [])

  const drawGround = useCallback((ctx, W, frameCount, speed) => {
    ctx.fillStyle = 'rgba(232,232,240,0.4)'
    for (let x = 0; x < W; x += 6) {
      if (Math.sin((x + frameCount * speed) * 0.05) > 0.3) {
        ctx.fillRect(x, GROUND_Y + DINO_SIZE + 4, 3, 1)
      }
    }
    ctx.fillRect(0, GROUND_Y + DINO_SIZE + 3, W, 1)
  }, [])

  const drawScore = useCallback((ctx, W, score) => {
    ctx.fillStyle = 'rgba(232,232,240,0.5)'
    ctx.font = '10px "Press Start 2P", monospace'
    ctx.textAlign = 'right'
    ctx.fillText(String(Math.floor(score)).padStart(5, '0'), W - 6, 14)
  }, [])

  const spawnCactus = useCallback((cacti, W) => {
    const lastX = cacti.length > 0 ? cacti[cacti.length - 1].x : W
    cacti.push({
      x: Math.max(lastX + CACTUS_GAP, W + 20),
      y: GROUND_Y + 4,
      size: 16,
    })
  }, [])

  const checkCollision = useCallback((dinoY, cactus) => {
    const s = 1
    const dinoRight = DINO_X + 30*s
    const dinoBottom = dinoY + DINO_SIZE
    const cactusLeft = cactus.x
    const cactusRight = cactus.x + CACTUS_WIDTH
    const cactusTop = cactus.y
    const cactusBottom = cactus.y + cactus.size
    return (
      dinoRight > cactusLeft + 6 &&
      DINO_X + 6 < cactusRight &&
      dinoBottom > cactusTop &&
      dinoY + 8 < cactusBottom
    )
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height
    const s = stateRef.current
    let raf

    function update() {
      s.frameCount++
      s.speed = GAME_SPEED + Math.floor(s.score / 100) * 0.3

      s.dinoVelY += GRAVITY
      s.dinoY += s.dinoVelY
      if (s.dinoY >= GROUND_Y) {
        s.dinoY = GROUND_Y
        s.dinoVelY = 0
      }

      s.cacti.forEach(c => { c.x -= s.speed })
      s.cacti = s.cacti.filter(c => c.x > -30)

      if (s.cacti.length === 0 || s.cacti[s.cacti.length - 1].x < W - CACTUS_GAP) {
        spawnCactus(s.cacti, W)
      }

      s.score += 0.1

      for (const c of s.cacti) {
        if (checkCollision(s.dinoY, c)) {
          s.bestScore = Math.max(s.bestScore, Math.floor(s.score))
          s.dead = true
          s.playing = false
          cancelAnimationFrame(raf)
          draw()
          return
        }
      }

      draw()
      raf = requestAnimationFrame(update)
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)
      drawGround(ctx, W, s.frameCount, s.speed)
      for (const c of s.cacti) {
        drawCactus(ctx, c.x, c.y, c.size)
      }
      drawDino(ctx, DINO_X, s.dinoY, s.frameCount)
      drawScore(ctx, W, s.score)

      if (s.dead) {
        ctx.fillStyle = 'rgba(232,232,240,0.7)'
        ctx.font = '10px "Press Start 2P", monospace'
        ctx.textAlign = 'center'
        ctx.fillText('GAME OVER', W / 2, H / 2 - 4)
        ctx.font = '8px "Press Start 2P", monospace'
        ctx.fillStyle = 'rgba(232,232,240,0.4)'
        ctx.fillText('click or space to restart', W / 2, H / 2 + 10)
      }

      if (!s.playing && !s.dead) {
        ctx.fillStyle = 'rgba(232,232,240,0.5)'
        ctx.font = '10px "Press Start 2P", monospace'
        ctx.textAlign = 'center'
        ctx.fillText('click or space to play', W / 2, H / 2)
      }
    }

    function startGame() {
      s.dinoY = GROUND_Y
      s.dinoVelY = 0
      s.cacti = []
      s.score = 0
      s.frameCount = 0
      s.speed = GAME_SPEED
      s.playing = true
      s.dead = false
      raf = requestAnimationFrame(update)
    }

    function jump() {
      if (s.playing && !s.dead && s.dinoY >= GROUND_Y) {
        s.dinoVelY = JUMP_FORCE
      }
    }

    function handleKey(e) {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault()
        if (!s.playing || s.dead) {
          startGame()
        } else {
          jump()
        }
      }
    }

    function handleClick() {
      if (!s.playing || s.dead) {
        startGame()
      } else {
        jump()
      }
    }

    window.addEventListener('keydown', handleKey)
    canvas.addEventListener('click', handleClick)

    draw()

    return () => {
      window.removeEventListener('keydown', handleKey)
      canvas.removeEventListener('click', handleClick)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [drawDino, drawCactus, drawGround, drawScore, spawnCactus, checkCollision])

  return (
    <canvas
      ref={canvasRef}
      width={280}
      height={60}
      style={{
        imageRendering: 'pixelated',
        cursor: 'pointer',
        width: '100%',
        height: 'auto',
        display: 'block',
      }}
    />
  )
}
