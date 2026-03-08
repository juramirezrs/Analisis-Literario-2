"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Navigation } from "@/components/navigation"
import { CrystalBallHero } from "@/components/crystal-ball-hero"
import { TarotSection } from "@/components/tarot-section"
import { TribunalSection } from "@/components/tribunal-section"
import { CreativeSection } from "@/components/creative-section"
import { MultimediaSection } from "@/components/multimedia-section"
import { ConclusionSection } from "@/components/conclusion-section"
import { CreditsSection } from "@/components/credits-section"
import { ParticleBackground } from "@/components/particle-background"

export default function OracleOfMirrors() {
  const [isRevealed, setIsRevealed] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [dignityAnswer, setDignityAnswer] = useState<"yes" | "no" | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
  if (typeof window !== "undefined") {
    setIsMobile(window.innerWidth < 900)
  }
}, [])

  const triggerConfetti = useCallback(() => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: ReturnType<typeof setInterval> = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)
  }, [])

  const handleDignityAnswer = (answer: "yes" | "no") => {
    setDignityAnswer(answer)
    if (answer === "yes") {
      setShowConfetti(true)
      triggerConfetti()
    } else {
      // Scroll back to top
      window.scrollTo({ top: 0, behavior: "smooth" })
      setTimeout(() => {
        setDignityAnswer(null)
      }, 1000)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "obra-erendira", "obra-montecristo", "obra-jekyll", "tribunal", "creativo", "multimedia", "conclusion", "creditos"]
      const scrollPosition = window.scrollY + window.innerHeight / 3

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {isMobile && (
  <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-3 z-[9999]">
    ⚠️ Esta experiencia fue diseñada para computador. Algunas funciones pueden no funcionar bien en celular.
  </div>
)}
      <ParticleBackground />
      
      <Navigation activeSection={activeSection} isRevealed={isRevealed} />
      
      <main>
        {/* HOME - Crystal Ball Section */}
        <section id="home" className="min-h-screen flex items-center justify-center relative">
          <CrystalBallHero isRevealed={isRevealed} onReveal={() => setIsRevealed(true)} />
        </section>

        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {/* OBRAS - Each with their own section ID handled by TarotSection */}
              <div className="py-24 px-4">
                <TarotSection />
              </div>

{/* ANALISIS COMPARATIVO + TRIBUNAL (EXTRA) */}
              <section id="tribunal" className="py-24 px-4 bg-secondary/30">
                <TribunalSection />
              </section>

              {/* CREATIVE SECTION */}
              <section id="creativo" className="py-24 px-4">
                <CreativeSection />
              </section>

              {/* MULTIMEDIA */}
              <section id="multimedia" className="py-24 px-4 bg-secondary/30">
                <MultimediaSection />
              </section>

              {/* CONCLUSION */}
              <section id="conclusion" className="py-24 px-4">
                <ConclusionSection />
              </section>

              {/* CREDITS */}
              <section id="creditos" className="py-24 px-4 bg-secondary/30">
                <CreditsSection />
              </section>

              {/* DIGNITY QUESTION SECTION */}
              <section className="py-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background pointer-events-none" />
                
                <AnimatePresence mode="wait">
                  {!dignityAnswer ? (
                    <motion.div
                      key="question"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      className="max-w-3xl mx-auto text-center relative z-10"
                    >
                      {/* Mirror icon */}
                      <motion.div 
                        className="w-24 h-32 mx-auto mb-8 relative"
                        animate={{ 
                          boxShadow: [
                            "0 0 20px rgba(212, 175, 55, 0.3)",
                            "0 0 40px rgba(212, 175, 55, 0.6)",
                            "0 0 20px rgba(212, 175, 55, 0.3)",
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="w-full h-full rounded-t-full bg-gradient-to-b from-slate-300/40 via-slate-400/30 to-slate-500/20 border-4 border-primary/60" />
                        <motion.div
                          className="absolute inset-4 rounded-t-full bg-gradient-to-br from-white/20 via-transparent to-black/20"
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                      </motion.div>
                      
                      <h2 className="font-serif text-3xl md:text-5xl text-primary mb-6">
                        Una última pregunta...
                      </h2>
                      
                    <p className="text-xl text-muted-foreground mb-4 leading-relaxed">
  Al inicio te preguntamos: <em className="text-foreground">«¿dónde queda la dignidad en esos pedazos rotos?»</em>
</p>
                      
                      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                        Después de explorar estas tres obras y sus reflejos...
                      </p>

                      <motion.p 
                        className="font-serif text-2xl md:text-3xl text-primary mb-12"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ¿Encontraste la dignidad en el espejo?
                      </motion.p>

                      <div className="flex flex-wrap justify-center gap-6">
                        <motion.button
                          onClick={() => handleDignityAnswer("yes")}
                          className="px-10 py-5 bg-primary text-primary-foreground font-serif text-xl rounded-2xl border-2 border-primary/80 shadow-lg shadow-primary/20"
                          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212, 175, 55, 0.5)" }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Sí, la encontré
                        </motion.button>
                        <motion.button
                          onClick={() => handleDignityAnswer("no")}
                          className="px-10 py-5 bg-secondary text-foreground font-serif text-xl rounded-2xl border-2 border-border"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Aún no...
                        </motion.button>
                      </div>

                      <p className="mt-8 text-sm text-muted-foreground italic">
                        (Si aún no la encuentras, el viaje continúa desde el principio)
                      </p>
                    </motion.div>
                  ) : dignityAnswer === "yes" ? (
                    <motion.div
                      key="celebration"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="max-w-3xl mx-auto text-center relative z-10"
                    >
                      <motion.div 
                        className="text-8xl mb-8"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{ duration: 1, repeat: 3 }}
                      >
                        ✨
                      </motion.div>
                      
                      <h2 className="font-serif text-4xl md:text-6xl text-primary mb-6">
                        ¡Felicidades!
                      </h2>
                      
                      <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                        Has completado el viaje por los espejos. La dignidad no está afuera, 
                        sino en cómo elegimos enfrentar nuestros reflejos rotos.
                      </p>

                      <div className="flex flex-wrap justify-center gap-4 mb-12">
                        <motion.div 
                          className="px-6 py-3 bg-blood/20 rounded-full border border-blood/40"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <span className="text-blood font-medium">La Cándida Eréndira</span>
                        </motion.div>
                        <motion.div 
                          className="px-6 py-3 bg-ocean/20 rounded-full border border-ocean/40"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <span className="text-ocean font-medium">El Conde de Montecristo</span>
                        </motion.div>
                        <motion.div 
                          className="px-6 py-3 bg-mystic/20 rounded-full border border-mystic/40"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <span className="text-mystic font-medium">Dr. Jekyll y Mr. Hyde</span>
                        </motion.div>
                      </div>

                      <motion.div
                        className="inline-flex items-center gap-3 px-8 py-4 bg-primary/10 rounded-2xl border border-primary/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        <span className="text-2xl">&#9733;</span>
                        <span className="text-primary font-serif text-lg">
                          &ldquo;Esperar y tener esperanza&rdquo;
                        </span>
                        <span className="text-2xl">&#9733;</span>
                      </motion.div>

                      <p className="mt-8 text-sm text-muted-foreground">
                        Gracias por explorar con nosotros &bull; Proyecto de Lengua y Literatura &bull; 2026
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
