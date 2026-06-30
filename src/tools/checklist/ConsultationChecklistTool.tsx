import { useMemo, useState } from "react";

type ChecklistItem = {
  id: string;
  label: string;
  helper: string;
};

type ConsultationChecklistToolProps = {
  onBack?: () => void;
};

const checklistItems: ChecklistItem[] = [
  {
    id: "reason",
    label: "Motivo de consulta registrado",
    helper: "Que quede claro por que acude hoy y desde cuando.",
  },
  {
    id: "allergies",
    label: "Alergias preguntadas",
    helper: "Medicamentos, alimentos, latex u otras reacciones relevantes.",
  },
  {
    id: "meds",
    label: "Medicamentos actuales revisados",
    helper: "Incluye dosis, automedicacion y tratamientos recientes.",
  },
  {
    id: "vitals",
    label: "Signos vitales documentados",
    helper: "TA, FC, FR, temperatura, peso y SpO2 si aplica.",
  },
  {
    id: "exam",
    label: "Exploracion dirigida documentada",
    helper: "Solo lo relevante para el problema actual, pero con estructura.",
  },
  {
    id: "impression",
    label: "Impresion clinica o problema activo",
    helper: "Describe el problema principal sin sobreexplicar.",
  },
  {
    id: "plan",
    label: "Plan explicado al paciente",
    helper: "Tratamiento, medidas generales, estudios y seguimiento.",
  },
  {
    id: "alarm",
    label: "Datos de alarma indicados",
    helper: "Senales por las que debe regresar o acudir a urgencias.",
  },
  {
    id: "followup",
    label: "Seguimiento definido",
    helper: "Fecha, condicion o criterio para revaloracion.",
  },
];

export function ConsultationChecklistTool({ onBack }: ConsultationChecklistToolProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [note, setNote] = useState("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  const completed = useMemo(
    () => checklistItems.filter((item) => checked[item.id]).length,
    [checked],
  );

  const progress = Math.round((completed / checklistItems.length) * 100);

  const summary = useMemo(() => {
    const doneItems = checklistItems
      .filter((item) => checked[item.id])
      .map((item) => `- ${item.label}`)
      .join("\n");

    const pendingItems = checklistItems
      .filter((item) => !checked[item.id])
      .map((item) => `- ${item.label}`)
      .join("\n");

    return `CHECKLIST DE CIERRE DE CONSULTA\n\nCompletado: ${completed}/${checklistItems.length} (${progress}%)\n\nRealizado:\n${doneItems || "- Sin elementos marcados."}\n\nPendiente:\n${pendingItems || "- Sin pendientes."}\n\nNotas:\n${note || "Sin notas adicionales."}`;
  }, [checked, completed, note, progress]);

  const toggleItem = (id: string) => {
    setChecked((current) => ({ ...current, [id]: !current[id] }));
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 2200);
    } catch {
      setCopyStatus("error");
    }
  };

  return (
    <main className="km-anim-screen min-h-screen bg-[#F7F4EF] text-[#1F2933]">
      <section className="mx-auto grid w-full max-w-[1440px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-10 xl:px-12">
        <header className="lg:col-span-2">
          <button
            type="button"
            onClick={onBack}
            className="km-press km-focus mb-4 rounded-full border border-[#E5DED4] bg-white px-4 py-2 text-sm font-medium text-[#52606D] hover:border-[#0F766E] hover:text-[#0F766E]"
          >
            Volver al kit
          </button>

          <div className="rounded-[2rem] border border-[#E5DED4] bg-white p-5 shadow-sm sm:p-7">
            <span className="inline-flex rounded-full bg-[#E6F3EF] px-3 py-1 text-xs font-semibold text-[#115E59]">
              Checklist practico
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Checklist de consulta
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#52606D]">
              Revisa lo esencial antes de cerrar la consulta. Rapido, claro y sin ruido.
            </p>
          </div>
        </header>

        <section className="rounded-[2rem] border border-[#E5DED4] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Cierre seguro</h2>
              <p className="mt-1 text-sm text-[#697586]">
                Marca lo que ya revisaste durante la consulta.
              </p>
            </div>
            <div className="rounded-2xl bg-[#E6F3EF] px-4 py-3 text-center text-[#115E59]">
              <p className="text-2xl font-semibold">{progress}%</p>
              <p className="text-xs font-semibold">completo</p>
            </div>
          </div>

          <div className="grid gap-3">
            {checklistItems.map((item) => {
              const isChecked = Boolean(checked[item.id]);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-pressed={isChecked}
                  className={[
                    "km-focus rounded-2xl border p-4 text-left transition duration-200 active:scale-[0.99]",
                    isChecked
                      ? "border-[#0F766E] bg-[#E6F3EF]"
                      : "border-[#E5DED4] bg-white hover:-translate-y-0.5 hover:border-[#A7C4B5] hover:shadow-sm",
                  ].join(" ")}
                >
                  <div className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className={[
                        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                        isChecked
                          ? "border-[#0F766E] bg-[#0F766E] text-white"
                          : "border-[#CBD5E1] text-transparent",
                      ].join(" ")}
                    >
                      OK
                    </span>
                    <div>
                      <p className="font-semibold text-[#1F2933]">{item.label}</p>
                      <p className="mt-1 text-sm leading-6 text-[#697586]">{item.helper}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="rounded-[2rem] border border-[#E5DED4] bg-[#1F2933] p-5 text-white shadow-sm sm:p-6 lg:sticky lg:top-5 lg:self-start">
          <h2 className="text-lg font-semibold">Resumen</h2>
          <p className="mt-1 text-sm leading-6 text-white/65">
            Puedes copiarlo como recordatorio o usarlo para documentar pendientes.
          </p>

          <label className="mt-5 grid gap-2">
            <span className="text-sm font-semibold text-white/80">Notas adicionales</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Ej. Paciente entiende plan y datos de alarma."
              rows={5}
              className="w-full resize-y rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/40"
            />
          </label>

          <pre className="mt-5 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-white/90">
            {summary}
          </pre>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={copySummary}
              className="km-press km-focus-dark rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#1F2933] hover:bg-[#F7F4EF]"
            >
              {copyStatus === "copied" ? "Resumen copiado" : "Copiar resumen"}
            </button>
            <button
              type="button"
              onClick={() => {
                setChecked({});
                setNote("");
              }}
              className="km-press km-focus-dark rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/10"
            >
              Reiniciar
            </button>
          </div>

          {copyStatus === "error" && (
            <p className="mt-3 rounded-xl bg-[#BE5A5A]/20 px-4 py-3 text-sm text-white">
              No se pudo copiar. Selecciona el texto manualmente.
            </p>
          )}
        </aside>
      </section>
    </main>
  );
}
