export type SoapTemplate = {
  id: string;
  label: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
};

export const soapTemplates: SoapTemplate[] = [
  {
    id: "general",
    label: "Consulta general",
    subjective: "Paciente acude por motivo referido. Niega datos de alarma al interrogatorio dirigido, salvo lo documentado.",
    objective: "Paciente consciente y orientado. Exploracion fisica dirigida de acuerdo con motivo de consulta.",
    assessment: "Problema clinico en evaluacion. Se integra impresion clinica con interrogatorio y exploracion.",
    plan: "Se explica plan, datos de alarma y criterios de revaloracion. Seguimiento segun evolucion.",
  },
  {
    id: "respiratory",
    label: "Sintomas respiratorios",
    subjective: "Paciente refiere sintomas respiratorios. Interrogar fiebre, tos, disnea, dolor toracico y exposiciones.",
    objective: "Registrar signos vitales y exploracion respiratoria dirigida. Documentar SpO2 si esta disponible.",
    assessment: "Cuadro respiratorio en evaluacion. Valorar gravedad y necesidad de referencia segun hallazgos.",
    plan: "Indicar medidas generales, datos de alarma respiratoria y seguimiento. Ajustar a guias locales.",
  },
  {
    id: "chronic-control",
    label: "Control cronico",
    subjective: "Paciente acude a seguimiento. Revisar adherencia, sintomas actuales, efectos adversos y automonitoreo.",
    objective: "Registrar signos vitales, peso y hallazgos dirigidos. Revisar estudios disponibles y metas de control.",
    assessment: "Padecimiento cronico en seguimiento. Control actual segun parametros clinicos y laboratorios.",
    plan: "Reforzar medidas generales, adherencia, datos de alarma y proximo control.",
  },
];
