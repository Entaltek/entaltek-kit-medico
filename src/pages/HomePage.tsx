import { useMemo, useState } from "react";

export type ToolId = "soap";

type HomePageProps = {
  onOpenTool?: (toolId: ToolId) => void;
};

const tools = [
  {
    id: "soap" as const,
    title: "Nota SOAP",
    description: "Llena los campos y copia tu nota lista para el expediente.",
    tag: "Editable",
    status: "Listo",
  },
  {
    id: "historia-clinica",
    title: "Historia Clinica",
    description: "Formato base para antecedentes, interrogatorio y exploracion.",
    tag: "Formato",
    status: "Proximamente",
  },
  {
    id: "exploracion",
    title: "Exploracion fisica",
    description: "Checklists por sistema para consulta de primer contacto.",
    tag: "Checklist",
    status: "Proximamente",
  },
  {
    id: "referencia",
    title: "Referencia y contrarreferencia",
    description: "Formato para enviar pacientes con datos claros y completos.",
    tag: "Formato",
    status: "Proximamente",
  },
];

export function HomePage({ onOpenTool }: HomePageProps) {
  const [query, setQuery] = useState("");

  const filteredTools = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return tools;

    return tools.filter((tool) =>
      `${tool.title} ${tool.description} ${tool.tag}`.toLowerCase().includes(value),
    );
  }, [query]);

  return (
    <main className="min-h-screen bg-[#F7F4EF] text-[#1F2933]">
      <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0F766E]">
            Kit clinico practico
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
            Kit del Medico de Primer Nivel
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#52606D] sm:text-lg">
            Herramientas clinicas listas para consulta, guardia y primer contacto.
            No reemplaza tu criterio clinico; te ayuda a ordenar la informacion.
          </p>
        </header>

        <section className="mb-6 rounded-[2rem] border border-[#E5DED4] bg-white p-5 shadow-sm sm:p-8">
          <span className="inline-flex rounded-full bg-[#E6F3EF] px-3 py-1 text-xs font-semibold text-[#115E59]">
            Empieza con Nota SOAP
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">
            Llena, revisa, copia y pega en expediente.
          </h2>
          <button
            type="button"
            onClick={() => onOpenTool?.("soap")}
            className="mt-5 rounded-xl bg-[#0F766E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#115E59]"
          >
            Abrir Nota SOAP
          </button>
        </section>

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Busca: SOAP, historia, referencia..."
          className="mb-5 w-full rounded-2xl border border-[#E5DED4] bg-white px-4 py-3 text-base outline-none transition placeholder:text-[#9AA4B2] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10"
        />

        <section className="grid gap-3 pb-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => {
            const isReady = tool.status === "Listo";

            return (
              <article
                key={tool.id}
                className="rounded-3xl border border-[#E5DED4] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#F7F4EF] px-3 py-1 text-xs font-semibold text-[#52606D]">
                    {tool.tag}
                  </span>
                  <span className="rounded-full bg-[#E6F3EF] px-3 py-1 text-xs font-semibold text-[#115E59]">
                    {tool.status}
                  </span>
                </div>

                <h3 className="text-lg font-semibold tracking-tight">{tool.title}</h3>
                <p className="mt-2 min-h-[64px] text-sm leading-6 text-[#697586]">
                  {tool.description}
                </p>

                <button
                  type="button"
                  disabled={!isReady}
                  onClick={() => isReady && onOpenTool?.("soap")}
                  className={[
                    "mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold transition",
                    isReady
                      ? "bg-[#0F766E] text-white hover:bg-[#115E59]"
                      : "cursor-not-allowed bg-[#F3EEE7] text-[#9AA4B2]",
                  ].join(" ")}
                >
                  {isReady ? "Abrir herramienta" : "Disponible pronto"}
                </button>
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
}
