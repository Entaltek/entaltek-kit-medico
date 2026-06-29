import { ReactNode, useMemo, useState } from "react";

type SoapForm = {
  patientName: string;
  age: string;
  date: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
};

type SoapNoteToolProps = {
  onBack?: () => void;
};

const today = new Date().toISOString().slice(0, 10);

const initialForm: SoapForm = {
  patientName: "",
  age: "",
  date: today,
  subjective: "",
  objective: "",
  assessment: "",
  plan: "",
};

export function SoapNoteTool({ onBack }: SoapNoteToolProps) {
  const [form, setForm] = useState<SoapForm>(initialForm);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  const generatedNote = useMemo(() => {
    const patientLine = [
      form.patientName ? `Paciente: ${form.patientName}` : "Paciente: No especificado",
      form.age ? `Edad: ${form.age}` : null,
      form.date ? `Fecha: ${form.date}` : null,
    ]
      .filter(Boolean)
      .join(" - ");

    return `${patientLine}\n\nNOTA SOAP\n\nS - Subjetivo\n${form.subjective || "Sin datos registrados."}\n\nO - Objetivo\n${form.objective || "Sin datos registrados."}\n\nA - Analisis\n${form.assessment || "Sin datos registrados."}\n\nP - Plan\n${form.plan || "Sin datos registrados."}\n\nNota: Esta herramienta organiza informacion clinica. No sustituye el criterio medico ni los lineamientos institucionales.`;
  }, [form]);

  const updateField = (field: keyof SoapForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const copyNote = async () => {
    try {
      await navigator.clipboard.writeText(generatedNote);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 2200);
    } catch {
      setCopyStatus("error");
    }
  };

  const exportAsTextFile = () => {
    const blob = new Blob([generatedNote], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `nota-soap-${form.date || "consulta"}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#F7F4EF] text-[#1F2933]">
      <section className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
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
              Herramienta editable
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Nota SOAP
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#52606D]">
              Llena los campos y copia tu nota lista para el expediente.
            </p>
          </div>
        </header>

        <section className="no-print rounded-[2rem] border border-[#E5DED4] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Datos basicos</h2>
            <p className="mt-1 text-sm text-[#697586]">Estos datos ayudan a identificar la nota.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre del paciente">
              <input
                value={form.patientName}
                onChange={(event) => updateField("patientName", event.target.value)}
                placeholder="Ej. Juan Perez"
                className="input-base"
              />
            </Field>

            <Field label="Edad">
              <input
                value={form.age}
                onChange={(event) => updateField("age", event.target.value)}
                placeholder="Ej. 28 anios"
                className="input-base"
              />
            </Field>

            <Field label="Fecha">
              <input
                type="date"
                value={form.date}
                onChange={(event) => updateField("date", event.target.value)}
                className="input-base"
              />
            </Field>
          </div>

          <div className="mt-6 grid gap-4">
            <TextAreaField label="S - Subjetivo" value={form.subjective} onChange={(value) => updateField("subjective", value)} />
            <TextAreaField label="O - Objetivo" value={form.objective} onChange={(value) => updateField("objective", value)} />
            <TextAreaField label="A - Analisis" value={form.assessment} onChange={(value) => updateField("assessment", value)} />
            <TextAreaField label="P - Plan" value={form.plan} onChange={(value) => updateField("plan", value)} />
          </div>
        </section>

        <aside className="rounded-[2rem] border border-[#E5DED4] bg-[#1F2933] p-5 text-white shadow-sm sm:p-6 print-area">
          <div className="no-print mb-5">
            <h2 className="text-lg font-semibold">Vista lista para copiar</h2>
            <p className="mt-1 text-sm leading-6 text-white/65">
              Revisa antes de pegar en expediente o sistema institucional.
            </p>
          </div>

          <pre className="max-h-[620px] overflow-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-white/90 print-area">
            {generatedNote}
          </pre>

          <div className="no-print mt-5 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={copyNote} className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#1F2933] transition hover:bg-[#F7F4EF]">
              {copyStatus === "copied" ? "Nota copiada" : "Copiar nota"}
            </button>
            <button type="button" onClick={() => window.print()} className="rounded-xl bg-[#0F766E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#115E59]">
              Exportar PDF
            </button>
            <button type="button" onClick={exportAsTextFile} className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Descargar TXT
            </button>
            <button type="button" onClick={() => setForm(initialForm)} className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10">
              Limpiar
            </button>
          </div>

          {copyStatus === "error" && (
            <p className="no-print mt-3 rounded-xl bg-[#BE5A5A]/20 px-4 py-3 text-sm text-white">
              No se pudo copiar. Selecciona el texto manualmente.
            </p>
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
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Escribe aqui los datos relevantes."
        rows={5}
        className="input-base min-h-[132px] resize-y leading-6"
      />
    </label>
  );
}
