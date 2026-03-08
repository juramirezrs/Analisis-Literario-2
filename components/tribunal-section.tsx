"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Scale, UserCheck, UserX, Gavel } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useEffect, useState } from "react"

type VoteType = "inocente" | "neutral" | "culpable" | null

interface CharacterVotes {
  montecristo: VoteType
  jekyll: VoteType
  abuela: VoteType
}

const criticasSociales = [
  {
    obra: "La Cándida Eréndira",
    color: "blood",
    image: "/images/critica-erendira.jpg",
    critica: "Critica el abuso y explotación de la joven. También es una metáfora de la deuda externa latinoamericana: deudas impagables que perpetúan ciclos de explotación y dependencia económica.",
  },
  {
    obra: "El Conde de Montecristo",
    color: "ocean",
    image: "/images/critica-montecristo.jpg",
    critica: "Critica la corrupción y la injusticia dentro del sistema judicial, mostrando cómo la envidia y el abuso de poder pueden perjudicar a alguien inocente. También critica la desigualdad social, mostrando que las personas con influencia o dinero evitan sus consecuencias.",
  },
  {
    obra: "Dr. Jekyll y Mr. Hyde",
    color: "mystic",
    image: "/images/critica-jekyll.jpg",
    critica: "Critica la hipocresía de la sociedad victoriana. Se puede ver cómo Jekyll, por mantener una buena imagen, reprime sus pensamientos. La sociedad es estricta con sus comportamientos morales y esto causa conflictos internos y actos peligrosos.",
  },
]

const comparacionProtagonistas = {
  enComun: [
    "Todos sufren un evento que cambia completamente su vida.",
    "Sus historias muestran una transformación profunda de identidad.",
    "Cada uno enfrenta el sufrimiento de una manera distinta.",
    "Sus historias exploran cómo las personas reaccionan ante la injusticia o el dolor.",
  ],
  diferencias: [
    { personaje: "Edmond Dantès", diferencia: "Enfrenta el dolor con venganza, castigar a quienes lo traicionaron." },
    { personaje: "Dr. Jekyll", diferencia: "Enfrenta su conflicto intentando separar el bien y el mal dentro de sí mismo, lo que termina creando una identidad dividida [alter ego]." },
    { personaje: "Eréndira", diferencia: "Resiste al sufrimiento. Ella no quería vengarse, ni dominar a nadie, solo sobrevivir y recuperar su libertad." },
  ],
  soloEdmond: {
    puntos: [
      "Su transformación nace de una traición injusta y años de prisión.",
      "Decide tomar la justicia en sus propias manos.",
      "Reconstruye su identidad completamente convirtiéndose en el Conde de Montecristo.",
    ],
    cita: "«Toda la sabiduría humana se encierra en estas dos palabras: esperar y confiar.»",
    citaAutor: "Alexandre Dumas, El Conde de Montecristo",
    citaExplicacion: "Esta frase es clave porque muestra que después de todo su sufrimiento, Dantès entiende que la vida no solo trata de venganza sino también de esperanza y paciencia.",
  },
  soloJekyll: {
    puntos: [
      "Su conflicto es interno, no causado por otras personas.",
      "Intenta separar científicamente el bien y el mal dentro del ser humano.",
      "Su identidad termina dividida entre dos personalidades.",
    ],
    cita: "«El hombre no es verdaderamente uno, sino verdaderamente dos.»",
    citaAutor: "Robert Louis Stevenson, Dr. Jekyll and Mr. Hyde",
    citaExplicacion: "Esta frase resume el tema central de la novela: la dualidad humana, la idea de que todos tenemos una parte buena y otra oscura.",
  },
  soloErendira: {
    puntos: [
      "Su transformación nace del abuso y la explotación que sufre.",
      "A diferencia de los otros protagonistas, no busca venganza ni poder.",
      "Su historia muestra resistencia y supervivencia.",
    ],
    cita: "«Eréndira estaba bañando a la abuela cuando empezó el viento de su desgracia.»",
    citaAutor: "Gabriel García Márquez, La increíble y triste historia de la cándida Eréndira",
    citaExplicacion: "Esta frase marca el momento en que comienza toda su tragedia, simbolizando cómo su vida cambia de forma irreversible.",
  },
  tabla: [
    { aspecto: "Tipo de conflicto", edmond: "Externo (contra quienes lo traicionaron)", jekyll: "Interno (contra su propia naturaleza)", erendira: "Social y personal" },
    { aspecto: "Cómo cambia", edmond: "Crea una nueva identidad", jekyll: "Divide su identidad", erendira: "Resiste y sobrevive" },
    { aspecto: "Respuesta al sufrimiento", edmond: "Venganza y justicia", jekyll: "Experimento científico que sale mal", erendira: "Resistencia y deseo de libertad" },
    { aspecto: "Tema principal", edmond: "Justicia y venganza", jekyll: "Dualidad humana", erendira: "Abuso y supervivencia" },
  ],
}

// Generate random positions for identity words - now with MORE words and variations
const generateIdentityWords = () => {
  const words = []
  const variations = ["IDENTIDAD", "identidad", "Identidad", "IDENTIDAD", "IDENTITY"]
  for (let i = 0; i < 60; i++) {
    words.push({
      id: i,
      text: variations[Math.floor(Math.random() * variations.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 3,
      duration: Math.random() * 4 + 2,
      rotation: Math.random() * 60 - 30,
    })
  }
  return words
}

export function TribunalSection() {
  const [identityWords, setIdentityWords] = useState<ReturnType<typeof generateIdentityWords>>([])
  const [votes, setVotes] = useState<CharacterVotes>({
    montecristo: null,
    jekyll: null,
    abuela: null,
  })
  const [showCasoCerrado, setShowCasoCerrado] = useState(false)

  // Check if all votes are in
  const allVotesIn = votes.montecristo && votes.jekyll && votes.abuela

  useEffect(() => {
    setIdentityWords(generateIdentityWords())
  }, [])

  const handleVote = (character: keyof CharacterVotes, vote: VoteType) => {
    setVotes(prev => {
      const newVotes = {
        ...prev,
        [character]: prev[character] === vote ? null : vote,
      }
      // Check if all votes are now in and trigger animation
      if (newVotes.montecristo && newVotes.jekyll && newVotes.abuela && !showCasoCerrado) {
        setShowCasoCerrado(true)
        // Hide after 3 seconds
        setTimeout(() => setShowCasoCerrado(false), 3000)
      }
      return newVotes
    })
  }

  const getVoteButtonClass = (character: keyof CharacterVotes, vote: VoteType) => {
    const isSelected = votes[character] === vote
    const baseClass = "px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
    if (vote === "inocente") {
      return cn(baseClass, isSelected ? "bg-green-500 text-white" : "bg-green-500/20 text-green-400 hover:bg-green-500/30")
    }
    if (vote === "neutral") {
      return cn(baseClass, isSelected ? "bg-yellow-500 text-white" : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30")
    }
    return cn(baseClass, isSelected ? "bg-red-500 text-white" : "bg-red-500/20 text-red-400 hover:bg-red-500/30")
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* CASO CERRADO Animation */}
      <AnimatePresence>
        {showCasoCerrado && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.3, rotate: -10 }}
              animate={{ 
                scale: [0.3, 1.2, 1],
                rotate: [-10, 5, 0],
              }}
              transition={{ 
                duration: 0.6, 
                times: [0, 0.6, 1],
                ease: "easeOut" 
              }}
              className="relative"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 blur-3xl bg-primary/30 rounded-full scale-150" />
              
              {/* Main text */}
              <div className="relative bg-gradient-to-br from-primary via-primary to-primary/80 px-12 py-8 rounded-2xl border-4 border-primary-foreground/20 shadow-2xl">
                <motion.h2 
                  className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground tracking-wider"
                  animate={{ 
                    textShadow: [
                      "0 0 20px rgba(255,255,255,0.5)",
                      "0 0 60px rgba(255,255,255,0.8)",
                      "0 0 20px rgba(255,255,255,0.5)",
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  CASO CERRADO
                </motion.h2>
                <motion.div 
                  className="absolute -top-4 -right-4 w-12 h-12"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Gavel className="w-12 h-12 text-primary-foreground/80" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Scale className="w-8 h-8 text-primary" />
          <h2 className="font-serif text-3xl md:text-5xl text-primary">
            Sección de Análisis Comparativo
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Análisis de las tres obras literarias.
        </p>
      </motion.div>

      {/* Main Theme - Identity with animated words */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <div className="relative bg-gradient-to-br from-primary/10 via-card to-primary/5 rounded-2xl p-8 border border-primary/30 overflow-hidden min-h-[600px]">
          {/* Animated IDENTIDAD words in background - MORE dramatic */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {identityWords.map((word) => (
              <motion.div
                key={word.id}
                className="absolute font-serif whitespace-nowrap select-none"
                style={{
                  left: `${word.x}%`,
                  top: `${word.y}%`,
                  fontSize: `${word.size}rem`,
                  transform: `rotate(${word.rotation}deg)`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.4, 0.2, 0.5, 0],
                  scale: [0.5, 1.2, 1, 1.1, 0.5],
                  color: ["#9333ea", "#c026d3", "#7c3aed", "#a855f7", "#9333ea"],
                }}
                transition={{
                  duration: word.duration,
                  delay: word.delay,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                {word.text}
              </motion.div>
            ))}
            
            {/* Floating words that enter from sides */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={`float-${i}`}
                className="absolute font-serif text-2xl md:text-4xl text-primary/20 font-bold whitespace-nowrap"
                initial={{ x: i % 2 === 0 ? "-100%" : "200%", y: `${i * 10}%` }}
                animate={{ 
                  x: i % 2 === 0 ? "200%" : "-100%",
                }}
                transition={{
                  duration: 8 + i,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                IDENTIDAD
              </motion.div>
            ))}
          </div>

          <div className="relative z-10">
            <h3 className="font-serif text-2xl text-center text-primary mb-6">
              ¿Qué temas comparten las tres obras?
            </h3>
            
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  className="inline-block"
                >
                  <motion.span 
                    className="inline-block px-8 py-4 bg-primary/30 rounded-full text-primary font-serif text-4xl md:text-5xl lg:text-6xl border-2 border-primary/50 shadow-lg shadow-primary/20"
                    animate={{
                      textShadow: [
                        "0 0 20px rgba(147, 51, 234, 0.5)",
                        "0 0 40px rgba(147, 51, 234, 0.8)",
                        "0 0 20px rgba(147, 51, 234, 0.5)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    LA IDENTIDAD
                  </motion.span>
                </motion.div>
                
                {/* Scattered identity words around the main badge */}
                <div className="relative mt-4 flex flex-wrap justify-center gap-2">
                  {["IDENTIDAD", "identidad", "IDENTIDAD", "Identidad", "IDENTIDAD"].map((text, i) => (
                    <motion.span
                      key={i}
                      className="text-primary/30 font-serif text-sm md:text-base"
                      animate={{ opacity: [0.2, 0.5, 0.2] }}
                      transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                    >
                      {text}
                    </motion.span>
                  ))}
                </div>
              </div>

              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                Las tres obras, tanto de manera explícita como implícita, tienen temas en común. 
                Sin embargo, lo predominante es la identidad.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Eréndira */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-blood/10 rounded-xl p-5 border border-blood/30 backdrop-blur-sm"
                >
                  <h4 className="font-serif text-blood text-lg mb-3">La Cándida Eréndira</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Eréndira pierde su identidad; esta deja de ser suya y pasa a pertenecer a su abuela. 
                    Ella no tiene voz sobre su vida y está totalmente bajo el poder de una persona externa.
                  </p>
                </motion.div>

                {/* Montecristo */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-ocean/10 rounded-xl p-5 border border-ocean/30 backdrop-blur-sm"
                >
                  <h4 className="font-serif text-ocean text-lg mb-3">El Conde de Montecristo</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Edmond Dantés pierde su identidad original al ser traicionado y encarcelado. 
                    En la cárcel adquiere conocimientos que luego usa para adoptar su siguiente identidad: el Conde de Montecristo.
                  </p>
                </motion.div>

                {/* Jekyll */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-mystic/10 rounded-xl p-5 border border-mystic/30 backdrop-blur-sm"
                >
                  <h4 className="font-serif text-mystic text-lg mb-3">Dr. Jekyll y Mr. Hyde</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Se presenta la dualidad dentro de una misma persona. Jekyll usa a Hyde para suplir los deseos 
                    de su identidad original. Pierde el control sobre Hyde y sobre su propia identidad.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Comparacion Protagonistas */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h3 className="font-serif text-2xl text-center text-primary mb-4">
          ¿En qué se parecen y en qué se diferencian los protagonistas?
        </h3>

        
        {/* Venn Diagram - Classic Overlapping Circles */}
        <div className="relative w-full max-w-4xl mx-auto mb-12" style={{ minHeight: "600px" }}>
          {/* SVG for better circle overlap visualization */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 450" preserveAspectRatio="xMidYMid meet">
            {/* Edmond Circle - Top Left */}
            <circle cx="175" cy="175" r="130" fill="rgba(14, 165, 233, 0.15)" stroke="rgba(14, 165, 233, 0.5)" strokeWidth="2" />
            {/* Jekyll Circle - Top Right */}
            <circle cx="325" cy="175" r="130" fill="rgba(168, 85, 247, 0.15)" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="2" />
            {/* Eréndira Circle - Bottom Center */}
            <circle cx="250" cy="310" r="130" fill="rgba(220, 38, 38, 0.15)" stroke="rgba(220, 38, 38, 0.5)" strokeWidth="2" />
          </svg>

          {/* Edmond Dantès - Top Left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02, zIndex: 20 }}
            className="absolute left-[2%] md:left-[8%] top-[2%] w-[180px] md:w-[220px] cursor-pointer transition-all duration-300 group"
          >
            <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-ocean/50 shadow-lg group-hover:border-ocean group-hover:shadow-ocean/20 group-hover:shadow-xl transition-all">
              <h4 className="font-serif text-ocean text-sm md:text-base font-bold mb-2">Edmond Dantès</h4>
              <ul className="space-y-1 text-xs text-foreground">
                <li>• Traición y prisión injusta</li>
                <li>• Busca venganza y justicia</li>
                <li>• Nueva identidad: el Conde</li>
              </ul>
            </div>
          </motion.div>

          {/* Jekyll - Top Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, zIndex: 20 }}
            className="absolute right-[2%] md:right-[8%] top-[2%] w-[180px] md:w-[220px] cursor-pointer transition-all duration-300 group"
          >
            <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-mystic/50 shadow-lg group-hover:border-mystic group-hover:shadow-mystic/20 group-hover:shadow-xl transition-all">
              <h4 className="font-serif text-mystic text-sm md:text-base font-bold mb-2">Dr. Jekyll / Mr. Hyde</h4>
              <ul className="space-y-1 text-xs text-foreground">
                <li>• Conflicto interno</li>
                <li>• Identidad dividida</li>
                <li>• Experimento que sale mal</li>
              </ul>
            </div>
          </motion.div>

          {/* Eréndira - Bottom Center */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, zIndex: 20 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-[2%] w-[180px] md:w-[220px] cursor-pointer transition-all duration-300 group"
          >
            <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-blood/50 shadow-lg group-hover:border-blood group-hover:shadow-blood/20 group-hover:shadow-xl transition-all">
              <h4 className="font-serif text-blood text-sm md:text-base font-bold mb-2">Eréndira</h4>
              <ul className="space-y-1 text-xs text-foreground">
                <li>• Víctima de abuso</li>
                <li>• Lucha por sobrevivir</li>
                <li>• Busca libertad, no venganza</li>
              </ul>
            </div>
          </motion.div>

          {/* Center - Similarities (where all 3 overlap) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="absolute left-1/2 -translate-x-1/2 top-[35%] w-[200px] md:w-[240px] cursor-pointer z-10"
          >
            <div className="bg-primary/20 backdrop-blur-md rounded-xl p-4 border-2 border-primary/60 shadow-lg shadow-primary/10 hover:border-primary hover:shadow-primary/30 transition-all">
              <p className="font-bold text-primary text-sm md:text-base text-center mb-2">En Común</p>
              <ul className="text-xs text-foreground space-y-1">
                <li>• Sufren un evento que cambia su vida</li>
                <li>• Transformación de identidad</li>
                <li>• Enfrentan el sufrimiento</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Legend / Detailed info below the diagram */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-ocean/10 rounded-lg p-4 border border-ocean/30">
            <p className="text-ocean text-xs italic">«Toda la sabiduría humana se encierra en estas dos palabras: esperar y confiar.»</p>
            <p className="text-muted-foreground text-xs mt-1">— Alexandre Dumas</p>
          </div>
          <div className="bg-mystic/10 rounded-lg p-4 border border-mystic/30">
            <p className="text-mystic text-xs italic">«El hombre no es verdaderamente uno, sino verdaderamente dos.»</p>
            <p className="text-muted-foreground text-xs mt-1">— R. L. Stevenson</p>
          </div>
          <div className="bg-blood/10 rounded-lg p-4 border border-blood/30">
            <p className="text-blood text-xs italic">«Eréndira estaba bañando a la abuela cuando empezó el viento de su desgracia.»</p>
            <p className="text-muted-foreground text-xs mt-1">— García Márquez</p>
          </div>
        </div>

        {/* Tabla comparativa */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Aspecto</th>
                  <th className="text-left p-3 text-sm font-medium text-ocean">Edmond Dantès</th>
                  <th className="text-left p-3 text-sm font-medium text-mystic">Dr. Jekyll / Mr. Hyde</th>
                  <th className="text-left p-3 text-sm font-medium text-blood">Eréndira</th>
                </tr>
              </thead>
              <tbody>
                {comparacionProtagonistas.tabla.map((row, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="p-3 text-sm font-medium text-foreground">{row.aspecto}</td>
                    <td className="p-3 text-sm text-muted-foreground">{row.edmond}</td>
                    <td className="p-3 text-sm text-muted-foreground">{row.jekyll}</td>
                    <td className="p-3 text-sm text-muted-foreground">{row.erendira}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Explicación - En qué se parecen y diferencian */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* En qué se parecen */}
            <div className="bg-card rounded-xl p-6 border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <UserCheck className="w-5 h-5 text-green-400" />
                <h5 className="font-serif text-lg text-foreground">¿En qué se parecen?</h5>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-muted-foreground text-sm">
                  <span className="text-green-400 mt-1">•</span>
                  Los tres protagonistas cambian completamente a lo largo de sus historias.
                </li>
                <li className="flex items-start gap-2 text-muted-foreground text-sm">
                  <span className="text-green-400 mt-1">•</span>
                  Todos experimentan un momento que destruye su vida anterior.
                </li>
                <li className="flex items-start gap-2 text-muted-foreground text-sm">
                  <span className="text-green-400 mt-1">•</span>
                  Sus historias exploran el tema de la identidad y cómo el sufrimiento puede transformarla.
                </li>
                <li className="flex items-start gap-2 text-muted-foreground text-sm">
                  <span className="text-green-400 mt-1">•</span>
                  En otras palabras, ninguno termina siendo la misma persona que era al inicio.
                </li>
              </ul>
            </div>

            {/* En qué se diferencian */}
            <div className="bg-card rounded-xl p-6 border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <UserX className="w-5 h-5 text-primary" />
                <h5 className="font-serif text-lg text-foreground">¿En qué se diferencian?</h5>
              </div>
              <div className="space-y-4">
                {comparacionProtagonistas.diferencias.map((item, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-primary font-medium">{item.personaje}:</span>
                    <span className="text-muted-foreground ml-2">{item.diferencia}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Criticas Sociales with AI Generated Images */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h3 className="font-serif text-2xl text-center text-primary mb-8">
          Críticas sociales en cada obra
        </h3>
        <p className="text-center text-muted-foreground text-sm mb-8">
          Imágenes generadas con IA para representar visualmente las críticas sociales
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {criticasSociales.map((item, index) => {
            const colorClasses = {
              ocean: "border-ocean/50 bg-ocean/5",
              mystic: "border-mystic/50 bg-mystic/5",
              blood: "border-blood/50 bg-blood/5",
            }
            const textColors = {
              ocean: "text-ocean",
              mystic: "text-mystic",
              blood: "text-blood",
            }
            return (
              <motion.div
                key={item.obra}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "rounded-xl overflow-hidden border-2 group",
                  colorClasses[item.color as keyof typeof colorClasses]
                )}
              >
                {/* AI Generated Image */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={`Critica social - ${item.obra}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-background/80 rounded text-xs text-muted-foreground backdrop-blur-sm">
                    Imagen IA
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5">
                  <h4 className={cn("font-serif text-lg mb-3", textColors[item.color as keyof typeof textColors])}>
                    {item.obra}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.critica}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Tribunal de los Personajes */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gavel className="w-7 h-7 text-primary" />
            <h3 className="font-serif text-2xl md:text-3xl text-primary">
              Tribunal de los Personajes
            </h3>
          </div>
          <p className="text-lg text-muted-foreground italic">
            ¿Quién es el verdadero villano?
          </p>
        </div>

        {/* Tribunal Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-secondary/30 rounded-xl p-6 border border-border/50">
            <h4 className="font-serif text-xl text-primary mb-4">La Acusación</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Hoy se reúnen en este tribunal tres personajes acusados de actos terribles. 
              Cada uno tendrá la oportunidad de defenderse. Tú, lector, serás el juez.
            </p>
          </div>

          {/* Characters */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-ocean/10 rounded-xl p-5 border border-ocean/30">
              <h5 className="font-serif text-ocean text-lg mb-3">El Conde de Montecristo</h5>
              <p className="text-sm text-muted-foreground italic mb-3">&laquo;Yo solo devolví lo que me quitaron.&raquo;</p>
              <p className="text-sm text-muted-foreground mb-4">
                Acusado de destruir familias enteras en nombre de la justicia. 
                ¿Fue venganza o fue justicia divina?
              </p>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => handleVote("montecristo", "inocente")} className={getVoteButtonClass("montecristo", "inocente")}>
                  Inocente
                </button>
                <button onClick={() => handleVote("montecristo", "neutral")} className={getVoteButtonClass("montecristo", "neutral")}>
                  Neutral
                </button>
                <button onClick={() => handleVote("montecristo", "culpable")} className={getVoteButtonClass("montecristo", "culpable")}>
                  Culpable
                </button>
              </div>
            </div>

            <div className="bg-mystic/10 rounded-xl p-5 border border-mystic/30">
              <h5 className="font-serif text-mystic text-lg mb-3">Dr. Jekyll / Mr. Hyde</h5>
              <p className="text-sm text-muted-foreground italic mb-3">&laquo;Hyde no soy yo... ¿o sí lo soy?&raquo;</p>
              <p className="text-sm text-muted-foreground mb-4">
                Acusado de asesinato y múltiples crímenes. 
                ¿Puede alguien ser culpable de lo que hace su otro yo?
              </p>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => handleVote("jekyll", "inocente")} className={getVoteButtonClass("jekyll", "inocente")}>
                  Inocente
                </button>
                <button onClick={() => handleVote("jekyll", "neutral")} className={getVoteButtonClass("jekyll", "neutral")}>
                  Neutral
                </button>
                <button onClick={() => handleVote("jekyll", "culpable")} className={getVoteButtonClass("jekyll", "culpable")}>
                  Culpable
                </button>
              </div>
            </div>

            <div className="bg-blood/10 rounded-xl p-5 border border-blood/30">
              <h5 className="font-serif text-blood text-lg mb-3">La Abuela de Eréndira</h5>
              <p className="text-sm text-muted-foreground italic mb-3">&laquo;Ella me debía todo.&raquo;</p>
              <p className="text-sm text-muted-foreground mb-4">
                Acusada de explotación y abuso. 
                ¿Hay algún argumento que pueda justificar lo injustificable?
              </p>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => handleVote("abuela", "inocente")} className={getVoteButtonClass("abuela", "inocente")}>
                  Inocente
                </button>
                <button onClick={() => handleVote("abuela", "neutral")} className={getVoteButtonClass("abuela", "neutral")}>
                  Neutral
                </button>
                <button onClick={() => handleVote("abuela", "culpable")} className={getVoteButtonClass("abuela", "culpable")}>
                  Culpable
                </button>
              </div>
            </div>
          </div>

          {/* Verdict */}
          <div className="bg-card/50 rounded-xl p-6 border border-primary/30 text-center">
            <h4 className="font-serif text-xl text-primary mb-4">El Veredicto es Tuyo</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              No hay respuesta correcta. Cada lector debe decidir quién merece perdón y quién no. 
              Quizá el verdadero villano no está en estas páginas... quizá está en el espejo.
            </p>
            {(votes.montecristo || votes.jekyll || votes.abuela) && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-2">Tu veredicto:</p>
                <div className="flex flex-wrap justify-center gap-3 text-xs">
                  {votes.montecristo && (
                    <span className="px-2 py-1 bg-ocean/20 text-ocean rounded">
                      Montecristo: {votes.montecristo}
                    </span>
                  )}
                  {votes.jekyll && (
                    <span className="px-2 py-1 bg-mystic/20 text-mystic rounded">
                      Jekyll/Hyde: {votes.jekyll}
                    </span>
                  )}
                  {votes.abuela && (
                    <span className="px-2 py-1 bg-blood/20 text-blood rounded">
                      La Abuela: {votes.abuela}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Final Question */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-primary/30 max-w-2xl mx-auto">
          <h4 className="font-serif text-xl text-primary mb-4">
            La Pregunta Final
          </h4>
          <p className="text-muted-foreground italic leading-relaxed">
            ¿Puede alguien reconstruir su identidad después de perderla? 
            ¿O esa pérdida nos convierte en alguien completamente diferente, 
            alguien que ya no reconocemos cuando nos miramos al espejo?
          </p>
        </div>
      </motion.div>
    </div>
  )
}
