"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Sparkles, Scale, Feather, Film, MessageCircle, Users, Flame, Anchor, FlaskConical } from "lucide-react"

const navItems = [
  { id: "home", label: "Inicio", icon: Sparkles },
  { id: "obra-erendira", label: "Eréndira", icon: Flame },
  { id: "obra-montecristo", label: "Montecristo", icon: Anchor },
  { id: "obra-jekyll", label: "Jekyll y Hyde", icon: FlaskConical },
  { id: "tribunal", label: "Análisis", icon: Scale },
  { id: "creativo", label: "Creativo", icon: Feather },
  { id: "multimedia", label: "Multimedia", icon: Film },
  { id: "conclusion", label: "Conclusión", icon: MessageCircle },
  { id: "creditos", label: "Créditos", icon: Users },
]

interface NavigationProps {
  activeSection: string
  isRevealed: boolean
}

export function Navigation({ activeSection, isRevealed }: NavigationProps) {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Don't render navigation until content is revealed
  if (!isRevealed) {
    return null
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => scrollTo("home")}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <Sparkles className="w-6 h-6" />
            <span className="font-serif text-lg hidden sm:inline">El Oráculo</span>
          </button>

          {/* Navigation Items */}
          <div className="flex items-center gap-1 md:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    "relative px-2 md:px-3 py-2 rounded-lg text-sm transition-all duration-300",
                    "hover:bg-primary/10",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/30"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
