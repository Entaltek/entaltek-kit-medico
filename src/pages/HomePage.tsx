import { useMemo, useState } from "react";
import { ToolCategoryId, ToolDefinition, ToolId, toolCategories, tools } from "../content/tools";

type HomePageProps = {
  onOpenTool?: (toolId: ToolId) => void;
};

export function HomePage({ onOpenTool }: HomePageProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategoryId>("todos");

  const readyCount = tools.filter((tool) => tool.status === "Listo").length;

  const filteredTools = useMemo(() => {
    const value = query.trim().toLowerCase();

    return tools.filter((tool) => {
      const matchesSearch =
        !value ||
        `${tool.title} ${tool.description} ${tool.tag}`.toLowerCase().includes(value);
      const matchesCategory =
        activeCategory === "todos" || tool.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, query]);

  const openTool = (tool: ToolDefinition) => {
    if (tool.status !== "Listo") return;
    onOpenTool?.(tool.id);
  };

  return (
    <main className="min-h-screen bg-[#F7F4EF] text-[#1F2933]">
      <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
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
          </div>

          <div className="hidden rounded-2xl border border-[#E5DED4] bg-white px-4 py-3 text-right shadow-sm sm:block">
            <p className="text-2xl font-semibold text-[#0F766E]">{readyCount}</p>
            <p className="text-xs font-semibold text-[#697586]">herramientas listas</p>
          </div>
        </header>

        <section className="mb-6 overflow-hidden rounded-[2rem] border border-[#E5DED4] bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-5 sm:p-8">
              <span className="inline-flex rounded-full bg-[#E6F3EF] px-3 py-1 text-xs font-semibold text-[#115E59]">
                Para medicos jovenes en primer contacto
              </span>
              <h2 className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight sm:text-4xl">
                Abre, llena, copia y sigue con la consulta.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#697586] sm:text-base">
                El MVP empieza con Nota SOAP y Checklist de consulta. Lo siguiente sera historia clinica, formatos y seguimiento de cronicos.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => onOpenTool?.("soap")}
                  className="rounded-xl bg-[#0F766E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#115E59]"
                >
                  Abrir Nota SOAP
                </button>
                <button
                  type="button"
                  onClick={() => onOpenTool?.("consultation-checklist")}
                  className="rounded-xl border border-[#E5DED4] bg-white px-4 py-3 text-sm font-semibold text-[#52606D] transition hover:border-[#0F766E] hover:text-[#0F766E]"
                >
                  Abrir checklist
                </button>
              </div>
            </div>

            <div className="bg-[#1F2933] p-5 text-white sm:p-8">
              <p className="text-sm font-semibold text-white/60">Uso recomendado</p>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-white/80">
                <li>1. Captura lo minimo indispensable.</li>
                <li>2. Revisa que el plan y alarmas queden claros.</li>
                <li>3. Copia la nota al expediente o imprime PDF.</li>
              </ul>
              <p className="mt-5 rounded-2xl bg-white/10 p-4 text-xs leading-5 text-white/65">
                Esta app organiza informacion. No sustituye guias, normas, protocolos institucionales ni juicio medico.
              </p>
            </div>
          </div>
        </section>

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Busca: SOAP, diabetes, referencia..."
          className="mb-4 w-full rounded-2xl border border-[#E5DED4] bg-white px-4 py-3 text-base outline-none transition placeholder:text-[#9AA4B2] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10"
        />

        <nav className="mb-5 flex gap-2 overflow-x-auto pb-1" aria-label="Categorias de herramientas">
          {toolCategories.map((category) => {
            const isActive = category.id === activeCategory;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={[
                  "whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition",
                  isActive
                    ? "bg-[#1F2933] text-white"
                    : "border border-[#E5DED4] bg-white text-[#52606D] hover:border-[#0F766E] hover:text-[#0F766E]",
                ].join(" ")}
              >
                {category.label}
              </button>
            );
          })}
        </nav>

        <section className="grid gap-3 pb-24 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => {
            const isReady = tool.status === "Listo";

            return (
              <article
                key={tool.id}
                className="rounded-3xl border border-[#E5DED4] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#A7C4B5] hover:shadow-md"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#F7F4EF] px-3 py-1 text-xs font-semibold text-[#52606D]">
                    {tool.tag}
                  </span>
                  <span
                    className={[
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      isReady
                        ? "bg-[#E6F3EF] text-[#115E59]"
                        : "bg-[#F3EEE7] text-[#8A6A3C]",
                    ].join(" ")}
                  >
                    {tool.status}
                  </span>
                </div>

                <h3 className="text-lg font-semibold tracking-tight">{tool.title}</h3>
                <p className="mt-2 min-h-[72px] text-sm leading-6 text-[#697586]">
                  {tool.description}
                </p>

                <button
                  type="button"
                  disabled={!isReady}
                  onClick={() => openTool(tool)}
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

        <footer className="fixed inset-x-0 bottom-0 border-t border-[#E5DED4] bg-white/90 px-4 py-3 backdrop-blur sm:hidden">
          <div className="mx-auto grid max-w-md grid-cols-3 gap-2 text-xs font-medium text-[#697586]">
            <button className="rounded-xl bg-[#E6F3EF] px-3 py-2 text-[#115E59]">Herramientas</button>
            <button className="rounded-xl px-3 py-2">Guardadas</button>
            <button className="rounded-xl px-3 py-2">Aviso</button>
          </div>
        </footer>
      </section>
    </main>
  );
}
