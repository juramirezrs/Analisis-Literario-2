"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, RotateCcw, ArrowLeft, Info } from "lucide-react"

interface GameState {
  isPlaying: boolean
  isGameOver: boolean
  score: number
  highScore: number
  showIntro: boolean
}

interface Obstacle {
  x: number
  width: number
  height: number
  type: "policeman" | "lamp" | "crate" | "carriage" | "gentleman"
}

export function HydeRunnerGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number | null>(null)
  const gameLoopFnRef = useRef<(() => void) | null>(null)
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    highScore: 0,
    showIntro: true,
  })

  const [policeLightPhase, setPoliceLightPhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPoliceLightPhase(prev => (prev + 1) % 2)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const playerRef = useRef({
    x: 80,
    y: 0,
    width: 40,
    height: 60,
    velocityY: 0,
    isJumping: false,
    isDucking: false,
  })
  const obstaclesRef = useRef<Obstacle[]>([])
  const groundYRef = useRef(0)
  const scoreRef = useRef(0)
  const gameSpeedRef = useRef(6)
  const frameCountRef = useRef(0)

  const GRAVITY = 0.8
  const JUMP_FORCE = -15
  const INITIAL_SPEED = 6
  const SPEED_INCREMENT = 0.001

  const resetGame = useCallback(() => {
    playerRef.current = {
      x: 80,
      y: 0,
      width: 40,
      height: 60,
      velocityY: 0,
      isJumping: false,
      isDucking: false,
    }
    obstaclesRef.current = []
    scoreRef.current = 0
    gameSpeedRef.current = INITIAL_SPEED
    frameCountRef.current = 0
  }, [])

  const jump = useCallback(() => {
    const player = playerRef.current
    if (!player.isJumping && !player.isDucking) {
      player.velocityY = JUMP_FORCE
      player.isJumping = true
    }
  }, [])

  const duck = useCallback((isDucking: boolean) => {
    const player = playerRef.current
    if (!player.isJumping) {
      player.isDucking = isDucking
      player.height = isDucking ? 30 : 60
      if (isDucking) {
        player.y = groundYRef.current - 30
      }
    }
  }, [])

  const spawnObstacle = useCallback((canvasWidth: number) => {
    const types: ("policeman" | "lamp" | "crate" | "carriage" | "gentleman")[] = ["policeman", "lamp", "crate", "carriage", "gentleman", "policeman"]
    const type = types[Math.floor(Math.random() * types.length)]

    let width = 30
    let height = 50

    if (type === "policeman") {
      width = 35
      height = 55
    } else if (type === "lamp") {
      width = 20
      height = 70
    } else if (type === "crate") {
      width = 40
      height = 35
    } else if (type === "carriage") {
      width = 80
      height = 45
    } else if (type === "gentleman") {
      width = 30
      height = 55
    }

    obstaclesRef.current.push({
      x: canvasWidth + 50,
      width,
      height,
      type,
    })
  }, [])

  const checkCollision = useCallback((player: typeof playerRef.current, obstacle: Obstacle, groundY: number) => {
    const playerBottom = player.y + player.height
    const playerRight = player.x + player.width
    const obstacleY = groundY - obstacle.height
    const obstacleRight = obstacle.x + obstacle.width

    const padding = 8

    return (
      player.x + padding < obstacleRight &&
      playerRight - padding > obstacle.x &&
      player.y + padding < groundY &&
      playerBottom - padding > obstacleY
    )
  }, [])

  const drawPlayer = useCallback((ctx: CanvasRenderingContext2D, player: typeof playerRef.current, groundY: number) => {
    ctx.save()

    if (player.isDucking) {
      ctx.fillStyle = "#1a1a1a"
      ctx.fillRect(player.x, groundY - 28, player.width - 5, 22)
      ctx.beginPath()
      ctx.arc(player.x + 15, groundY - 28, 12, Math.PI, 0)
      ctx.fill()
      ctx.fillStyle = "#9a8a7a"
      ctx.beginPath()
      ctx.ellipse(player.x + 32, groundY - 18, 8, 10, 0.3, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#2a2a2a"
      ctx.beginPath()
      ctx.moveTo(player.x + 25, groundY - 25)
      ctx.lineTo(player.x + 30, groundY - 32)
      ctx.lineTo(player.x + 35, groundY - 28)
      ctx.lineTo(player.x + 40, groundY - 33)
      ctx.lineTo(player.x + 42, groundY - 25)
      ctx.closePath()
      ctx.fill()
    } else {
      ctx.fillStyle = "#1a1a1a"
      ctx.beginPath()
      ctx.moveTo(player.x + 5, player.y + 20)
      ctx.lineTo(player.x + 35, player.y + 18)
      ctx.lineTo(player.x + 38, player.y + 58)
      ctx.lineTo(player.x + 2, player.y + 60)
      ctx.closePath()
      ctx.fill()
      ctx.beginPath()
      ctx.arc(player.x + 15, player.y + 18, 15, Math.PI, 0)
      ctx.fill()
      ctx.fillStyle = "#9a8a7a"
      ctx.beginPath()
      ctx.ellipse(player.x + 25, player.y + 8, 10, 12, 0.2, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#2a2a2a"
      ctx.beginPath()
      ctx.moveTo(player.x + 12, player.y + 2)
      ctx.lineTo(player.x + 18, player.y - 10)
      ctx.lineTo(player.x + 22, player.y - 3)
      ctx.lineTo(player.x + 28, player.y - 12)
      ctx.lineTo(player.x + 32, player.y - 5)
      ctx.lineTo(player.x + 38, player.y - 8)
      ctx.lineTo(player.x + 38, player.y + 5)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = "#3a1a1a"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(player.x + 28, player.y + 12, 6, 0.2, Math.PI - 0.2)
      ctx.stroke()
      ctx.fillStyle = "#e8e8d0"
      ctx.beginPath()
      ctx.moveTo(player.x + 23, player.y + 14)
      ctx.lineTo(player.x + 25, player.y + 17)
      ctx.lineTo(player.x + 27, player.y + 14)
      ctx.lineTo(player.x + 29, player.y + 17)
      ctx.lineTo(player.x + 31, player.y + 14)
      ctx.fill()
      ctx.fillStyle = "#9a8a7a"
      ctx.beginPath()
      ctx.moveTo(player.x + 38, player.y + 35)
      ctx.lineTo(player.x + 45, player.y + 32)
      ctx.lineTo(player.x + 48, player.y + 28)
      ctx.lineTo(player.x + 46, player.y + 35)
      ctx.lineTo(player.x + 50, player.y + 32)
      ctx.lineTo(player.x + 47, player.y + 38)
      ctx.closePath()
      ctx.fill()
    }

    ctx.fillStyle = "#ff2222"
    ctx.shadowColor = "#ff0000"
    ctx.shadowBlur = 8
    if (player.isDucking) {
      ctx.beginPath()
      ctx.arc(player.x + 30, groundY - 20, 2, 0, Math.PI * 2)
      ctx.arc(player.x + 36, groundY - 21, 2, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.beginPath()
      ctx.arc(player.x + 22, player.y + 6, 2.5, 0, Math.PI * 2)
      ctx.arc(player.x + 30, player.y + 5, 2.5, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.shadowBlur = 0

    if (player.isJumping) {
      ctx.fillStyle = "#2d1b2e"
      ctx.beginPath()
      ctx.moveTo(player.x + 5, player.y + 25)
      ctx.lineTo(player.x - 20, player.y + 55)
      ctx.lineTo(player.x - 10, player.y + 60)
      ctx.lineTo(player.x + 5, player.y + 55)
      ctx.fill()
    }

    ctx.restore()
  }, [])

  const drawObstacle = useCallback((ctx: CanvasRenderingContext2D, obstacle: Obstacle, groundY: number, lightPhase: number) => {
    ctx.save()
    const obstacleY = groundY - obstacle.height

    if (obstacle.type === "policeman") {
      ctx.fillStyle = "#1e3a5f"
      ctx.fillRect(obstacle.x + 5, obstacleY + 15, 25, 40)
      ctx.fillStyle = "#c4a77d"
      ctx.beginPath()
      ctx.arc(obstacle.x + 17, obstacleY + 10, 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#0a1628"
      ctx.beginPath()
      ctx.arc(obstacle.x + 17, obstacleY + 5, 12, Math.PI, 0)
      ctx.fill()
      ctx.fillRect(obstacle.x + 5, obstacleY + 5, 24, 5)
      ctx.fillStyle = "#ffd700"
      ctx.beginPath()
      ctx.arc(obstacle.x + 20, obstacleY + 25, 4, 0, Math.PI * 2)
      ctx.fill()
      if (lightPhase === 0) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.3)"
        ctx.beginPath()
        ctx.arc(obstacle.x + 17, obstacleY - 5, 20, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.fillStyle = "rgba(0, 0, 255, 0.3)"
        ctx.beginPath()
        ctx.arc(obstacle.x + 17, obstacleY - 5, 20, 0, Math.PI * 2)
        ctx.fill()
      }
    } else if (obstacle.type === "lamp") {
      ctx.fillStyle = "#2a2a2a"
      ctx.fillRect(obstacle.x + 8, obstacleY + 15, 4, 55)
      ctx.fillStyle = "#3a3a3a"
      ctx.fillRect(obstacle.x, obstacleY, 20, 15)
      ctx.fillStyle = "rgba(255, 200, 100, 0.3)"
      ctx.beginPath()
      ctx.arc(obstacle.x + 10, obstacleY + 7, 15, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#ffcc66"
      ctx.fillRect(obstacle.x + 3, obstacleY + 3, 14, 9)
    } else if (obstacle.type === "crate") {
      ctx.fillStyle = "#8b4513"
      ctx.fillRect(obstacle.x, obstacleY, obstacle.width, obstacle.height)
      ctx.strokeStyle = "#5c2e0a"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(obstacle.x, obstacleY + obstacle.height / 2)
      ctx.lineTo(obstacle.x + obstacle.width, obstacleY + obstacle.height / 2)
      ctx.moveTo(obstacle.x + obstacle.width / 2, obstacleY)
      ctx.lineTo(obstacle.x + obstacle.width / 2, obstacleY + obstacle.height)
      ctx.stroke()
    } else if (obstacle.type === "carriage") {
      ctx.fillStyle = "#1a1a1a"
      ctx.beginPath()
      ctx.arc(obstacle.x + 15, obstacleY + 40, 12, 0, Math.PI * 2)
      ctx.arc(obstacle.x + 65, obstacleY + 40, 12, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = "#4a4a4a"
      ctx.lineWidth = 1
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(obstacle.x + 15, obstacleY + 40)
        ctx.lineTo(obstacle.x + 15 + Math.cos(angle) * 10, obstacleY + 40 + Math.sin(angle) * 10)
        ctx.moveTo(obstacle.x + 65, obstacleY + 40)
        ctx.lineTo(obstacle.x + 65 + Math.cos(angle) * 10, obstacleY + 40 + Math.sin(angle) * 10)
        ctx.stroke()
      }
      ctx.fillStyle = "#2d1f1a"
      ctx.fillRect(obstacle.x + 5, obstacleY + 5, 70, 30)
      ctx.fillStyle = "rgba(200, 180, 100, 0.3)"
      ctx.fillRect(obstacle.x + 25, obstacleY + 10, 30, 15)
      ctx.fillStyle = "#1a1a1a"
      ctx.fillRect(obstacle.x + 3, obstacleY, 74, 8)
    } else if (obstacle.type === "gentleman") {
      ctx.fillStyle = "#1a1a1a"
      ctx.fillRect(obstacle.x + 5, obstacleY + 20, 20, 35)
      ctx.fillStyle = "#c4a77d"
      ctx.beginPath()
      ctx.arc(obstacle.x + 15, obstacleY + 15, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#0a0a0a"
      ctx.fillRect(obstacle.x + 5, obstacleY - 5, 20, 5)
      ctx.fillRect(obstacle.x + 8, obstacleY - 20, 14, 18)
      ctx.strokeStyle = "#5c3a21"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(obstacle.x + 25, obstacleY + 25)
      ctx.lineTo(obstacle.x + 28, obstacleY + 55)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(obstacle.x + 25, obstacleY + 23, 3, 0, Math.PI * 2)
      ctx.fillStyle = "#c9a227"
      ctx.fill()
    }

    ctx.restore()
  }, [])

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const player = playerRef.current
    const groundY = canvas.height - 60
    groundYRef.current = groundY

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "#0a0a15")
    gradient.addColorStop(0.7, "#1a1a2e")
    gradient.addColorStop(1, "#2d2d44")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const lightPhase = Math.floor(Date.now() / 300) % 2
    if (lightPhase === 0) {
      ctx.fillStyle = "rgba(255, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height / 2)
    } else {
      ctx.fillStyle = "rgba(0, 0, 255, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height / 2)
    }

    ctx.fillStyle = "rgba(100, 100, 120, 0.1)"
    for (let i = 0; i < 5; i++) {
      const fogX = (frameCountRef.current * 0.5 + i * 200) % (canvas.width + 200) - 100
      ctx.beginPath()
      ctx.arc(fogX, canvas.height - 100, 80 + i * 20, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.fillStyle = "rgba(255, 255, 200, 0.8)"
    ctx.beginPath()
    ctx.arc(canvas.width - 80, 60, 30, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#0d0d15"
    const buildings = [
      { x: 0, width: 80, height: 150 },
      { x: 70, width: 60, height: 180 },
      { x: 120, width: 90, height: 140 },
      { x: 200, width: 70, height: 200 },
      { x: 260, width: 100, height: 160 },
      { x: 350, width: 80, height: 190 },
      { x: 420, width: 60, height: 150 },
      { x: 470, width: 90, height: 170 },
    ]
    buildings.forEach(b => {
      ctx.fillRect(b.x, canvas.height - 60 - b.height, b.width, b.height)
      ctx.fillStyle = "rgba(255, 200, 100, 0.3)"
      for (let wy = canvas.height - 60 - b.height + 20; wy < canvas.height - 80; wy += 30) {
        for (let wx = b.x + 10; wx < b.x + b.width - 10; wx += 20) {
          if (Math.random() > 0.3) {
            ctx.fillRect(wx, wy, 8, 12)
          }
        }
      }
      ctx.fillStyle = "#0d0d15"
    })

    ctx.fillStyle = "#2a2a3a"
    ctx.fillRect(0, groundY, canvas.width, 60)
    ctx.fillStyle = "#3a3a4a"
    for (let x = 0; x < canvas.width; x += 30) {
      for (let y = groundY + 5; y < canvas.height; y += 15) {
        ctx.fillRect(x + (y % 30 === 5 ? 0 : 15), y, 25, 10)
      }
    }

    player.velocityY += GRAVITY
    player.y += player.velocityY

    if (player.y >= groundY - player.height) {
      player.y = groundY - player.height
      player.velocityY = 0
      player.isJumping = false
    }

    obstaclesRef.current = obstaclesRef.current.filter(obs => obs.x > -100)
    obstaclesRef.current.forEach(obs => {
      obs.x -= gameSpeedRef.current
    })

    frameCountRef.current++
    const spawnRate = Math.max(60, 120 - Math.floor(scoreRef.current / 500) * 10)
    if (frameCountRef.current % spawnRate === 0) {
      const lastObs = obstaclesRef.current[obstaclesRef.current.length - 1]
      if (!lastObs || lastObs.x < canvas.width - 200) {
        spawnObstacle(canvas.width)
      }
    }

    for (const obs of obstaclesRef.current) {
      if (checkCollision(player, obs, groundY)) {
        setGameState(prev => ({
          ...prev,
          isPlaying: false,
          isGameOver: true,
          score: scoreRef.current,
          highScore: Math.max(prev.highScore, scoreRef.current),
        }))
        return
      }
    }

    obstaclesRef.current.forEach(obs => {
      drawObstacle(ctx, obs, groundY, lightPhase)
    })

    drawPlayer(ctx, player, groundY)

    scoreRef.current++
    gameSpeedRef.current += SPEED_INCREMENT

    ctx.fillStyle = "#c9a227"
    ctx.font = "bold 20px serif"
    ctx.fillText(`Distancia: ${scoreRef.current}m`, 20, 30)

    ctx.fillStyle = "rgba(255, 68, 68, 0.8)"
    ctx.font = "bold 12px serif"
    ctx.fillText("HYDE", player.x + 5, player.y - 15)

    // ✅ FIX: usa ref para evitar el closure stale
    gameLoopRef.current = requestAnimationFrame(() => gameLoopFnRef.current?.())
  }, [spawnObstacle, checkCollision, drawObstacle, drawPlayer])

  const startGame = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current)
    }

    resetGame()

    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      isGameOver: false,
      showIntro: false,
      score: 0,
    }))

    // ✅ FIX: guarda la función actual en el ref antes de llamarla
    gameLoopFnRef.current = gameLoop
    gameLoopRef.current = requestAnimationFrame(() => gameLoopFnRef.current?.())
  }, [resetGame, gameLoop])

  const goBack = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current)
    }
    onClose()
  }, [onClose])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameState.isPlaying) return
      if (e.code === "Space" || e.code === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault()
        jump()
      }
      if (e.code === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault()
        duck(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown" || e.key === "s" || e.key === "S") {
        duck(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [gameState.isPlaying, jump, duck])

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!gameState.isPlaying) return
    const touch = e.touches[0]
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const touchY = touch.clientY - rect.top

    if (touchY < rect.height / 2) {
      jump()
    } else {
      duck(true)
    }
  }

  const handleTouchEnd = () => {
    duck(false)
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <button
        onClick={goBack}
        className="absolute -top-12 left-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>

      <div
        className="absolute -inset-1 rounded-xl transition-colors duration-300"
        style={{
          background: policeLightPhase === 0
            ? 'linear-gradient(90deg, rgba(255,0,0,0.5) 0%, transparent 50%, rgba(0,0,255,0.5) 100%)'
            : 'linear-gradient(90deg, rgba(0,0,255,0.5) 0%, transparent 50%, rgba(255,0,0,0.5) 100%)'
        }}
      />

      <div className="relative rounded-xl overflow-hidden border-2 border-primary/30 shadow-2xl bg-background">
        <canvas
          ref={canvasRef}
          width={560}
          height={320}
          className="w-full bg-background"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />

        <AnimatePresence>
          {gameState.showIntro && !gameState.isPlaying && !gameState.isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/95 flex flex-col items-center justify-center p-6"
            >
              <div
                className="absolute inset-0 transition-colors duration-300 pointer-events-none"
                style={{
                  background: policeLightPhase === 0
                    ? 'linear-gradient(180deg, rgba(255,0,0,0.1) 0%, transparent 50%)'
                    : 'linear-gradient(180deg, rgba(0,0,255,0.1) 0%, transparent 50%)'
                }}
              />

              <div className="relative z-10 text-center max-w-md">
                <h3 className="font-serif text-2xl text-primary mb-4">La Huida de Hyde</h3>
                <p className="text-xs text-muted-foreground/60 mb-4 uppercase tracking-wider">Londres, 1886 - Soho</p>

                <div className="bg-secondary/50 rounded-lg p-4 mb-6 border border-border/50">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    Eres Mr. Hyde, la manifestación oscura del Dr. Jekyll. Has cometido
                    un crimen terrible: asesinaste a Sir Danvers Carew con tu bastón
                    en una calle de Londres.
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    Ahora debes huir por los callejones oscuros del Soho victoriano,
                    evitando a los policías, faroles de gas y obstáculos mientras
                    la niebla de Londres te cubre.
                  </p>
                  <p className="text-primary/80 text-sm italic">
                    «El hombre no es verdaderamente uno, sino verdaderamente dos.»
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    — Robert Louis Stevenson, 1886
                  </p>
                </div>

                <div className="text-left text-sm text-muted-foreground mb-6 space-y-2">
                  <p><strong>Controles:</strong></p>
                  <p>• ESPACIO o flecha arriba = Saltar</p>
                  <p>• Flecha abajo = Agacharse</p>
                  <p>• En celular: toca arriba para saltar, abajo para agacharte</p>
                </div>

                <button
                  onClick={startGame}
                  style={{
                    padding: "16px 32px",
                    fontSize: "20px",
                    fontWeight: "bold",
                    backgroundColor: "#c1121f",
                    color: "white",
                    borderRadius: "10px",
                    cursor: "pointer",
                    border: "none",
                    marginTop: "20px"
                  }}
                >
                  ▶ START GAME
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {gameState.isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/95 flex flex-col items-center justify-center"
            >
              <div
                className="absolute inset-0 transition-colors duration-200 pointer-events-none"
                style={{
                  background: policeLightPhase === 0
                    ? 'linear-gradient(180deg, rgba(255,0,0,0.2) 0%, transparent 70%)'
                    : 'linear-gradient(180deg, rgba(0,0,255,0.2) 0%, transparent 70%)'
                }}
              />

              <div className="relative z-10 text-center">
                <div className="text-6xl mb-4">🎩</div>
                <h3 className="font-serif text-xl text-blood mb-2">¡Scotland Yard te atrapó!</h3>
                <p className="text-muted-foreground mb-2">
                  La policía de Londres encontró a la bestia del Soho.
                </p>
                <p className="text-xs text-muted-foreground/70 mb-2 italic">
                  «Fue como si el cadáver de un suicida hablara desde la tumba.»
                </p>
                <p className="text-primary text-2xl font-bold mb-4">
                  {gameState.score}m
                </p>
                {gameState.score >= gameState.highScore && gameState.score > 0 && (
                  <p className="text-primary text-sm mb-4">¡Nuevo récord!</p>
                )}
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Intentar de nuevo
                  </button>
                  <button
                    onClick={goBack}
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

      {gameState.isPlaying && (
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