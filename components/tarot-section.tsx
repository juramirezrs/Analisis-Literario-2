"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { TarotCard } from "./tarot-card"

const obras = [
  {
    id: "erendira",
    title: "La Resiliente",
    subtitle: "La Increíble y Triste Historia de la Cándida Eréndira y de su Abuela Desalmada",
    image: "/images/tarot-resiliente.jpg",
    author: "Gabriel García Márquez",
    year: "1972",
    country: "Colombia",
    context: "Este cuento, escrito por Gabriel García Márquez, fue publicado en 1972. Es una obra del realismo mágico, lo que implica que se evidencian a menudo escenas fantasiosas que se mezclan con la realidad. La historia hace una crítica social fuerte a la explotación y al abuso. A su vez, contiene una crítica política a la deuda externa.",
    summary: "La historia es protagonizada por Eréndira, una niña que está bajo la custodia de su abuela. Un día, por accidente, deja una vela encendida y provoca un incendio que destruye la casa de su abuela. Como consecuencia, la abuela, una mujer cruel y manipuladora, le dice que debe pagar una deuda imposible. Eréndira no tiene cómo pagar esa deuda y por ende su abuela la empieza a prostituir. Eréndira y su abuela recorren el desierto atendiendo a numerosos hombres que pagan por la niña. Durante el viaje conoce a un joven llamado Ulises, quien se enamora de ella y decide ayudarla a liberarse. En dos ocasiones intentan matar a la abuela, pero son fallidas ya que esta encuentra la manera de seguir viviendo. Finalmente logran hacerlo y Eréndira escapa (sola, dejando a Ulises) corriendo sin detenerse, buscando así su libertad.",
    characters: [
      { name: "Eréndira", role: "Es una adolescente de catorce años; en el libro la describen como muy hermosa. A lo largo de la historia comienza a tomar conciencia de la injusticia de su situación de subordinación ante su abuela. Aunque durante la mayor parte de la historia es conformista, al final todo cambia." },
      { name: "La Abuela", role: "Es una mujer autoritaria, cruel y manipuladora. Se caracteriza por su falta total de empatía y por tratar a Eréndira como si fuera su propiedad. Su principal motivación es el dinero; por este motivo, prostituye a su nieta y la explota con la excusa de que esta le debe pagar una deuda." },
      { name: "Ulises", role: "Es un joven que se enamora de Eréndira y posterior a conocerla es quien la ayuda y la incentiva a librarse de su abuela." },
    ],
    conflict: "El abuso y la explotación de Eréndira por parte de su abuela, que la obliga a prostituirse para pagar una deuda que ella misma inventó. También la lucha de Eréndira por recuperar su libertad y su identidad.",
    socialCritique: "Critica el abuso y explotación de la joven. También es una metáfora de la deuda externa latinoamericana: deudas impagables que perpetúan ciclos de explotación y dependencia económica.",
    genre: "Realismo mágico",
    color: "blood",
  },
  {
    id: "montecristo",
    title: "El Justiciero",
    subtitle: "El Conde de Montecristo",
    image: "/images/tarot-justiciero.jpg",
    author: "Alejandro Dumas",
    year: "1844",
    country: "Francia",
    context: "Esta novela, escrita por Alejandro Dumas, se publicó en 1844. Es una historia de aventuras, venganza y justicia. En este caso, leímos la novela gráfica. La obra tiene lugar en el periodo posterior a la caída de Napoleón Bonaparte. Después de su derrota, Francia atraviesa una etapa de inestabilidad política y de conflictos entre los bonapartistas y la población que apoyaba el nuevo gobierno.",
    summary: "La obra narra la vida de Edmond Dantès, un joven marinero que está a punto de convertirse en capitán de un barco y casarse con su prometida, Mercedes. No obstante, otros marineros (Danglars y Fernand) sienten envidia y lo acusan falsamente de participar en una conspiración política. Un fiscal llamado Villefort lo declara culpable para proteger sus propios intereses y Dantès es enviado injustamente al Castillo de If, una prisión en una isla en medio del mar. Durante su estadía conoce a un sabio prisionero (Abbe Faria) que le enseña múltiples conocimientos y le revela la existencia de un tesoro oculto en la isla de Montecristo. Tras la muerte del sabio, Dantès logra escapar, encuentra el tesoro y se convierte en un hombre extremadamente rico. A partir de ese momento adopta la identidad del conde de Montecristo y comienza a buscar a quienes lo traicionaron para tomar venganza contra cada uno de ellos.",
    characters: [
      { name: "Edmond Dantès / El Conde de Montecristo", role: "Al comienzo es un joven inocente. Sin embargo, después de pasar muchos años en prisión injustamente, su personalidad cambia. Se convierte en un hombre frío, decidido a vengarse de quienes lo traicionaron." },
      { name: "Los Traidores", role: "Danglars, Fernand y Villefort son los responsables del injusto encarcelamiento de su supuesto amigo, Edmond Dantès. Danglars representa la ambición, Fernand los celos y Villefort la corrupción y el abuso de poder. Cada uno representa una forma diferente de maldad dentro de la historia." },
      { name: "Abbé Faria", role: "Es un anciano prisionero que conoce a Edmond Dantès durante su encarcelamiento en el Castillo de If. Es un hombre muy sabio que actúa como maestro y mentor de Dantès. Durante los años que pasan juntos le genera muchos conocimientos al protagonista. Además, le revela la existencia de un gran tesoro escondido en la isla de Montecristo. Su influencia es fundamental en la transformación de Edmond." },
    ],
    conflict: "La lucha de Edmond Dantès por hacer justicia (o venganza) contra los hombres que arruinaron su vida injustamente. También el conflicto interno de si la venganza lo está convirtiendo en alguien tan malo como ellos.",
    socialCritique: "Critica la corrupción y la injusticia dentro del sistema judicial, mostrando cómo la envidia y el abuso de poder pueden perjudicar a alguien inocente. También critica la desigualdad social, mostrando que las personas con influencia o dinero evitan sus consecuencias.",
    genre: "Romanticismo",
    color: "ocean",
  },
  {
    id: "jekyll",
    title: "La Dualidad",
    subtitle: "El Extraño Caso del Dr. Jekyll y Mr. Hyde",
    image: "/images/tarot-dualidad.jpg",
    author: "Robert Louis Stevenson",
    year: "1886",
    country: "Escocia",
    context: "Este libro, escrito por Robert Louis Stevenson, se publicó en 1886. Tiene lugar en la época victoriana. Esta sociedad era muy estricta y las apariencias eran de suma importancia. Es una historia de terror y ciencia ficción que habla de la dualidad humana, de la teoría del alter ego y de lo que escondemos.",
    summary: "La novela es narrada de manera omnisciente desde el punto de vista de un abogado llamado Mr. Utterson, quien se muestra preocupado por su amigo, el Dr. Jekyll. Utterson descubre que Henry ha redactado un testamento en el que deja todos sus bienes a un hombre llamado Mr. Hyde, una persona con aspecto perturbador y con comportamiento violento que parece tener una inusual y extraña influencia sobre él. A medida que Utterson investiga, descubre que Hyde ha asesinado a un hombre utilizando un bastón que el mismo le regaló a su amigo. Finalmente se revela que el propio Jekyll ha creado una poción para poder separar su parte moral de una malvada con el fin de probar la dualidad humana. Cada vez que la consume, se transforma físicamente en Hyde, quien representa su personalidad maligna sin ningún tipo de control. Al principio, Jekyll disfruta esa transformación porque le permite cumplir sus más oscuros deseos. Sin embargo, con el tiempo Hyde comienza a tener más poder sobre Henry, hasta el punto de que Jekyll pierde la capacidad de controlar cuándo ocurre la transformación. Al finalizar la historia, sin posibilidad de revertir su situación, decide quitarse la vida matando así tanto a Edward Hyde como a Henry Jekyll.",
    characters: [
      { name: "Dr. Henry Jekyll", role: "Es un reconocido científico. Sin embargo, está obsesionado con la idea de que el ser humano posee dos naturalezas opuestas: una buena y una mala. Su deseo de separar estas dos partes lo lleva a realizar un experimento peligroso." },
      { name: "Mr. Edward Hyde", role: "Es la manifestación física del lado oscuro de Jekyll. Se describe como una persona pequeña, de aspecto repugnante y maligno. Hyde actúa sin misericordia y representa todos los deseos malvados que Jekyll intenta reprimir." },
      { name: "Mr. Utterson", role: "Es un abogado y amigo cercano de Jekyll. A lo largo de la historia se encarga de investigar los extraños acontecimientos relacionados con Hyde." },
    ],
    conflict: "La lucha interna entre el bien y el mal dentro de una misma persona. Jekyll quiere separar esas dos partes para ser libre, pero descubre que no puede controlar al monstruo que creó. Es como una adicción.",
    socialCritique: "Critica la hipocresía de la sociedad victoriana. Se puede ver cómo Jekyll, por mantener una buena imagen, reprime sus pensamientos. La sociedad es estricta con sus comportamientos morales y esto causa conflictos internos y actos peligrosos.",
    genre: "Realismo británico",
    color: "mystic",
  },
]

export function TarotSection() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  const colorClasses = {
    ocean: "bg-ocean/5 border-ocean/20",
    mystic: "bg-mystic/5 border-mystic/20",
    blood: "bg-blood/5 border-blood/20",
  }

  const titleColors = {
    ocean: "text-ocean",
    mystic: "text-mystic",
    blood: "text-blood",
  }

  return (
    <div className="max-w-7xl mx-auto">
      {obras.map((obra, index) => (
        <section
          key={obra.id}
          id={`obra-${obra.id}`}
          className="py-12 first:pt-0"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`rounded-3xl border-2 p-8 md:p-12 ${colorClasses[obra.color as keyof typeof colorClasses]}`}
          >
            {/* Section Header for each work */}
            <div className="text-center mb-12">
              <p className="text-primary/60 text-sm uppercase tracking-widest mb-2">
                Obra {index + 1} de 3
              </p>
              <h2 className={`font-serif text-3xl md:text-5xl mb-3 ${titleColors[obra.color as keyof typeof titleColors]}`}>
                {obra.subtitle}
              </h2>
              <p className="text-muted-foreground">
                {obra.author} • {obra.country} • {obra.year} • {obra.genre}
              </p>
              <p className="text-sm text-primary/70 mt-4 italic">
                Haz clic en la carta del tarot para revelar toda la información
              </p>
            </div>

            {/* Centered Tarot Card */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <TarotCard
                  obra={obra}
                  isSelected={selectedCard === obra.id}
                  onSelect={() => setSelectedCard(selectedCard === obra.id ? null : obra.id)}
                />
              </div>
            </div>
          </motion.div>
        </section>
      ))}
    </div>
  )
}
