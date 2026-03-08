"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { X, BookOpen, Users, Swords } from "lucide-react"

interface Character {
  name: string
  role: string
}

interface Obra {
  id: string
  title: string
  subtitle: string
  image: string
  author: string
  year: string
  country: string
  context: string
  summary: string
  characters: Character[]
  conflict: string
  socialCritique: string
  genre?: string
  color: string
}

interface TarotCardProps {
  obra: Obra
  isSelected: boolean
  onSelect: () => void
}

export function TarotCard({ obra, isSelected, onSelect }: TarotCardProps) {
  const colorClasses = {
    ocean: "from-ocean/20 to-ocean/5 border-ocean/50 hover:border-ocean",
    mystic: "from-mystic/20 to-mystic/5 border-mystic/50 hover:border-mystic",
    blood: "from-blood/20 to-blood/5 border-blood/50 hover:border-blood",
  }

  const glowClasses = {
    ocean: "shadow-ocean/30",
    mystic: "shadow-mystic/30",
    blood: "shadow-blood/30",
  }

  return (
    <>
      {/* Card Front */}
      <motion.div
        className={cn(
          "relative cursor-pointer rounded-2xl overflow-hidden",
          "bg-gradient-to-b border-2 transition-all duration-500",
          "hover:shadow-2xl",
          colorClasses[obra.color as keyof typeof colorClasses],
          glowClasses[obra.color as keyof typeof glowClasses]
        )}
        onClick={onSelect}
        whileHover={{ scale: 1.02, y: -8 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Card Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={obra.image}
            alt={obra.subtitle}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          {/* Imagen IA Label */}
          <div className="absolute top-2 right-2 z-10">
            <span className="text-xs bg-primary/80 text-primary-foreground px-2 py-1 rounded-full">
              Imagen IA
            </span>
          </div>
          
          {/* Card Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="text-center">
              <p className="text-primary/80 text-sm uppercase tracking-widest mb-1">
                {obra.title}
              </p>
              <h3 className="font-serif text-xl md:text-2xl text-foreground mb-2">
                {obra.subtitle}
              </h3>
              <p className="text-muted-foreground text-sm">
                {obra.author} • {obra.year}
              </p>
            </div>
          </div>
        </div>

        {/* Click Prompt */}
        <div className="p-4 text-center border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Toca para revelar los secretos
          </p>
        </div>

        {/* Decorative Corner Elements */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary/30 rounded-tl-lg" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary/30 rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary/30 rounded-bl-lg" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary/30 rounded-br-lg" />
      </motion.div>

      {/* Expanded Card Modal */}
      <AnimatePresence>
        {isSelected && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50"
              onClick={onSelect}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-hidden rounded-2xl bg-card border border-border shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={onSelect}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable Content */}
              <div className="h-full overflow-y-auto">
                {/* Header with Image */}
                <div className="relative h-48 md:h-64 lg:h-80">
                  <Image
                    src={obra.image}
                    alt={obra.subtitle}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="text-primary text-sm uppercase tracking-widest mb-2">
                      {obra.title}
                    </p>
                    <h2 className="font-serif text-2xl md:text-4xl text-foreground mb-2">
                      {obra.subtitle}
                    </h2>
                    <p className="text-muted-foreground">
                      {obra.author} • {obra.country} • {obra.year}
                    </p>
                    {obra.genre && (
                      <p className="text-primary/80 text-sm mt-1">
                        Género: {obra.genre}
                      </p>
                    )}
                  </div>
                </div>

                {/* Content Sections */}
                <div className="p-6 md:p-8 space-y-8">
                  {/* Context */}
                  <ContentSection
                    icon={<BookOpen className="w-5 h-5" />}
                    title="Contexto Histórico"
                    content={obra.context}
                  />

                  {/* Summary */}
                  <ContentSection
                    icon={<BookOpen className="w-5 h-5" />}
                    title="Resumen"
                    content={obra.summary}
                  />

                  {/* Characters */}
                  <div>
                    <div className="flex items-center gap-2 text-primary mb-4">
                      <Users className="w-5 h-5" />
                      <h3 className="font-serif text-xl">Personajes Principales</h3>
                    </div>
                    <div className="grid gap-4">
                      {obra.characters.map((char, index) => (
                        <motion.div
                          key={char.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-secondary/50 rounded-lg p-4 border border-border/50"
                        >
                          <h4 className="font-serif text-primary mb-1">{char.name}</h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {char.role}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Conflict */}
                  <ContentSection
                    icon={<Swords className="w-5 h-5" />}
                    title="Conflicto Central"
                    content={obra.conflict}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function ContentSection({ 
  icon, 
  title, 
  content 
}: { 
  icon: React.ReactNode
  title: string
  content: string 
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-primary mb-3">
        {icon}
        <h3 className="font-serif text-xl">{title}</h3>
      </div>
      <p className="text-muted-foreground leading-relaxed">{content}</p>
    </div>
  )
}
