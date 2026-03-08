"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RotateCcw, ArrowLeft } from "lucide-react"

interface Obstacle {
  x: number
  width: number
  height: number
  type: "policeman" | "lamp" | "crate" | "carriage" | "gentleman"
}

export function HydeRunnerGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)
  const runningRef = useRef(false)

  const playerRef = useRef({
    x: 80, y: 0, width: 40, height: 60,
    velocityY: 0, isJumping: false, isDucking: false,
  })
  const obstaclesRef = useRef<Obstacle[]>([])
  const scoreRef = useRef(0)
  const gameSpeedRef = useRef(6)
  const frameCountRef = useRef(0)

  const [screen, setScreen] = useState<"intro" | "playing" | "gameover">("intro")
  const [finalScore, setFinalScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [policeLightPhase, setPoliceLightPhase] = useState(0)

  // Police light flicker
  useEffect(() => {
    const interval = setInterval(() => setPoliceLightPhase(p => (p + 1) % 2), 500)
    return () => clearInterval(interval)
  }, [])

  const jump = () => {
    const p = playerRef.current
    if (!p.isJumping && !p.isDucking) {
      p.velocityY = -15
      p.isJumping = true
    }
  }

  const setDuck = (val: boolean) => {
    const p = playerRef.current
    const canvas = canvasRef.current
    if (!canvas) return
    const groundY = canvas.height - 60
    if (!p.isJumping) {
      p.isDucking = val
      p.height = val ? 30 : 60
      if (val) p.y = groundY - 30
    }
  }

  // Keyboard controls
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!runningRef.current) return
      if (["Space", "ArrowUp"].includes(e.code) || e.key === "w" || e.key === "W") {
        e.preventDefault(); jump()
      }
      if (e.code === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault(); setDuck(true)
      }
    }
    const up = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown" || e.key === "s" || e.key === "S") setDuck(false)
    }
    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)
    return () => {
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
    }
  }, [])

  const spawnObstacle = (canvasWidth: number) => {
    const types = ["policeman", "lamp", "crate", "carriage", "gentleman", "policeman"] as const
    const type = types[Math.floor(Math.random() * types.length)]
    const sizes = {
      policeman: { width: 35, height: 55 },
      lamp:      { width: 20, height: 70 },
      crate:     { width: 40, height: 35 },
      carriage:  { width: 80, height: 45 },
      gentleman: { width: 30, height: 55 },
    }
    obstaclesRef.current.push({ x: canvasWidth + 50, type, ...sizes[type] })
  }

  const checkCollision = (groundY: number) => {
    const p = playerRef.current
    const padding = 8
    for (const obs of obstaclesRef.current) {
      const obsY = groundY - obs.height
      if (
        p.x + padding < obs.x + obs.width &&
        p.x + p.width - padding > obs.x &&
        p.y + padding < groundY &&
        p.y + p.height - padding > obsY
      ) return true
    }
    return false
  }

  const drawBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frameCount: number) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "#0a0a15")
    gradient.addColorStop(0.7, "#1a1a2e")
    gradient.addColorStop(1, "#2d2d44")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const lightPhase = Math.floor(Date.now() / 300) % 2
    ctx.fillStyle = lightPhase === 0 ? "rgba(255,0,0,0.08)" : "rgba(0,0,255,0.08)"
    ctx.fillRect(0, 0, canvas.width, canvas.height / 2)

    ctx.fillStyle = "rgba(100,100,120,0.08)"
    for (let i = 0; i < 5; i++) {
      const fogX = (frameCount * 0.5 + i * 200) % (canvas.width + 200) - 100
      ctx.beginPath()
      ctx.arc(fogX, canvas.height - 100, 80 + i * 20, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.fillStyle = "rgba(255,255,200,0.8)"
    ctx.beginPath()
    ctx.arc(canvas.width - 80, 60, 30, 0, Math.PI * 2)
    ctx.fill()

    const buildings = [
      { x: 0, width: 80, height: 150 }, { x: 70, width: 60, height: 180 },
      { x: 120, width: 90, height: 140 }, { x: 200, width: 70, height: 200 },
      { x: 260, width: 100, height: 160 }, { x: 350, width: 80, height: 190 },
      { x: 420, width: 60, height: 150 }, { x: 470, width: 90, height: 170 },
    ]
    const groundY = canvas.height - 60
    buildings.forEach(b => {
      ctx.fillStyle = "#0d0d15"
      ctx.fillRect(b.x, groundY - b.height, b.width, b.height)
      for (let wy = groundY - b.height + 20; wy < groundY - 20; wy += 30) {
        for (let wx = b.x + 10; wx < b.x + b.width - 10; wx += 20) {
          if (Math.random() > 0.3) {
            ctx.fillStyle = "rgba(255,200,100,0.3)"
            ctx.fillRect(wx, wy, 8, 12)
          }
        }
      }
    })

    ctx.fillStyle = "#2a2a3a"
    ctx.fillRect(0, groundY, canvas.width, 60)
    ctx.fillStyle = "#3a3a4a"
    for (let x = 0; x < canvas.width; x += 30) {
      for (let y = groundY + 5; y < canvas.height; y += 15) {
        ctx.fillRect(x + (y % 30 === 5 ? 0 : 15), y, 25, 10)
      }
    }
  }

  const drawPlayer = (ctx: CanvasRenderingContext2D, groundY: number) => {
    const p = playerRef.current
    ctx.save()

    if (p.isDucking) {
      ctx.fillStyle = "#1a1a1a"
      ctx.fillRect(p.x, groundY - 28, p.width - 5, 22)
      ctx.beginPath(); ctx.arc(p.x + 15, groundY - 28, 12, Math.PI, 0); ctx.fill()
      ctx.fillStyle = "#9a8a7a"
      ctx.beginPath(); ctx.ellipse(p.x + 32, groundY - 18, 8, 10, 0.3, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = "#2a2a2a"
      ctx.beginPath()
      ctx.moveTo(p.x + 25, groundY - 25); ctx.lineTo(p.x + 30, groundY - 32)
      ctx.lineTo(p.x + 35, groundY - 28); ctx.lineTo(p.x + 40, groundY - 33)
      ctx.lineTo(p.x + 42, groundY - 25); ctx.closePath(); ctx.fill()
    } else {
      ctx.fillStyle = "#1a1a1a"
      ctx.beginPath()
      ctx.moveTo(p.x + 5, p.y + 20); ctx.lineTo(p.x + 35, p.y + 18)
      ctx.lineTo(p.x + 38, p.y + 58); ctx.lineTo(p.x + 2, p.y + 60)
      ctx.closePath(); ctx.fill()
      ctx.beginPath(); ctx.arc(p.x + 15, p.y + 18, 15, Math.PI, 0); ctx.fill()
      ctx.fillStyle = "#9a8a7a"
      ctx.beginPath(); ctx.ellipse(p.x + 25, p.y + 8, 10, 12, 0.2, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = "#2a2a2a"
      ctx.beginPath()
      ctx.moveTo(p.x + 12, p.y + 2); ctx.lineTo(p.x + 18, p.y - 10)
      ctx.lineTo(p.x + 22, p.y - 3); ctx.lineTo(p.x + 28, p.y - 12)
      ctx.lineTo(p.x + 32, p.y - 5); ctx.lineTo(p.x + 38, p.y - 8)
      ctx.lineTo(p.x + 38, p.y + 5); ctx.closePath(); ctx.fill()
      ctx.strokeStyle = "#3a1a1a"; ctx.lineWidth = 2
      ctx.beginPath(); ctx.arc(p.x + 28, p.y + 12, 6, 0.2, Math.PI - 0.2); ctx.stroke()
      ctx.fillStyle = "#e8e8d0"
      ctx.beginPath()
      ctx.moveTo(p.x + 23, p.y + 14); ctx.lineTo(p.x + 25, p.y + 17)
      ctx.lineTo(p.x + 27, p.y + 14); ctx.lineTo(p.x + 29, p.y + 17)
      ctx.lineTo(p.x + 31, p.y + 14); ctx.fill()
      ctx.fillStyle = "#9a8a7a"
      ctx.beginPath()
      ctx.moveTo(p.x + 38, p.y + 35); ctx.lineTo(p.x + 45, p.y + 32)
      ctx.lineTo(p.x + 48, p.y + 28); ctx.lineTo(p.x + 46, p.y + 35)
      ctx.lineTo(p.x + 50, p.y + 32); ctx.lineTo(p.x + 47, p.y + 38)
      ctx.closePath(); ctx.fill()
      if (p.isJumping) {
        ctx.fillStyle = "#2d1b2e"
        ctx.beginPath()
        ctx.moveTo(p.x + 5, p.y + 25); ctx.lineTo(p.x - 20, p.y + 55)
        ctx.lineTo(p.x - 10, p.y + 60); ctx.lineTo(p.x + 5, p.y + 55)
        ctx.fill()
      }
    }

    ctx.fillStyle = "#ff2222"; ctx.shadowColor = "#ff0000"; ctx.shadowBlur = 8
    if (p.isDucking) {
      ctx.beginPath()
      ctx.arc(p.x + 30, groundY - 20, 2, 0, Math.PI * 2)
      ctx.arc(p.x + 36, groundY - 21, 2, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.beginPath()
      ctx.arc(p.x + 22, p.y + 6, 2.5, 0, Math.PI * 2)
      ctx.arc(p.x + 30, p.y + 5, 2.5, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.shadowBlur = 0
    ctx.restore()
  }

  const drawObstacle = (ctx: CanvasRenderingContext2D, obs: Obstacle, groundY: number) => {
    ctx.save()
    const oy = groundY - obs.height
    const lightPhase = Math.floor(Date.now() / 300) % 2

    if (obs.type === "policeman") {
      ctx.fillStyle = "#1e3a5f"; ctx.fillRect(obs.x + 5, oy + 15, 25, 40)
      ctx.fillStyle = "#c4a77d"
      ctx.beginPath(); ctx.arc(obs.x + 17, oy + 10, 10, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = "#0a1628"
      ctx.beginPath(); ctx.arc(obs.x + 17, oy + 5, 12, Math.PI, 0); ctx.fill()
      ctx.fillRect(obs.x + 5, oy + 5, 24, 5)
      ctx.fillStyle = "#ffd700"
      ctx.beginPath(); ctx.arc(obs.x + 20, oy + 25, 4, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = lightPhase === 0 ? "rgba(255,0,0,0.3)" : "rgba(0,0,255,0.3)"
      ctx.beginPath(); ctx.arc(obs.x + 17, oy - 5, 20, 0, Math.PI * 2); ctx.fill()
    } else if (obs.type === "lamp") {
      ctx.fillStyle = "#2a2a2a"; ctx.fillRect(obs.x + 8, oy + 15, 4, 55)
      ctx.fillStyle = "#3a3a3a"; ctx.fillRect(obs.x, oy, 20, 15)
      ctx.fillStyle = "rgba(255,200,100,0.3)"
      ctx.beginPath(); ctx.arc(obs.x + 10, oy + 7, 15, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = "#ffcc66"; ctx.fillRect(obs.x + 3, oy + 3, 14, 9)
    } else if (obs.type === "crate") {
      ctx.fillStyle = "#8b4513"; ctx.fillRect(obs.x, oy, obs.width, obs.height)
      ctx.strokeStyle = "#5c2e0a"; ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(obs.x, oy + obs.height / 2); ctx.lineTo(obs.x + obs.width, oy + obs.height / 2)
      ctx.moveTo(obs.x + obs.width / 2, oy); ctx.lineTo(obs.x + obs.width / 2, oy + obs.height)
      ctx.stroke()
    } else if (obs.type === "carriage") {
      ctx.fillStyle = "#1a1a1a"
      ctx.beginPath(); ctx.arc(obs.x + 15, oy + 40, 12, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(obs.x + 65, oy + 40, 12, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = "#4a4a4a"; ctx.lineWidth = 1
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(obs.x + 15, oy + 40)
        ctx.lineTo(obs.x + 15 + Math.cos(angle) * 10, oy + 40 + Math.sin(angle) * 10)
        ctx.moveTo(obs.x + 65, oy + 40)
        ctx.lineTo(obs.x + 65 + Math.cos(angle) * 10, oy + 40 + Math.sin(angle) * 10)
        ctx.stroke()
      }
      ctx.fillStyle = "#2d1f1a"; ctx.fillRect(obs.x + 5, oy + 5, 70, 30)
      ctx.fillStyle = "rgba(200,180,100,0.3)"; ctx.fillRect(obs.x + 25, oy + 10, 30, 15)
      ctx.fillStyle = "#1a1a1a"; ctx.fillRect(obs.x + 3, oy, 74, 8)
    } else if (obs.type === "gentleman") {
      ctx.fillStyle = "#1a1a1a"; ctx.fillRect(obs.x + 5, oy + 20, 20, 35)
      ctx.fillStyle = "#c4a77d"
      ctx.beginPath(); ctx.arc(obs.x + 15, oy + 15, 8, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = "#0a0a0a"
      ctx.fillRect(obs.x + 5, oy - 5, 20, 5); ctx.fillRect(obs.x + 8, oy - 20, 14, 18)
      ctx.strokeStyle = "#5c3a21"; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(obs.x + 25, oy + 25); ctx.lineTo(obs.x + 28, oy + 55); ctx.stroke()
      ctx.beginPath(); ctx.arc(obs.x + 25, oy + 23, 3, 0, Math.PI * 2)
      ctx.fillStyle = "#c9a227"; ctx.fill()
    }
    ctx.restore()
  }

  const startGame = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    const canvas = canvasRef.current
    if (!canvas) return
    const groundY = canvas.height - 60

    playerRef.current = {
      x: 80, y: groundY - 60, width: 40, height: 60,
      velocityY: 0, isJumping: false, isDucking: false,
    }
    obstaclesRef.current = []
    scoreRef.current = 0
    gameSpeedRef.current = 6
    frameCountRef.current = 0
    runningRef.current = true

    setScreen("playing")

    const loop = () => {
      if (!runningRef.current) return
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const groundY = canvas.height - 60
      const p = playerRef.current

      // Physics
      p.velocityY += 0.8
      p.y += p.velocityY
      if (p.y >= groundY - p.height) {
        p.y = groundY - p.height
        p.velocityY = 0
        p.isJumping = false
      }

      // Move & spawn obstacles
      obstaclesRef.current = obstaclesRef.current.filter(o => o.x > -150)
      obstaclesRef.current.forEach(o => { o.x -= gameSpeedRef.current })
      frameCountRef.current++
      const spawnRate = Math.max(60, 120 - Math.floor(scoreRef.current / 500) * 10)
      if (frameCountRef.current % spawnRate === 0) {
        const last = obstaclesRef.current[obstaclesRef.current.length - 1]
        if (!last || last.x < canvas.width - 200) spawnObstacle(canvas.width)
      }

      // Draw
      drawBackground(ctx, canvas, frameCountRef.current)
      obstaclesRef.current.forEach(o => drawObstacle(ctx, o, groundY))
      drawPlayer(ctx, groundY)

      // Score & HUD
      scoreRef.current++
      gameSpeedRef.current += 0.001
      ctx.fillStyle = "#c9a227"
      ctx.font = "bold 20px serif"
      ctx.fillText(`Distancia: ${scoreRef.current}m`, 20, 30)
      ctx.fillStyle = "rgba(255,68,68,0.8)"
      ctx.font = "bold 12px serif"
      ctx.fillText("HYDE", p.x + 5, p.y - 15)

      // Collision check AFTER drawing (so we see the impact frame)
      if (checkCollision(groundY)) {
        runningRef.current = false
        const s = scoreRef.current
        setFinalScore(s)
        setHighScore(prev => Math.max(prev, s))
        setScreen("gameover")
        return
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
  }

  const handleClose = () => {
    runningRef.current = false
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    onClose()
  }

  useEffect(() => {
    return () => {
      runningRef.current = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    if (screen !== "playing") return
    const touch = e.touches[0]
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    if (touch.clientY - rect.top < rect.height / 2) jump()
    else setDuck(true)
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <button
        onClick={handleClose}
        className="absolute -top-12 left-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>

      <div
        className="absolute -inset-1 rounded-xl transition-colors duration-300 pointer-events-none"
        style={{
          background: policeLightPhase === 0
            ? "linear-gradient(90deg, rgba(255,0,0,0.5) 0%, transparent 50%, rgba(0,0,255,0.5) 100%)"
            : "linear-gradient(90deg, rgba(0,0,255,0.5) 0%, transparent 50%, rgba(255,0,0,0.5) 100%)"
        }}
      />

      <div className="relative rounded-xl overflow-hidden border-2 border-primary/30 shadow-2xl bg-background">
        <canvas
          ref={canvasRef}
          width={560}
          height={320}
          className="w-full bg-[#0a0a15] block"
          onTouchStart={handleTouchStart}
          onTouchEnd={() => setDuck(false)}
        />

        {/* Intro Screen */}
        <AnimatePresence>
          {screen === "intro" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0a0a15]/97 flex flex-col items-center justify-center p-6"
            >
              <div
                className="absolute inset-0 pointer-events-none transition-colors duration-300"
                style={{
                  background: policeLightPhase === 0
                    ? "linear-gradient(180deg, rgba(255,0,0,0.1) 0%, transparent 50%)"
                    : "linear-gradient(180deg, rgba(0,0,255,0.1) 0%, transparent 50%)"
                }}
              />
              <div className="relative z-10 text-center max-w-md">
                <h3 className="font-serif text-2xl text-primary mb-1">La Huida de Hyde</h3>
                <p className="text-xs text-muted-foreground/60 mb-4 uppercase tracking-wider">Londres, 1886 — Soho</p>

                <div className="bg-secondary/50 rounded-lg p-4 mb-5 border border-border/50 text-left">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                    Eres Mr. Hyde. Acabas de asesinar a Sir Danvers Carew y debes huir por los
                    callejones del Soho victoriano, esquivando policías, faroles y obstáculos.
                  </p>
                  <p className="text-primary/80 text-sm italic text-center mt-3">
                    «El hombre no es verdaderamente uno, sino verdaderamente dos.»
                  </p>
                  <p className="text-muted-foreground text-xs text-center mt-1">— R. L. Stevenson, 1886</p>
                </div>

                <div className="text-left text-sm text-muted-foreground mb-5 space-y-1">
                  <p className="font-semibold text-foreground">Controles:</p>
                  <p>• ESPACIO / ↑ = Saltar</p>
                  <p>• ↓ = Agacharse</p>
                  <p>• Móvil: toca arriba para saltar, abajo para agacharte</p>
                </div>

                <button
                  onClick={startGame}
                  className="px-8 py-4 text-xl font-bold bg-red-700 hover:bg-red-600 text-white rounded-xl cursor-pointer border-none transition-colors shadow-lg"
                >
                  ▶ START GAME
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over Screen */}
        <AnimatePresence>
          {screen === "gameover" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0a0a15]/97 flex flex-col items-center justify-center"
            >
              <div
                className="absolute inset-0 pointer-events-none transition-colors duration-200"
                style={{
                  background: policeLightPhase === 0
                    ? "linear-gradient(180deg, rgba(255,0,0,0.2) 0%, transparent 70%)"
                    : "linear-gradient(180deg, rgba(0,0,255,0.2) 0%, transparent 70%)"
                }}
              />
              <div className="relative z-10 text-center px-6">
                <div className="text-6xl mb-4">🎩</div>
                <h3 className="font-serif text-xl text-red-400 mb-2">¡Scotland Yard te atrapó!</h3>
                <p className="text-muted-foreground mb-1 text-sm">La policía de Londres encontró a la bestia del Soho.</p>
                <p className="text-xs text-muted-foreground/70 mb-4 italic">
                  «Fue como si el cadáver de un suicida hablara desde la tumba.»
                </p>
                <p className="text-primary text-3xl font-bold mb-1">{finalScore}m</p>
                {finalScore > 0 && finalScore >= highScore && (
                  <p className="text-yellow-400 text-sm mb-4">🏆 ¡Nuevo récord!</p>
                )}
                {finalScore < highScore && (
                  <p className="text-muted-foreground text-sm mb-4">Récord: {highScore}m</p>
                )}
                <div className="flex gap-3 justify-center mt-2">
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Intentar de nuevo
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex items-center gap-2 px-6 py-3 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Volver
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {screen === "playing" && (
        <div className="mt-4 flex justify-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-secondary rounded text-xs">ESPACIO</kbd>
            <span>Saltar</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-secondary rounded text-xs">↓</kbd>
            <span>Agacharse</span>
          </span>
        </div>
      )}
    </div>
  )
}
