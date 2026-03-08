"use client"

import { motion } from "framer-motion"
import { MessageCircle, Lightbulb, Globe, Heart, MessageSquare, Share2, ThumbsUp, Play, Eye, Bookmark, Send } from "lucide-react"
import Image from "next/image"

// Social media bubble icons
const socialBubbles = [
  { icon: Heart, color: "text-red-500", delay: 0 },
  { icon: MessageSquare, color: "text-blue-400", delay: 0.5 },
  { icon: Share2, color: "text-green-400", delay: 1 },
  { icon: ThumbsUp, color: "text-yellow-400", delay: 1.5 },
  { icon: Play, color: "text-pink-500", delay: 2 },
  { icon: Eye, color: "text-cyan-400", delay: 2.5 },
  { icon: Bookmark, color: "text-purple-400", delay: 3 },
  { icon: Send, color: "text-blue-500", delay: 3.5 },
]

// TikTok style floating comments
const floatingComments = [
  { text: "esto es tan real", x: 10, delay: 0 },
  { text: "me sentí identificado", x: 70, delay: 1 },
  { text: "cancel culture be like", x: 30, delay: 2 },
  { text: "main character energy", x: 80, delay: 3 },
  { text: "no me hagas llorar", x: 20, delay: 4 },
  { text: "facts", x: 60, delay: 5 },
]

export function ConclusionSection() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <MessageCircle className="w-8 h-8 text-primary" />
          <h2 className="font-serif text-3xl md:text-5xl text-primary">
            Conclusión
          </h2>
        </div>
      </motion.div>

      {/* One Team Opinion */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h3 className="font-serif text-2xl text-center text-primary mb-8">
          Opinión general del equipo
        </h3>
        <div className="bg-card rounded-xl border border-border/50 p-8">
          <p className="text-foreground leading-relaxed text-lg mb-6">
            Después de analizar las tres obras, llegamos a una conclusión como equipo:{" "}
            <span className="text-primary font-medium">
              todas hablan de lo mismo, pero de formas diferentes
            </span>.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Montecristo nos enseñó que la venganza puede parecer satisfactoria al principio, pero termina consumiendo a quien la ejecuta. Cuando buscas vengarte, a veces te conviertes en lo mismo que odias.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Jekyll y Hyde nos hicieron pensar en cuántas veces al día nos ponemos una máscara. Todos tenemos un lado que escondemos, y eso no está mal, lo malo es negarlo por completo.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            La historia de Eréndira nos mostró que a veces la fuerza más grande está en soltar y alejarse. No siempre necesitas destruir a quien te hace daño, a veces solo hay que correr hacia algo mejor.
          </p>
        </div>
      </motion.div>

      {/* Teachings */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <Lightbulb className="w-6 h-6 text-primary" />
          <h3 className="font-serif text-2xl text-primary">
            ¿Qué enseñanza dejan estas obras hoy?
          </h3>
        </div>

        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-primary/20">
          <div className="grid md:grid-cols-3 gap-8">

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-ocean/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-ocean font-serif text-xl">1</span>
              </div>
              <h4 className="font-serif text-lg text-foreground mb-2">
                La venganza no soluciona nada
              </h4>
              <p className="text-sm text-muted-foreground">
                Montecristo nos enseña que la venganza puede sentirse bien al principio,
                pero termina consumiéndote. La justicia no debería ser personal.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-mystic/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-mystic font-serif text-xl">2</span>
              </div>
              <h4 className="font-serif text-lg text-foreground mb-2">
                Aceptar nuestro lado oscuro
              </h4>
              <p className="text-sm text-muted-foreground">
                Jekyll y Hyde nos muestran que negar lo que somos solo lo hace más fuerte.
                Es mejor aceptar nuestras sombras que pretender que no existen.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blood/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-blood font-serif text-xl">3</span>
              </div>
              <h4 className="font-serif text-lg text-foreground mb-2">
                La fuerza de seguir adelante
              </h4>
              <p className="text-sm text-muted-foreground">
                Eréndira nos muestra que la libertad no siempre viene de destruir al enemigo, sino de alejarse y empezar de nuevo.
              </p>
            </div>

          </div>
        </div>
      </motion.div>

      {/* Connection to Current Life with Social Media Bubbles */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <Globe className="w-6 h-6 text-primary" />
          <h3 className="font-serif text-2xl text-primary">
            Relación con la vida actual
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">

          {/* Monster Image with Social Bubbles */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary/30"
          >
            <Image
              src="/images/monster-within.jpg"
              alt="El monstruo que llevamos dentro"
              fill
              className="object-cover"
            />
            {/* Imagen IA Label */}
            <div className="absolute top-2 right-2 z-10">
              <span className="text-xs bg-primary/80 text-primary-foreground px-2 py-1 rounded-full">
                Imagen IA
              </span>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

            {/* Floating Social Media Bubbles */}
            {socialBubbles.map((bubble, i) => {
              const Icon = bubble.icon
              return (
                <motion.div
                  key={i}
                  className={`absolute ${bubble.color}`}
                  style={{
                    left: `${15 + (i % 4) * 20}%`,
                    bottom: `${20 + Math.floor(i / 4) * 30}%`,
                  }}
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{ 
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.2, 1, 0],
                    y: [20, -10, -30, -50],
                  }}
                  transition={{
                    duration: 3,
                    delay: bubble.delay,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  <div className="bg-background/80 backdrop-blur-sm rounded-full p-2 shadow-lg">
                    <Icon className="w-5 h-5" />
                  </div>
                </motion.div>
              )
            })}

            {/* Floating TikTok-style comments */}
            {floatingComments.map((comment, i) => (
              <motion.div
                key={`comment-${i}`}
                className="absolute text-xs bg-background/70 backdrop-blur-sm px-2 py-1 rounded-full text-foreground/80"
                style={{ left: `${comment.x}%` }}
                initial={{ opacity: 0, bottom: "10%", x: "-50%" }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  bottom: ["10%", "40%", "70%", "90%"],
                }}
                transition={{
                  duration: 4,
                  delay: comment.delay,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                {comment.text}
              </motion.div>
            ))}

            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
              <p className="text-primary font-serif text-lg">
                &laquo;El monstruo que llevamos dentro&raquo;
              </p>
            </div>
          </motion.div>

          {/* Text Content with TikTok/Instagram references */}
          <div className="space-y-6">

            <div className="bg-card/50 rounded-xl p-5 border border-border/50 relative overflow-hidden">
              {/* TikTok icon floating */}
              <motion.div
                className="absolute -top-2 -right-2 text-pink-500 opacity-20"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Play className="w-16 h-16" />
              </motion.div>
              <p className="text-foreground leading-relaxed relative z-10">
                En TikTok vemos &laquo;venganzas&raquo; que se viralizan, gente exponiendo a sus ex o a quienes les hicieron daño.
                Eso es muy <span className="text-ocean font-medium">Montecristo</span>: la idea de que exponer al otro te da justicia.
              </p>
              <div className="flex items-center gap-2 mt-3 text-muted-foreground text-xs">
                <Heart className="w-4 h-4 text-red-400" />
                <span>2.3M likes</span>
                <MessageSquare className="w-4 h-4 ml-2" />
                <span>45K comentarios</span>
              </div>
            </div>

            <div className="bg-card/50 rounded-xl p-5 border border-border/50 relative overflow-hidden">
              {/* Instagram icon floating */}
              <motion.div
                className="absolute -top-2 -right-2 text-purple-500 opacity-20"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Eye className="w-16 h-16" />
              </motion.div>
              <p className="text-foreground leading-relaxed relative z-10">
                En Instagram y redes, <span className="text-mystic font-medium">todos somos Jekyll</span>: mostramos una vida perfecta,
                pero en los comentarios anónimos o en privado, sale nuestro Hyde. Fuego en los comentarios, hate sin razón.
              </p>
              <div className="flex items-center gap-2 mt-3 text-muted-foreground text-xs">
                <ThumbsUp className="w-4 h-4 text-blue-400" />
                <span>Doble cara digital</span>
              </div>
            </div>

            <div className="bg-card/50 rounded-xl p-5 border border-border/50 relative overflow-hidden">
              {/* Share icon floating */}
              <motion.div
                className="absolute -top-2 -right-2 text-green-500 opacity-20"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Share2 className="w-16 h-16" />
              </motion.div>
              <p className="text-foreground leading-relaxed relative z-10">
                Y muchos jóvenes se sienten como <span className="text-blood font-medium">Eréndira</span>: atrapados en situaciones
                que no eligieron, con &laquo;deudas&raquo; que les imponen (expectativas, presión social, problemas familiares).
              </p>
              <div className="flex items-center gap-2 mt-3 text-muted-foreground text-xs">
                <Send className="w-4 h-4 text-blue-400" />
                <span>Compartir para concientizar</span>
              </div>
            </div>

          </div>
        </div>

        {/* Final Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="bg-primary/10 rounded-xl p-8 border border-primary/30 text-center relative overflow-hidden">
            {/* Background floating icons */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
              {[...Array(12)].map((_, i) => {
                const icons = [Heart, MessageSquare, Share2, ThumbsUp, Eye, Bookmark]
                const Icon = icons[i % icons.length]
                return (
                  <motion.div
                    key={i}
                    className="absolute text-primary"
                    style={{
                      left: `${(i * 8) % 100}%`,
                      top: `${(i * 15) % 100}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.2,
                      repeat: Infinity,
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                )
              })}
            </div>
            
            <p className="text-primary font-serif text-xl leading-relaxed relative z-10">
              &laquo;Estas obras nos recuerdan que antes de buscar al culpable afuera,
              hay que mirarse al espejo y ver que llevamos dentro.&raquo;
            </p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  )
}
