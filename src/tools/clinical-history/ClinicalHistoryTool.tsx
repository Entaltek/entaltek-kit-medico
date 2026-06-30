import { ReactNode, useMemo, useState } from "react";
import { useLocalDraft } from "../../hooks/useLocalDraft";

type ClinicalHistoryForm = {
  patientName: string;
  age: string;
  date: string;
  sex: string;
  occupation: string;
  chiefComplaint: string;
  familyHistory: string;
  pathologicalHistory: string;
  nonPathologicalHistory: string;
  allergies: string;
  currentMedication: string;
  currentCondition: string;
  physicalExam: string;
  clinicalImpression: string;
  plan: string;
};

type ClinicalHistoryToolProps = {
  onBack?: () => void;
};

const today = new Date().toISOString().slice(0, 10);

const initialForm: ClinicalHistoryForm = {
  patientName: "",
  age: "",
  date: today,
  sex: "",
  occupation: "",
  chiefComplaint: "",
  familyHistory: "",
  pathologicalHistory: "",
  nonPathologicalHistory: "",
  allergies: "",
  currentMedication: "",
  currentCondition: "",
  physicalExam: "",
  clinicalImpression: "",
  plan: "",
};

export function ClinicalHistoryTool({ onBack }: ClinicalHistoryToolProps) {
  const { value: form, setValue: setForm, clearDraft } = useLocalDraft<ClinicalHistoryForm>("kit-medico:clinical-history-draft", initialForm);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  const generatedHistory = useMemo(() => {
    return `HISTORIA CLINICA\n\nFicha de identificacion\nPaciente: ${form.patientName || "No especificado"}\nEdad: ${form.age || "No especificada"}\nSexo: ${form.sex || "No especificado"}\nOcupacion: ${form.occupation || "No especificada"}\nFecha: ${form.date || "No especificada"}\n\nMotivo de consulta\n${form.chiefComplaint || "Sin datos registrados."}\n\nAntecedentes heredofamiliares\n${form.familyHistory || "Sin datos registrados."}\n\nAntecedentes personales patologicos\n${form.pathologicalHistory || "Sin datos registrados."}\n\nAntecedentes personales no patologicos\n${form.nonPathologicalHistory || "Sin datos registrados."}\n\nAlergias\n${form.allergies || "Sin datos registrados."}\n\nMedicamentos actuales\n${form.currentMedication || "Sin datos registrados."}\n\nPadecimiento actual\n${form.currentCondition || "Sin datos registrados."}\n\nExploracion fisica\n${form.physicalExam || "Sin datos registrados."}\n\nImpresion clinica\n${form.clinicalImpression || "Sin datos registrados."}\n\nPlan\n${form.plan || "Sin datos registrados."}\n\nNota: Esta herramienta organiza informacion clinica. No sustituye el criterio medico ni lineamientos institucionales.`;
  }, [form]);

  const updateField = (field: keyof ClinicalHistoryForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const copyHistory = async () => {
    try {
      await navigator.clipboard.writeText(generatedHistory);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 2200);
    } catch {
      setCopyStatus("error");
    }
  };

  const exportAsTextFile = () => {
    const blob = new Blob([generatedHistory], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `historia-clinica-${form.date || "consulta"}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#F7F4EF] text-[#1F2933]">
      <section className="mx-auto grid w-full max-w-[1440px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-10 xl:px-12">
        <header className="no-print lg:col-span-2">
          <button
            type="button"
            onClick={onBack}
            className="mb-4 rounded-full border border-[#E5DED4] bg-white px-4 py-2 text-sm font-medium text-[#52606D] transition hover:border-[#0F766E] hover:text-[#0F766E]"
          >
            Volver al kit
          </button>

          <div className="rounded-[2rem] border border-[#E5DED4] bg-white p-5 shadow-sm sm:p-7">
            <span className="inline-flex rounded-full bg-[#E6F3EF] px-3 py-1 text-xs font-semibold text-[#115E59]">
              Formato editable
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Historia clinica
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[#52606D]">
              Captura antecedentes, padecimiento actual, exploracion e impresion clinica en un formato listo para copiar.
            </p>
          </div>
        </header>

        <section className="no-print rounded-[2rem] border border-[#E5DED4] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Ficha y antecedentes</h2>
            <p className="mt-1 text-sm text-[#697586]">Usa solo los campos que apliquen. Lo vacio aparecera como no registrado.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Field label="Nombre del paciente"><input value={form.patientName} onChange={(event) => updateField("patientName", event.target.value)} placeholder="Ej. Juan Perez" className="input-base" /></Field>
            <Field label="Edad"><input value={form.age} onChange={(event) => updateField("age", event.target.value)} placeholder="Ej. 28 anios" className="input-base" /></Field>
            <Field label="Fecha"><input type="date" value={form.date} onChange={(event) => updateField("date", event.target.value)} className="input-base" /></Field>
            <Field label="Sexo"><input value={form.sex} onChange={(event) => updateField("sex", event.target.value)} placeholder="Ej. Femenino" className="input-base" /></Field>
            <Field label="Ocupacion"><input value={form.occupation} onChange={(event) => updateField("occupation", event.target.value)} placeholder="Ej. Estudiante" className="input-base" /></Field>
            <Field label="Motivo de consulta"><input value={form.chiefComplaint} onChange={(event) => updateField("chiefComplaint", event.target.value)} placeholder="Ej. Dolor abdominal" className="input-base" /></Field>
          </div>

          <div className="mt-6 grid gap-4">
            <TextAreaField label="Antecedentes heredofamiliares" value={form.familyHistory} onChange={(value) => updateField("familyHistory", value)} />
            <TextAreaField label="Antecedentes personales patologicos" value={form.pathologicalHistory} onChange={(value) => updateField("pathologicalHistory", value)} />
            <TextAreaField label="Antecedentes personales no patologicos" value={form.nonPathologicalHistory} onChange={(value) => updateField("nonPathologicalHistory", value)} />
            <TextAreaField label="Alergias" value={form.allergies} onChange={(value) => updateField("allergies", value)} />
            <TextAreaField label="Medicamentos actuales" value={form.currentMedication} onChange={(value) => updateField("currentMedication", value)} />
            <TextAreaField label="Padecimiento actual" value={form.currentCondition} onChange={(value) => updateField("currentCondition", value)} />
            <TextAreaField label="Exploracion fisica" value={form.physicalExam} onChange={(value) => updateField("physicalExam", value)} />
            <TextAreaField label="Impresion clinica" value={form.clinicalImpression} onChange={(value) => updateField("clinicalImpression", value)} />
            <TextAreaField label="Plan" value={form.plan} onChange={(value) => updateField("plan", value)} />
          </div>
        </section>

        <aside className="rounded-[2rem] border border-[#E5DED4] bg-[#1F2933] p-5 text-white shadow-sm sm:p-6 lg:sticky lg:top-5 lg:self-start print-area">
          <div className="no-print mb-5">
            <h2 className="text-lg font-semibold">Vista lista para copiar</h2>
            <p className="mt-1 text-sm leading-6 text-white/65">Revisa antes de pegar en expediente o imprimir.</p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
              Borrador guardado en este dispositivo
            </p>
          </div>

          <pre className="max-h-[720px] overflow-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-white/90 print-area">
            {generatedHistory}
          </pre>

          <div className="no-print mt-5 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={copyHistory} className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#1F2933] transition hover:bg-[#F7F4EF]">
              {copyStatus === "copied" ? "Historia copiada" : "Copiar historia"}
            </button>
            <button type="button" onClick={() => window.print()} className="rounded-xl bg-[#0F766E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#115E59]">
              Exportar PDF
            </button>
            <button type="button" onClick={exportAsTextFile} className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Descargar TXT
            </button>
            <button type="button" onClick={clearDraft} className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10">
              Limpiar borrador
            </button>
          </div>

          {copyStatus === "error" && (
            <p className="no-print mt-3 rounded-xl bg-[#BE5A5A]/20 px-4 py-3 text-sm text-white">No se pudo copiar. Selecciona el texto manualmente.</p>
          )}
        </aside>
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="label-base">{label}</span>
      {children}
    </label>
  );
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="label-base">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder="Escribe aqui los datos relevantes." rows={4} className="input-base min-h-[112px] resize-y leading-6" />
    </label>
  );
}
