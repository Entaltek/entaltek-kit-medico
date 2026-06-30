export type ToolId =
  | "soap"
  | "consultation-checklist"
  | "historia-clinica"
  | "exploracion-fisica"
  | "consentimiento"
  | "prenatal"
  | "diabetes"
  | "hipertension"
  | "crecimiento"
  | "salud-mental"
  | "referencia";

export type ToolCategoryId =
  | "todos"
  | "consulta"
  | "formatos"
  | "seguimiento"
  | "tamizaje"
  | "referencia";

export type ToolStatus = "Listo" | "Próximamente";

export type ToolDefinition = {
  id: ToolId;
  title: string;
  description: string;
  category: Exclude<ToolCategoryId, "todos">;
  tag: string;
  status: ToolStatus;
};

export const toolCategories: Array<{ id: ToolCategoryId; label: string }> = [
  { id: "todos", label: "Todo" },
  { id: "consulta", label: "Consulta" },
  { id: "formatos", label: "Formatos" },
  { id: "seguimiento", label: "Seguimiento" },
  { id: "tamizaje", label: "Tamizaje" },
  { id: "referencia", label: "Referencia" },
];

export const tools: ToolDefinition[] = [
  {
    id: "soap",
    title: "Nota SOAP",
    description: "Ordena subjetivo, objetivo, análisis y plan en una nota lista para copiar.",
    category: "consulta",
    tag: "Editable",
    status: "Listo",
  },
  {
    id: "consultation-checklist",
    title: "Checklist de consulta",
    description: "Revisa datos clave antes de cerrar la consulta: alergias, signos vitales, plan y alarmas.",
    category: "consulta",
    tag: "Checklist",
    status: "Listo",
  },
  {
    id: "historia-clinica",
    title: "Historia clínica",
    description: "Formato base para antecedentes, interrogatorio, exploración e impresión clínica.",
    category: "formatos",
    tag: "Formato",
    status: "Listo",
  },
  {
    id: "exploracion-fisica",
    title: "Exploración física",
    description: "Listas por sistema para documentar hallazgos sin perder estructura.",
    category: "consulta",
    tag: "Checklist",
    status: "Próximamente",
  },
  {
    id: "consentimiento",
    title: "Consentimiento informado",
    description: "Plantillas breves para procedimientos frecuentes de primer contacto.",
    category: "formatos",
    tag: "Plantilla",
    status: "Próximamente",
  },
  {
    id: "prenatal",
    title: "Control prenatal",
    description: "Guía de seguimiento, datos de alarma y registro básico de control.",
    category: "seguimiento",
    tag: "Guía",
    status: "Próximamente",
  },
  {
    id: "diabetes",
    title: "Diabetes",
    description: "Hoja de control para metas, tratamiento, laboratorios y seguimiento.",
    category: "seguimiento",
    tag: "Crónicos",
    status: "Próximamente",
  },
  {
    id: "hipertension",
    title: "Hipertensión",
    description: "Registro simple para presión arterial, riesgo y plan de manejo.",
    category: "seguimiento",
    tag: "Crónicos",
    status: "Próximamente",
  },
  {
    id: "crecimiento",
    title: "Crecimiento y desarrollo",
    description: "Control pediátrico con campos de seguimiento por edad.",
    category: "seguimiento",
    tag: "Pediatría",
    status: "Próximamente",
  },
  {
    id: "salud-mental",
    title: "Salud mental",
    description: "Tamizajes breves para ansiedad, depresión y riesgo psicosocial.",
    category: "tamizaje",
    tag: "Tamizaje",
    status: "Próximamente",
  },
  {
    id: "referencia",
    title: "Referencia y contrarreferencia",
    description: "Formato práctico para enviar pacientes con datos clínicos completos.",
    category: "referencia",
    tag: "Formato",
    status: "Próximamente",
  },
];
