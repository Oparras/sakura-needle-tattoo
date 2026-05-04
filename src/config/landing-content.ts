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
  badge: "Estudio de tatuaje personalizado",
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
      "Piezas cuidadas y personalizadas, pensadas para acompañarte siempre.",
    accent: "01",
  },
  {
    title: "Diseño personalizado",
    description:
      "Desarrollo de una idea única adaptada a tu historia, tu zona y tu estilo.",
    accent: "02",
  },
  {
    title: "Mini tattoos",
    description:
      "Tatuajes pequeños y delicados para quienes buscan una pieza sutil y especial.",
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
      "Elige la disponibilidad que mejor te encaja, envía tu solicitud y Sara te escribirá para cerrar la hora exacta.",
  },
  {
    title: "Cuidados posteriores",
    description:
      "Tras la sesión, tendrás recomendaciones claras para sanar la pieza con calma y seguridad.",
  },
];

export const bookingHighlights = [
  "Consulta la disponibilidad real marcada por Sara en el calendario.",
  "Envía una solicitud tranquila y recibe una respuesta personal.",
  "Después concretaremos diseño, tamaño, señal y horario exacto.",
] as const;

export const faqs: FaqItem[] = [
  {
    question: "¿Cómo reservo una cita?",
    answer:
      "Puedes hacerlo desde el calendario de solicitud. Eliges una o varias franjas disponibles, envías tu idea y Sara te contactará después para concretar la cita.",
  },
  {
    question: "¿Tengo que pagar señal?",
    answer:
      "Normalmente la señal se confirma cuando Sara revisa contigo el diseño, el tamaño y la hora definitiva. El importe exacto puede ajustarse después en este mismo bloque.",
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
