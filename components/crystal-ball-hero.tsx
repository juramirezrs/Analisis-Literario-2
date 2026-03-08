"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, AlertTriangle, Volume2, VolumeX } from "lucide-react"

interface CrystalBallHeroProps {
  isRevealed: boolean
  onReveal: () => void
}

export function CrystalBallHero({ isRevealed, onReveal }: CrystalBallHeroProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [isShattered, setIsShattered] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isFlashing, setIsFlashing] = useState(false)
  const [flashCount, setFlashCount] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [audioStarted, setAudioStarted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Auto-play audio on mount
  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current && !audioStarted) {
        try {
          // Check if the audio can be played
          if (audioRef.current.readyState >= 2) {
            audioRef.current.volume = 1
            await audioRef.current.play()
            setAudioStarted(true)
          }
        } catch (error) {
          // Autoplay blocked or source not supported - will need user interaction
          console.log("Audio playback failed, waiting for user interaction")
        }
      }
    }
    
    // Wait for the audio to be ready before trying to play
    const audio = audioRef.current
    if (audio) {
      const handleCanPlay = () => {
        playAudio()
      }
      
      const handleError = () => {
        // Audio source not supported or failed to load - silently ignore
        console.log("Audio source not available")
      }
      
      audio.addEventListener('canplaythrough', handleCanPlay)
      audio.addEventListener('error', handleError)
      
      // If already ready, try to play
      if (audio.readyState >= 3) {
        playAudio()
      }

      // Also try on first user interaction
      const handleInteraction = () => {
        if (!audioStarted && audioRef.current && audioRef.current.readyState >= 2) {
          audioRef.current.play().catch(() => {})
          setAudioStarted(true)
        }
      }

      document.addEventListener('click', handleInteraction, { once: true })
      document.addEventListener('touchstart', handleInteraction, { once: true })

      return () => {
        audio.removeEventListener('canplaythrough', handleCanPlay)
        audio.removeEventListener('error', handleError)
        document.removeEventListener('click', handleInteraction)
        document.removeEventListener('touchstart', handleInteraction)
      }
    }
  }, [audioStarted])

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  // Play explosion/bomb sound using Web Audio API
  const playBombSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      
      // Create explosion sound
      const duration = 1.5
      const sampleRate = audioContext.sampleRate
      const buffer = audioContext.createBuffer(2, sampleRate * duration, sampleRate)
      
      for (let channel = 0; channel < 2; channel++) {
        const data = buffer.getChannelData(channel)
        for (let i = 0; i < buffer.length; i++) {
          const t = i / sampleRate
          // Explosion: white noise with exponential decay + low frequency rumble
          const noise = (Math.random() * 2 - 1) * Math.exp(-t * 3)
          const rumble = Math.sin(t * 50) * Math.exp(-t * 2) * 0.5
          const impact = Math.sin(t * 100) * Math.exp(-t * 8) * 0.8
          data[i] = (noise + rumble + impact) * 0.7
        }
      }
      
      const source = audioContext.createBufferSource()
      source.buffer = buffer
      
      // Add some distortion for more impact
      const gainNode = audioContext.createGain()
      gainNode.gain.setValueAtTime(1.5, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
      
      // Low pass filter for deeper boom
      const filter = audioContext.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(1000, audioContext.currentTime)
      filter.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + duration)
      
      source.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(audioContext.destination)
      source.start()
    } catch (error) {
      console.log("Could not play bomb sound")
    }
  }

  const handleMirrorClick = () => {
    if (!isRevealed && !showConfirmation) {
      setShowConfirmation(true)
    }
  }

  const handleConfirm = () => {
    setShowConfirmation(false)
    playBombSound()
    triggerFlashSequence()
  }

  const handleCancel = () => {
    setShowConfirmation(false)
  }

  const triggerFlashSequence = () => {
    setIsFlashing(true)
    setFlashCount(0)
    
    let count = 0
    const totalFlashes = 15
    const flashInterval = setInterval(() => {
      count++
      setFlashCount(count)
      
      if (count >= totalFlashes) {
        clearInterval(flashInterval)
        setIsFlashing(false)
        setIsShattered(true)
        
        setTimeout(() => {
          onReveal()
        }, 1500)
      }
    }, 100)
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 pt-20">
      {/* Audio Element - plays immediately */}
      <audio
        ref={audioRef}
        src="/audio/intro-narration.mp3"
        preload="auto"
      />

      {/* Mute/Unmute Button */}
      <motion.button
        onClick={toggleMute}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-card/80 border border-primary/30 backdrop-blur-sm hover:bg-card transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-primary" />
        ) : (
          <Volume2 className="w-5 h-5 text-primary" />
        )}
      </motion.button>

      {/* Flash Overlay */}
      <AnimatePresence>
        {isFlashing && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`flash-${flashCount}-${i}`}
                className="fixed inset-0 z-50 pointer-events-none"
                style={{
                  backgroundColor: i % 2 === 0 ? '#ffffff' : '#d4af37',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.1, delay: i * 0.02 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-md mx-4 p-8 bg-card border-2 border-primary/50 rounded-lg shadow-2xl shadow-primary/20"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <motion.div
                className="flex justify-center mb-6"
                animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <div className="p-4 rounded-full bg-primary/20 border border-primary/40">
                  <AlertTriangle className="w-12 h-12 text-primary" />
                </div>
              </motion.div>

              <h2 className="font-serif text-2xl md:text-3xl text-primary text-center mb-4">
                Advertencia del Oráculo
              </h2>
              <p className="text-muted-foreground text-center mb-2 text-lg">
                Estás a punto de mirar dentro del espejo...
              </p>
              <p className="text-foreground text-center mb-6 font-medium italic">
                ¿Estás seguro de que quieres conocer aquello que quizás no reconozcas en ti mismo?
              </p>
              <p className="text-muted-foreground/70 text-center text-sm mb-8">
                Una vez que el espejo se rompa, no hay vuelta atrás. La verdad sobre la identidad fragmentada será revelada.
              </p>

              <div className="flex gap-4 justify-center">
                <motion.button
                  onClick={handleCancel}
                  className="px-6 py-3 rounded-lg border border-muted-foreground/30 text-muted-foreground hover:bg-muted/50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Aún no estoy listo
                </motion.button>
                <motion.button
                  onClick={handleConfirm}
                  className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(212, 175, 55, 0.3)",
                      "0 0 40px rgba(212, 175, 55, 0.6)",
                      "0 0 20px rgba(212, 175, 55, 0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Revelar mi destino
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isShattered ? (
          <motion.div
            key="mirror"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-8"
          >
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-center"
            >
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-primary mb-4 tracking-wide">
                El Oráculo de los Espejos
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground italic">
                Un viaje por la identidad perdida
              </p>
            </motion.div>

            {/* Introduction Text - ABOVE the mirror */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="max-w-2xl text-center"
            >
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                Cada día, miles de personas se miran al espejo y no se reconocen. 
                La rutina, la venganza, el miedo, la opresión... nos fragmentan. 
                Nosotros, <span className="text-primary font-semibold">Juan Esteban</span>, <span className="text-primary font-semibold">Valerie</span> y <span className="text-primary font-semibold">Santiago</span>, 
                nos preguntamos: <em className="text-foreground">¿dónde queda la dignidad en esos pedazos rotos?</em>
              </p>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mt-4">
                Te invitamos a un ritual. Pasa, siéntate frente al espejo y descubre, 
                a través de estas tres obras, si el reflejo que ves es realmente el tuyo.
              </p>
            </motion.div>

            {/* Ornate Mirror */}
            <motion.div
              className="relative cursor-pointer group mt-4"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={handleMirrorClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Mirror Glow */}
              <motion.div
                className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"
                animate={{
                  scale: isHovering ? 1.3 : 1.1,
                  opacity: isHovering ? 0.6 : 0.3,
                }}
                transition={{ duration: 0.5 }}
              />

              {/* Ornate Mirror Frame */}
              <div className="relative">
                {/* Outer decorative frame */}
                <div className="absolute -inset-4 md:-inset-6 border-4 border-primary/60 rounded-[40%_40%_35%_35%] shadow-lg shadow-primary/20" />
                <div className="absolute -inset-2 md:-inset-3 border-2 border-primary/40 rounded-[38%_38%_33%_33%]" />
                
                {/* Top ornament */}
                <div className="absolute -top-12 md:-top-16 left-1/2 -translate-x-1/2 z-10">
                  <svg width="80" height="50" viewBox="0 0 80 50" className="text-primary">
                    <path
                      d="M40 5 C20 5 10 20 10 30 C10 35 15 40 20 40 L25 35 C25 35 30 45 40 45 C50 45 55 35 55 35 L60 40 C65 40 70 35 70 30 C70 20 60 5 40 5Z"
                      fill="currentColor"
                      opacity="0.8"
                    />
                    <circle cx="40" cy="20" r="8" fill="currentColor" opacity="0.6" />
                  </svg>
                </div>

                {/* Mirror surface */}
                <div className="relative w-44 h-56 md:w-56 md:h-72 lg:w-64 lg:h-80 rounded-[35%_35%_30%_30%] overflow-hidden border-4 border-primary/70 bg-gradient-to-b from-slate-300/20 via-slate-400/30 to-slate-500/20">
                  {/* Mirror reflection effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />
                  
                  {/* Mysterious fog/mist in mirror */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-primary/5"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* Shadowy figure silhouette */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-24 h-40 md:w-32 md:h-52 bg-gradient-to-b from-black/30 via-black/20 to-transparent rounded-full blur-md" />
                  </motion.div>

                  {/* Glowing center */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/30 blur-xl"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* Question mark or eye symbol */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/40 font-serif text-6xl md:text-7xl"
                    animate={{
                      opacity: [0.2, 0.5, 0.2],
                      scale: [0.9, 1.1, 0.9],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ?
                  </motion.div>

                  {/* Crack lines hint */}
                  <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                    <motion.path
                      d="M50% 30% L48% 50% L52% 70%"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      fill="none"
                      className="text-primary"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: isHovering ? 1 : 0, opacity: isHovering ? 0.5 : 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  </svg>
                </div>

                {/* Side ornaments */}
                <div className="absolute top-1/4 -left-6 md:-left-8 w-4 h-20 md:w-5 md:h-24 bg-primary/60 rounded-full" />
                <div className="absolute top-1/4 -right-6 md:-right-8 w-4 h-20 md:w-5 md:h-24 bg-primary/60 rounded-full" />
                
                {/* Bottom ornament */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-6 md:w-24 md:h-8 bg-primary/50 rounded-full" />
              </div>

              {/* Click Prompt */}
              <motion.div
                className="absolute -bottom-20 md:-bottom-24 left-1/2 -translate-x-1/2 text-center"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  y: [0, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-primary text-sm md:text-base whitespace-nowrap">
                  Toca el espejo para revelar tu destino
                </p>
              </motion.div>
            </motion.div>

            {/* School Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-20 text-center"
            >
              <p className="text-xs text-muted-foreground/60 uppercase tracking-widest">
                Colegio Real Royal School
              </p>
              <p className="text-xs text-muted-foreground/40 mt-1">
                Área de Humanidades y Lengua Castellana - Décimo Grado
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="shattered"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6 pt-10 min-h-screen"
          >
            {/* Broken IDENTIDAD Title */}
            <motion.div
              className="relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center items-center">
                {"IDENTIDAD".split("").map((letter, i) => (
                  <motion.span
                    key={i}
                    className="font-serif text-6xl md:text-8xl lg:text-9xl text-primary inline-block"
                    initial={{ 
                      opacity: 0, 
                      y: -100,
                      rotate: Math.random() * 40 - 20,
                    }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      rotate: (i % 2 === 0 ? 1 : -1) * (Math.random() * 8 + 2),
                      x: (i - 4) * (Math.random() * 4),
                    }}
                    transition={{ 
                      duration: 0.8, 
                      delay: i * 0.08,
                      type: "spring",
                      stiffness: 100,
                    }}
                    style={{
                      textShadow: "0 0 30px rgba(212, 175, 55, 0.5)",
                      filter: `brightness(${0.8 + Math.random() * 0.4})`,
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
              
              {/* Crack lines overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 120">
                <motion.path
                  d="M200 0 L195 40 L180 60 L200 80 L190 120"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                  className="text-primary/40"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
                <motion.path
                  d="M200 40 L220 50 L250 45"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                  className="text-primary/30"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                />
                <motion.path
                  d="M195 40 L160 55 L140 50"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                  className="text-primary/30"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 1.1 }}
                />
              </svg>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="text-lg md:text-xl text-muted-foreground italic text-center"
            >
              El espejo se ha roto... la verdad emerge
            </motion.p>

            {/* Team Photo */}
            <motion.div
              className="relative mt-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <Image
                src="/images/team-mirror.png"
                alt="El equipo del Oráculo - Juan Esteban, Valerie y Santiago"
                width={500}
                height={750}
                className="object-contain rounded-lg max-h-[70vh] w-auto shadow-2xl shadow-primary/20"
              />
              
              {/* Shatter Animation Overlay */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-primary/20"
                  style={{
                    width: `${Math.random() * 30 + 20}%`,
                    height: `${Math.random() * 30 + 20}%`,
                    left: `${Math.random() * 70}%`,
                    top: `${Math.random() * 70}%`,
                    clipPath: `polygon(${Math.random() * 50}% 0%, 100% ${Math.random() * 50}%, ${Math.random() * 50 + 50}% 100%, 0% ${Math.random() * 50 + 50}%)`,
                  }}
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{
                    opacity: 0,
                    scale: 2,
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200,
                    rotate: Math.random() * 360,
                  }}
                  transition={{ duration: 1.5, delay: 1.5 + i * 0.05 }}
                />
              ))}
            </motion.div>

            {/* Scroll Down Arrow */}
            <motion.div
              className="flex flex-col items-center gap-2 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              <motion.p
                className="text-sm text-muted-foreground"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Desplaza hacia abajo para continuar
              </motion.p>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="w-8 h-8 text-primary" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              >
                <ChevronDown className="w-8 h-8 text-primary/60 -mt-4" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
