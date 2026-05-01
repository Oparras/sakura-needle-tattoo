export type ServiceItem = {
  title: string;
  description: string;
  accent: string;
};

export type ProcessStep = {
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const heroContent = {
  badge: "Estudio boutique en Madrid",
  title: "Tatuajes personalizados con delicadeza y detalle",
  subtitle: "Diseño cuidado · Cita previa · Trato cercano",
  description:
    "Una propuesta íntima y elegante para transformar cada idea en una pieza sutil, equilibrada y hecha contigo.",
} as const;

export const aboutContent = {
  eyebrow: "Sobre mí",
  title: "Una forma de tatuar cercana, limpia y pensada con calma",
  intro:
    "Un espacio pensado para crear piezas personales con sensibilidad, equilibrio y atención al detalle.",
  paragraphs: [
    "Cada diseño nace de una conversación tranquila, de la observación y del cuidado por la forma, la escala y la piel.",
    "La experiencia está pensada para que te sientas acompañada de principio a fin, con un trato cercano y una atención serena al detalle.",
  ],
  highlights: [
    "Cita previa y atención personalizada",
    "Diseños equilibrados y pensados para ti",
    "Ambiente cuidado, limpio y profesional",
  ],
  imageTitle: "Retrato de la artista o del estudio",
  imageDescription:
    "Aquí puede ir una imagen editorial que refuerce la identidad del proyecto con calma y sensibilidad visual.",
} as const;

export const services: ServiceItem[] = [
  {
    title: "Tatuajes",
    description:
      "Piezas cuidadas y personalizadas, creadas para acompañarte con naturalidad.",
    accent: "01",
  },
  {
    title: "Diseño personalizado",
    description:
      "Tu idea se desarrolla con calma para encontrar una composición armónica y propia.",
    accent: "02",
  },
  {
    title: "Mini tattoos",
    description:
      "Opciones pequeñas, sutiles y elegantes para quienes buscan algo discreto.",
    accent: "03",
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

export const bookingHighlights = [
  "Consulta disponibilidad de forma rápida y cómoda.",
  "Comparte tu idea y reserva con calma, sin fricciones.",
  "Recibe la información necesaria antes de tu cita.",
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
      "Sí. Puedes traer referencias, conceptos o una idea inicial para desarrollarla contigo y darle una forma cuidada.",
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
