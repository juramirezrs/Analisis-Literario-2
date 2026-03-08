"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Image as ImageIcon, X, BookOpen } from "lucide-react"
import Image from "next/image"

const galleryImages = [
  {
    id: "montecristo",
    title: "El amor convertido en venganza",
    obra: "El Conde de Montecristo",
    src: "/images/symbolic-montecristo.jpg",
    literaryConnection: `La rosa es Mercedes, el amor que Dantés perdió. La daga es en lo que él se convirtió después de la prisión.

El brillo dorado es el tesoro, pero también todo lo que aprendió del Abbé Faria. Y el lazo rojo que une todo representa que su amor y su odio ya no se pueden separar.

Básicamente, Dantés no puede amar sin odiar. Y eso es lo más trágico de toda la novela.`,
  },
  {
    id: "jekyll",
    title: "Dos caras de la misma moneda",
    obra: "Dr. Jekyll y Mr. Hyde",
    src: "/images/symbolic-jekyll.jpg",
    literaryConnection: `Jekyll a la izquierda, elegante y respetable. Hyde a la derecha, salvaje y sin límites. El humo entre ellos es la poción, pero también muestra que la línea entre los dos cada vez es más delgada.

Lo interesante es que las calles de Londres son las mismas, pero cada uno las ve diferente. Para Jekyll es su vida normal, para Hyde es donde puede hacer lo que quiera.

La niebla representa cómo la sociedad victoriana escondía sus verdades detrás de apariencias.`,
  },
  {
    id: "erendira",
    title: "Correr hacia la libertad",
    obra: "La Cándida Eréndira",
    src: "/images/symbolic-erendira.jpg",
    literaryConnection: `La casa en llamas es todo lo que la tenía atrapada: la deuda, los años de explotación, su identidad robada.

Eréndira corre hacia el mar sin mirar atrás. García Márquez nunca nos dice qué le pasa después, y eso es lo más fuerte. El atardecer puede ser esperanza o puede ser otra trampa.

El fuego caliente contra el mar frío. El pasado contra el futuro. Y ella en medio, como siempre.`,
  },
]

export function MultimediaSection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const selectedImageData = galleryImages.find(img => img.id === selectedImage)

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
          <ImageIcon className="w-8 h-8 text-primary" />
          <h2 className="font-serif text-3xl md:text-5xl text-primary">
            Galería Multimedia
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Imágenes simbólicas que conectan con las historias. Haz clic en cada una para ver su conexión literaria.
        </p>
      </motion.div>

      {/* Gallery Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-3 gap-6 mb-12"
      >
        {galleryImages.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedImage(image.id)}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all">
              <Image
                src={image.src}
                alt={image.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Imagen IA Label */}
              <div className="absolute top-2 right-2 z-10">
                <span className="text-xs bg-primary/80 text-primary-foreground px-2 py-1 rounded-full">
                  Imagen IA
                </span>
              </div>

              {/* Hover indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-background/80 backdrop-blur-sm rounded-full p-3">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="text-xs text-primary uppercase tracking-wider mb-1">
                  {image.obra}
                </p>
                <h4 className="font-serif text-lg text-foreground">
                  {image.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Clic para ver conexión literaria
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>



      {/* Image Modal with Literary Description */}
      <AnimatePresence>
        {selectedImage && selectedImageData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50"
              onClick={() => setSelectedImage(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 md:inset-8 lg:inset-12 z-50 overflow-hidden rounded-2xl bg-card border border-border shadow-2xl"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-full overflow-y-auto">
                <div className="grid lg:grid-cols-2 h-full">
                  {/* Image Side */}
                  <div className="relative min-h-[300px] lg:min-h-full">
                    <Image
                      src={selectedImageData.src}
                      alt={selectedImageData.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/50 lg:block hidden" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent lg:hidden" />
                  </div>

                  {/* Content Side */}
                  <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                    <div className="mb-6">
                      <p className="text-sm text-primary uppercase tracking-wider mb-2">
                        {selectedImageData.obra}
                      </p>
                      <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
                        {selectedImageData.title}
                      </h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm">Conexión literaria</span>
                      </div>
                    </div>

                    <div className="bg-secondary/30 rounded-xl p-5 border border-border/50">
                      <pre className="whitespace-pre-wrap font-sans text-foreground/90 leading-relaxed text-sm md:text-base">
                        {selectedImageData.literaryConnection}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
