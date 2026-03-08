"use client"

import { motion } from "framer-motion"
import { Users, BookOpen, Image as ImageIcon, Bot, Sparkles } from "lucide-react"

const teamMembers = [
  { name: "Juan Esteban Ramírez Reyes" },
  { name: "Valerie Llinas León" },
  { name: "Santiago Aragón Meyer" },
]

const bibliography = [
  {
    title: "El Conde de Montecristo",
    author: "Alejandro Dumas (adaptado por R. Jay Nudds, ilustrado por Sankha Banerjee)",
    year: "1844",
    type: "Novela gráfica (versión adaptada)",
  },
  {
    title: "El Extraño Caso del Dr. Jekyll y Mr. Hyde",
    author: "Robert Louis Stevenson",
    year: "1886",
    type: "Novela",
  },
  {
    title: "La Increíble y Triste Historia de la Cándida Eréndira y de su Abuela Desalmada",
    author: "Gabriel García Márquez",
    year: "1972",
    type: "Cuento largo",
  },
]

const aiTools = [
  { name: "ChatGPT, Vercel, GitHub", use: "Desarrollo de la página web y diseño de interfaz" },
  { name: "Gemini", use: "Creación de las imágenes simbólicas y cartas de tarot" },
]

const imageCredits = [
  { description: "Bola de cristal mística", type: "Gemini" },
  { description: "Cartas de tarot (El Justiciero, La Dualidad, La Resiliente)", type: "Gemini" },
  { description: "Espejo fragmentado", type: "Gemini" },
  { description: "Imágenes simbólicas de cada obra", type: "Gemini" },
]

export function CreditsSection() {
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
          <Users className="w-8 h-8 text-primary" />
          <h2 className="font-serif text-3xl md:text-5xl text-primary">
            Créditos y Fuentes
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Créditos y fuentes.
        </p>
      </motion.div>

      {/* Team */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <div className="flex items-center gap-2 text-primary mb-6">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-serif text-xl">Integrantes del Equipo</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border/50 p-6 text-center hover:border-primary/50 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <span className="font-serif text-2xl text-primary">
                  {member.name.charAt(0)}
                </span>
              </div>
              <h4 className="font-serif text-lg text-foreground">{member.name}</h4>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-6">
<p className="text-sm text-muted-foreground italic">
          Integrantes del proyecto
        </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            Colegio Real Royal School • Área de Humanidades y Lengua Castellana • Décimo Grado
          </p>
        </div>
      </motion.div>

      {/* Bibliography */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <div className="flex items-center gap-2 text-primary mb-6">
          <BookOpen className="w-5 h-5" />
          <h3 className="font-serif text-xl">Referencias Bibliográficas</h3>
        </div>
        <div className="bg-card/50 rounded-xl border border-border/50 overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left p-4 text-sm text-muted-foreground font-medium">Obra</th>
                <th className="text-left p-4 text-sm text-muted-foreground font-medium hidden md:table-cell">Autor</th>
                <th className="text-left p-4 text-sm text-muted-foreground font-medium hidden md:table-cell">Año</th>
                <th className="text-left p-4 text-sm text-muted-foreground font-medium hidden lg:table-cell">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {bibliography.map((book, index) => (
                <tr key={index} className="border-t border-border/50">
                  <td className="p-4">
                    <span className="text-foreground font-medium">{book.title}</span>
                    <span className="md:hidden text-sm text-muted-foreground block mt-1">
                      {book.author} ({book.year})
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{book.author}</td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{book.year}</td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell">{book.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Image Credits */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <div className="flex items-center gap-2 text-primary mb-6">
          <ImageIcon className="w-5 h-5" />
          <h3 className="font-serif text-xl">Créditos de las Imágenes</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {imageCredits.map((credit, index) => (
            <div
              key={index}
              className="bg-card/30 rounded-lg p-4 border border-border/50 flex items-center justify-between"
            >
              <span className="text-sm text-foreground">{credit.description}</span>
              <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                {credit.type}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Tools */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <div className="flex items-center gap-2 text-primary mb-6">
          <Bot className="w-5 h-5" />
          <h3 className="font-serif text-xl">Herramientas de IA Utilizadas</h3>
        </div>
        <p className="text-sm text-muted-foreground italic mb-4">
          «Herramientas usadas para crear el proyecto»
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {aiTools.map((tool, index) => (
            <div
              key={index}
              className="bg-card/30 rounded-lg p-4 border border-border/50"
            >
              <h4 className="text-foreground font-medium mb-1">{tool.name}</h4>
              <p className="text-sm text-muted-foreground">{tool.use}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center pt-8 border-t border-border/50"
      >
        <div className="flex items-center justify-center gap-2 text-primary mb-4">
          <Sparkles className="w-5 h-5" />
          <span className="font-serif text-lg">El Oráculo de los Espejos</span>
          <Sparkles className="w-5 h-5" />
        </div>
        <p className="text-sm text-muted-foreground">
          Prueba Trimestral de Producción Textual • 2026
        </p>
        <p className="text-xs text-muted-foreground/60 mt-2">
          Colegio Real Royal School • Área de Humanidades y Lengua Castellana
        </p>
      </motion.div>
    </div>
  )
}
