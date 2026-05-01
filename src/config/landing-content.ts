export type ServiceItem = {
  title: string;
  description: string;
  accent: string;
};

export type ProcessStep = {
  title: string;
  description: string;
};

export type PortfolioItem = {
  title: string;
  caption: string;
  tag: string;
  imageSrc?: string;
  instagramEmbedUrl?: string;
  alt?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const heroContent = {
  badge: "Boutique fine line studio",
  title: "Tatuajes delicados, florales y personalizados",
  subtitle: "Fine line tattoo · Sakura inspired · Diseño personalizado",
  description:
    "Una experiencia íntima, limpia y cuidada para transformar tu idea en una pieza elegante, sutil y hecha contigo.",
} as const;

export const aboutContent = {
  eyebrow: "Sobre mí",
  title: "Una propuesta delicada, cercana y diseñada con intención",
  intro:
    "Este espacio está pensado para presentar la voz de la tatuadora, su estilo y la forma en la que acompaña cada proyecto.",
  paragraphs: [
    "Trabajo cada diseño desde la escucha, la sutileza y el cuidado del detalle. La idea es que cada tatuaje conserve una estética limpia y atemporal, manteniendo la esencia fine line en cada trazo.",
    "La experiencia se plantea de forma cercana y guiada: desde la primera conversación hasta el seguimiento de los cuidados posteriores. Todo el proceso se adapta a la piel, a la zona y al estilo de cada persona.",
  ],
  highlights: [
    "Diseños finos y florales con composición personalizada",
    "Trato uno a uno, ritmo sereno y asesoramiento claro",
    "Atención a la colocación, la escala y la armonía visual",
    "Enfoque higiénico, profesional y delicado de principio a fin",
  ],
  imageTitle: "Foto de la artista o del estudio",
  imageDescription:
    "Sustituye este bloque por un retrato, una foto del estudio o una imagen editorial que refuerce el universo de marca.",
} as const;

export const services: ServiceItem[] = [
  {
    title: "Fine line tattoo",
    description:
      "Piezas de línea fina, limpias y sutiles, pensadas para envejecer con elegancia.",
    accent: "01",
  },
  {
    title: "Floral tattoo",
    description:
      "Composiciones botánicas delicadas inspiradas en flores, ramas y movimiento orgánico.",
    accent: "02",
  },
  {
    title: "Flash tattoos",
    description:
      "Diseños seleccionados listos para tatuar, con la identidad visual del estudio.",
    accent: "03",
  },
  {
    title: "Diseño personalizado",
    description:
      "Desarrollo desde cero de una idea propia, adaptada a tu historia, zona y estilo.",
    accent: "04",
  },
  {
    title: "Mini tattoos",
    description:
      "Tatuajes pequeños y refinados para quienes buscan una pieza discreta y especial.",
    accent: "05",
  },
];

export const processSteps: ProcessStep[] = [
  {
    title: "Cuéntame tu idea",
    description:
      "Compártela con referencias, intención, tamaño aproximado y zona del cuerpo.",
  },
  {
    title: "Diseño personalizado",
    description:
      "Se estudia la composición y se prepara una propuesta alineada con tu estilo.",
  },
  {
    title: "Reserva tu cita",
    description:
      "Bloquea fecha y hora mediante la plataforma externa de booking y recibe la información clave.",
  },
  {
    title: "Cuidados posteriores",
    description:
      "Tras la sesión, tendrás recomendaciones claras para sanar la pieza con calma y seguridad.",
  },
];

export const portfolioItems: PortfolioItem[] = [
  {
    title: "Composición floral vertical",
    caption: "Placeholder listo para sustituirse por imagen real o embed.",
    tag: "Fine line",
  },
  {
    title: "Mini tattoo botánico",
    caption: "Ideal para piezas sutiles, muñeca, clavícula o tobillo.",
    tag: "Mini",
  },
  {
    title: "Flash delicado",
    caption: "Un bloque preparado para mostrar flash disponible o colecciones temporales.",
    tag: "Flash",
  },
  {
    title: "Diseño editorial",
    caption: "Perfecto para sustituirlo por fotografía macro con fondo limpio.",
    tag: "Custom",
  },
  {
    title: "Ramo Sakura",
    caption: "Componente preparado para futuras imágenes cuadradas o verticales.",
    tag: "Floral",
  },
  {
    title: "Tattoo placement",
    caption: "Puedes usarlo para mockups, healed tattoos o capturas de Instagram.",
    tag: "Studio",
  },
];

export const bookingHighlights = [
  "Reserva externa fácil de actualizar sin tocar la maquetación.",
  "CTA preparada para abrir Calendly o SimplyBook.me en una nueva pestaña.",
  "Espacio reservado para integrar el iframe cuando quieras activarlo.",
] as const;

export const faqs: FaqItem[] = [
  {
    question: "¿Cómo reservo una cita?",
    answer:
      "Puedes hacerlo desde el botón de reserva. La web te enviará a la herramienta externa de booking para escoger fecha y completar tu solicitud.",
  },
  {
    question: "¿Tengo que pagar señal?",
    answer:
      "Sí, normalmente se solicita una señal para bloquear la cita. El importe y las condiciones exactas pueden editarse fácilmente en este bloque cuando definas la política final.",
  },
  {
    question: "¿Puedo llevar una idea propia?",
    answer:
      "Sí. Puedes traer referencias, conceptos o una idea inicial para trabajarla y convertirla en un diseño alineado con el estilo del estudio.",
  },
  {
    question: "¿Cómo preparo la piel antes de tatuarme?",
    answer:
      "Se recomienda llegar con la piel limpia, bien hidratada los días previos y evitando irritaciones, exposición intensa al sol o productos agresivos justo antes de la cita.",
  },
  {
    question: "¿Qué cuidados debo seguir después?",
    answer:
      "Después de tatuarte recibirás una pauta clara de limpieza, hidratación y protección para ayudar a una curación bonita y segura.",
  },
  {
    question: "¿Puedo cancelar o cambiar mi cita?",
    answer:
      "Sí, siguiendo la política de cambios y cancelaciones del estudio. Este texto también queda preparado para ajustarlo cuando fijes las condiciones exactas.",
  },
];
