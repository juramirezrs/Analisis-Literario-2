"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { Feather, Flame, Footprints, Scroll, X, ChevronRight, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"
import { HydeRunnerGame } from "./hyde-runner-game"
import Image from "next/image"

const creativePieces = [
  {
    id: "candelabro",
    obra: "La Cándida Eréndira",
    title: "El Objeto Testigo",
    subtitle: "El Testimonio del Candelabro",
    icon: Flame,
    color: "blood",
    image: "/images/symbolic-erendira.jpg",
    description: "Video dramatizado desde la perspectiva de la vela que Eréndira dejó encendida.",
    hasVideo: true,
    creativeNote: "Decidimos caracterizar la perspectiva de la vela porque es el objeto que desencadena toda la tragedia. La vela representa la inocencia de Eréndira y cómo un simple descuido por agotamiento cambió su destino para siempre.",
  },
  {
    id: "hyde-runner",
    obra: "Dr. Jekyll y Mr. Hyde",
    title: "La Huida de Hyde",
    subtitle: "Juego de Escape",
    icon: Footprints,
    color: "mystic",
    image: "/images/hyde-runner-sprite.jpg",
    description: "Corre por las calles de Londres victoriano como Mr. Hyde, escapando de la policía.",
    audioSrc: "/audio/juego hyde.opus",
    isRunnerGame: true,
    creativeNote: "Creamos un juego interactivo para representar de forma visual y didáctica la huida constante de Hyde por las calles de Londres, permitiendo experimentar la tensión y desesperación del personaje.",
  },
  {
    id: "testamento",
    obra: "El Conde de Montecristo",
    title: "El Testamento del Conde",
    subtitle: "Documento Ficticio",
    icon: Scroll,
    color: "ocean",
    image: "/images/symbolic-montecristo.jpg",
    description: "El testamento final del Conde de Montecristo, escrito después de completar su venganza.",
    audioSrc: "/audio/testamento conde.opus",
    creativeNote: "Decidimos crear un testamento ficticio del Conde porque este documento nunca fue mostrado en la obra. Representa la reflexión final de Edmond Dantès sobre su vida, su venganza y lo que realmente aprendió.",
    content: `TESTAMENTO Y ÚLTIMA VOLUNTAD
Del Conde de Montecristo

París, año de 1838

Yo, quien una vez fui Edmond Dantés, marinero de Marsella, escribo estas palabras no como despedida, sino como confesión.

Durante catorce años, el Castillo de If me robó todo: mi juventud, mi amor, mi nombre. Pero también me dio algo: tiempo. Tiempo para aprender, para planear, para convertirme en alguien que pudiera hacer justicia.

Encontré el tesoro del Abbé Faria y me convertí en el Conde de Montecristo. Con esa fortuna, destruí a mis enemigos uno por uno:

A Danglars, le quité su dinero, porque su ambición fue lo que me condenó.
A Fernand, le quité su honor, porque sus celos me robaron a Mercedes.
A Villefort, le quité su familia, porque su corrupción me encerró.

Pero ahora que todo ha terminado, miro al espejo y no reconozco al hombre que me devuelve la mirada.

¿Valió la pena?

Mercedes tiene razón. El Edmond que ella amaba murió en prisión. El Conde que salió de esas aguas frías es otra persona. Una persona que pasó veinte años viviendo solo para destruir.

Por eso, dejo mis bienes a quienes merecen una segunda oportunidad:

A Maximilian y Valentine, les dejo la isla de Montecristo y la mitad de mi fortuna. Que construyan la felicidad que yo nunca pude tener.

A Haydée, quien me amó sin pedir nada, le dejo mi gratitud eterna y la libertad de elegir su propio destino.

Y a quien lea esto, le dejo esta advertencia:la venganza es un plato que se sirve frío... pero quien lo cocina termina quemándose las manos.

«Esperar y tener esperanza» — esas fueron las últimas palabras del Abbé. Ojalá las hubiera entendido antes.

Firmado
El Conde de Montecristo
(Edmond Dantés, el que fue y ya no es)`,
  },
]

export function CreativeSection() {
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null)
  const [showRunnerGame, setShowRunnerGame] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const gameAudioRef = useRef<HTMLAudioElement | null>(null)
  const tenseMusicRef = useRef<HTMLAudioElement | null>(null)

  const selectedContent = creativePieces.find(p => p.id === selectedPiece)

  // Play audio when testament modal opens
  useEffect(() => {
    if (selectedPiece === "testamento" && selectedContent?.audioSrc) {
      const audio = new Audio()
      audioRef.current = audio
      
      const handleCanPlay = () => {
        audio.play().catch(() => {
          // Audio playback failed - silently ignore
        })
        setIsPlaying(true)
      }
      
      const handleError = () => {
        // Audio source not supported or failed to load - silently ignore
        setIsPlaying(false)
      }
      
      audio.addEventListener('canplaythrough', handleCanPlay, { once: true })
      audio.addEventListener('error', handleError, { once: true })
      audio.onended = () => setIsPlaying(false)
      audio.src = selectedContent.audioSrc
      audio.load()
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
        setIsPlaying(false)
      }
    }
  }, [selectedPiece, selectedContent?.audioSrc])

  // Play audio when game modal opens - first play intro audio, then tense music at low volume
  useEffect(() => {
    if (showRunnerGame) {
      const audio = new Audio()
      gameAudioRef.current = audio
      
      const handleCanPlay = () => {
        audio.play().catch(() => {
          // Audio playback failed - silently ignore
        })
      }
      
      const handleError = () => {
        // Audio source not supported or failed to load - silently ignore
      }
      
      // When first audio ends, start the background tense music at low volume
      audio.onended = () => {
        const tenseMusic = new Audio()
        tenseMusicRef.current = tenseMusic
        tenseMusic.src = "/audio/tense.mp3"
        tenseMusic.volume = 0.3 // Low volume
        tenseMusic.loop = true
        tenseMusic.play().catch(() => {
          // Silently ignore
        })
      }
      
      audio.addEventListener('canplaythrough', handleCanPlay, { once: true })
      audio.addEventListener('error', handleError, { once: true })
      audio.src = "/audio/juego hyde.opus"
      audio.load()
    }
    
    return () => {
      if (gameAudioRef.current) {
        gameAudioRef.current.pause()
        gameAudioRef.current = null
      }
      if (tenseMusicRef.current) {
        tenseMusicRef.current.pause()
        tenseMusicRef.current = null
      }
    }
  }, [showRunnerGame])

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Feather className="w-8 h-8 text-primary" />
          <h2 className="font-serif text-3xl md:text-5xl text-primary">
            Sección Creativa
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Tres obras, tres creaciones originales.
        </p>
      </motion.div>

      {/* Creative Pieces Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {creativePieces.map((piece, index) => {
          const Icon = piece.icon
          const colorClasses = {
            blood: "border-blood hover:border-blood/80 bg-gradient-to-br from-blood/10 to-blood/5",
            mystic: "border-mystic hover:border-mystic/80 bg-gradient-to-br from-mystic/10 to-mystic/5",
            ocean: "border-ocean hover:border-ocean/80 bg-gradient-to-br from-ocean/10 to-ocean/5",
          }
          const iconBgClasses = {
            blood: "bg-blood/20 text-blood",
            mystic: "bg-mystic/20 text-mystic",
            ocean: "bg-ocean/20 text-ocean",
          }
          const textClasses = {
            blood: "text-blood",
            mystic: "text-mystic",
            ocean: "text-ocean",
          }

          return (
            <motion.div
              key={piece.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              onClick={() => {
                if (piece.isRunnerGame) {
                  setShowRunnerGame(true)
                } else {
                  setSelectedPiece(piece.id)
                }
              }}
              className={cn(
                "cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300",
                "hover:shadow-xl hover:-translate-y-2",
                colorClasses[piece.color as keyof typeof colorClasses]
              )}
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={piece.image}
                  alt={piece.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                {/* Imagen IA Label */}
                <div className="absolute top-2 right-2 z-10">
                  <span className="text-xs bg-primary/80 text-primary-foreground px-2 py-1 rounded-full">
                    Imagen IA
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col">
                {/* Icon */}
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mb-4 -mt-12 relative z-10 border-2 border-background",
                  iconBgClasses[piece.color as keyof typeof iconBgClasses]
                )}>
                  <Icon className="w-7 h-7" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    {piece.obra}
                  </p>
                  <h3 className={cn(
                    "font-serif text-2xl mb-2",
                    textClasses[piece.color as keyof typeof textClasses]
                  )}>
                    {piece.title}
                  </h3>
                  <p className="text-sm text-primary/80 italic mb-4">
                    {piece.subtitle}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {piece.description}
                  </p>
                  {piece.creativeNote && (
                    <p className="text-xs text-primary/70 italic border-t border-border/30 pt-3">
                      {piece.creativeNote.substring(0, 100)}...
                    </p>
                  )}
                </div>

                {/* Action */}
                <div className={cn(
                  "mt-6 flex items-center justify-between pt-4 border-t border-border/30",
                  textClasses[piece.color as keyof typeof textClasses]
                )}>
                  <span className="text-sm font-medium flex items-center gap-2">
                    {piece.isRunnerGame ? "Jugar ahora" : "Leer más"}
                    {piece.audioSrc && <Volume2 className="w-4 h-4" />}
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Modal for Reading */}
      <AnimatePresence>
        {selectedPiece && selectedContent && !selectedContent.isRunnerGame && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50"
              onClick={() => setSelectedPiece(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-hidden rounded-2xl bg-card border border-border shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPiece(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Audio Control */}
              {selectedContent.audioSrc && (
                <button
                  onClick={toggleAudio}
                  className="absolute top-4 right-16 z-10 p-2 rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
                >
                  {isPlaying ? (
                    <Volume2 className="w-5 h-5 text-primary" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-primary" />
                  )}
                </button>
              )}

              <div className="h-full overflow-y-auto p-6 md:p-8">
                {/* Header */}
                <div className="mb-8 text-center">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                    {selectedContent.obra}
                  </p>
                  <h3 className="font-serif text-3xl md:text-4xl text-primary mb-2">
                    {selectedContent.title}
                  </h3>
                  <p className="text-lg text-muted-foreground italic">
                    {selectedContent.subtitle}
                  </p>
                  {selectedContent.audioSrc && (
                    <p className="text-sm text-primary mt-2 flex items-center justify-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      Audio reproduciéndose automáticamente
                    </p>
                  )}
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto">
                  {/* Video Section for Candelabro - Large, with sound */}
                  {selectedContent.id === "candelabro" && (
                    <div className="flex flex-col items-center">
                      {/* Creative Note */}
                      <div className="mb-6 p-4 bg-blood/10 border border-blood/30 rounded-xl max-w-xl">
                        <p className="text-sm text-blood/90 italic text-center">
                          {selectedContent.creativeNote}
                        </p>
                      </div>
                      
                      {/* Large Video */}
                      <div className="relative w-full max-w-lg aspect-[9/16] rounded-2xl overflow-hidden border-4 border-blood/40 shadow-2xl bg-black">
                        <video
                          ref={(el) => {
                            if (el) {
                              el.volume = 1.0
                            }
                          }}
                          src="/video/video_vela.mp4"
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          playsInline
                          controls
                        />
                      </div>
                      <p className="mt-4 text-sm text-muted-foreground text-center">
                        Sube el volumen de tu dispositivo para una mejor experiencia
                      </p>
                    </div>
                  )}

                  {/* Testament Content */}
                  {selectedContent.id === "testamento" && (
                    <>
                      {/* Creative Note */}
                      <div className="mb-6 p-4 bg-ocean/10 border border-ocean/30 rounded-xl max-w-xl mx-auto">
                        <p className="text-sm text-ocean/90 italic text-center">
                          {selectedContent.creativeNote}
                        </p>
                      </div>
                      
                      <div className="bg-[#d4c4a0] border-[#8b7355]/70 shadow-2xl relative overflow-hidden rounded-xl p-6 md:p-8">
                        {/* Paper texture noise */}
                        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        }} />
                        {/* Aged stains */}
                        <div className="absolute top-10 left-10 w-32 h-32 bg-[#b8a080] rounded-full opacity-20 blur-xl pointer-events-none" />
                        <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#a08060] rounded-full opacity-15 blur-2xl pointer-events-none" />
                        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#c0a070] rounded-full opacity-10 blur-lg pointer-events-none" />
                        {/* Burned/aged edges */}
                        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-[#b8a080] to-transparent pointer-events-none opacity-60" />
                        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#b8a080] to-transparent pointer-events-none opacity-60" />
                        <div className="absolute top-0 left-0 h-full w-10 bg-gradient-to-r from-[#a89070] to-transparent pointer-events-none opacity-50" />
                        <div className="absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-[#a89070] to-transparent pointer-events-none opacity-50" />
                        {/* Coffee/water stain effect */}
                        <div className="absolute top-1/4 right-1/4 w-20 h-20 rounded-full border-2 border-[#8b6914] opacity-10 pointer-events-none" />
                        {/* Fold lines */}
                        <div className="absolute top-1/3 left-0 right-0 h-px bg-[#8b7355] opacity-20 pointer-events-none" />
                        <div className="absolute top-2/3 left-0 right-0 h-px bg-[#8b7355] opacity-15 pointer-events-none" />
                        
                        <pre className="whitespace-pre-wrap leading-relaxed relative z-10 font-serif text-[#2d1a0a] text-base md:text-lg drop-shadow-sm" style={{ fontFamily: "'Lora', serif", textShadow: '0 1px 1px rgba(139, 115, 85, 0.1)' }}>
                          {selectedContent.content}
                        </pre>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

  {/* Hyde Runner Game Modal */}
<AnimatePresence>
  {showRunnerGame && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50"
        onClick={() => setShowRunnerGame(false)}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-auto rounded-2xl bg-card border border-border shadow-2xl p-6"
      >
      {/* Close Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowRunnerGame(false)}
          className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
          Dr. Jekyll y Mr. Hyde
        </p>
        <h3 className="font-serif text-3xl md:text-4xl text-primary mb-2">
          La Huida de Hyde
        </h3>
        <p className="text-lg text-muted-foreground italic mb-4">
          Juego de Escape
        </p>
        <div className="max-w-xl mx-auto p-4 bg-mystic/10 border border-mystic/30 rounded-xl">
          <p className="text-sm text-mystic/90 italic">
            Creamos un juego interactivo para representar de forma visual y didáctica la huida constante de Hyde por las calles de Londres, permitiendo experimentar la tensión y desesperación del personaje.
          </p>
        </div>
      </div>

      {/* Game */}
      <div className="max-w-4xl mx-auto">
        <HydeRunnerGame onClose={() => setShowRunnerGame(false)} />
      </div>

      {/* Post-it Note */}
      <div className="max-w-xl mx-auto mt-8">
        <div className="relative bg-yellow-200 p-5 shadow-lg transform rotate-1" style={{ 
          backgroundImage: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          boxShadow: '2px 2px 10px rgba(0,0,0,0.2)'
        }}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-amber-100/80 opacity-70" />
          
          <p className="text-amber-900 text-sm font-medium mb-2">Nota sobre el libro:</p>
          <p className="text-amber-800 text-sm leading-relaxed">
            En la novela original, Mr. Hyde no es perseguido visualmente por la policía como en este juego. 
            Después de asesinar a Sir Danvers Carew, Hyde desaparece completamente. La policía lo busca 
            por toda Londres, pero nunca logran encontrarlo. 
          </p>
          <p className="text-amber-700 text-xs mt-3 italic">
            — Este juego es una interpretación creativa para representar la desesperación del personaje.
          </p>
        </div>
      </div>
          </motion.div>
      </>
    )}
</AnimatePresence>

    </div>
  )
}
