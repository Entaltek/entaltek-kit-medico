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

export type ToolStatus = "Listo" | "Proximamente";

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
    description: "Ordena subjetivo, objetivo, analisis y plan en una nota lista para copiar.",
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
    title: "Historia clinica",
    description: "Formato base para antecedentes, interrogatorio, exploracion e impresion clinica.",
    category: "formatos",
    tag: "Formato",
    status: "Listo",
  },
  {
    id: "exploracion-fisica",
    title: "Exploracion fisica",
    description: "Listas por sistema para documentar hallazgos sin perder estructura.",
    category: "consulta",
    tag: "Checklist",
    status: "Proximamente",
  },
  {
    id: "consentimiento",
    title: "Consentimiento informado",
    description: "Plantillas breves para procedimientos frecuentes de primer contacto.",
    category: "formatos",
    tag: "Plantilla",
    status: "Proximamente",
  },
  {
    id: "prenatal",
    title: "Control prenatal",
    description: "Guia de seguimiento, datos de alarma y registro basico de control.",
    category: "seguimiento",
    tag: "Guia",
    status: "Proximamente",
  },
  {
    id: "diabetes",
    title: "Diabetes",
    description: "Hoja de control para metas, tratamiento, laboratorios y seguimiento.",
    category: "seguimiento",
    tag: "Cronicos",
    status: "Proximamente",
  },
  {
    id: "hipertension",
    title: "Hipertension",
    description: "Registro simple para presion arterial, riesgo y plan de manejo.",
    category: "seguimiento",
    tag: "Cronicos",
    status: "Proximamente",
  },
  {
    id: "crecimiento",
    title: "Crecimiento y desarrollo",
    description: "Control pediatrico con campos de seguimiento por edad.",
    category: "seguimiento",
    tag: "Pediatria",
    status: "Proximamente",
  },
  {
    id: "salud-mental",
    title: "Salud mental",
    description: "Tamizajes breves para ansiedad, depresion y riesgo psicosocial.",
    category: "tamizaje",
    tag: "Tamizaje",
    status: "Proximamente",
  },
  {
    id: "referencia",
    title: "Referencia y contrarreferencia",
    description: "Formato practico para enviar pacientes con datos clinicos completos.",
    category: "referencia",
    tag: "Formato",
    status: "Proximamente",
  },
];
