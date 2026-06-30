import { ReactNode, useEffect, useMemo, useState } from "react";
import { ToolCategoryId, ToolDefinition, ToolId, toolCategories, tools } from "../content/tools";
import { BackendHealth, getBackendHealth } from "../lib/api";

type HomePageProps = {
  onOpenTool?: (toolId: ToolId) => void;
};

type BackendStatus = "checking" | "online" | "offline";

export function HomePage({ onOpenTool }: HomePageProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategoryId>("todos");
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("checking");
  const [backendHealth, setBackendHealth] = useState<BackendHealth | null>(null);

  const readyCount = tools.filter((tool) => tool.status === "Listo").length;

  useEffect(() => {
    let isMounted = true;

    getBackendHealth()
      .then((health) => {
        if (!isMounted) return;
        setBackendHealth(health);
        setBackendStatus("online");
      })
      .catch(() => {
        if (!isMounted) return;
        setBackendHealth(null);
        setBackendStatus("offline");
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

  const backendLabel = {
    checking: "Revisando API",
    online: "API conectada",
    offline: "Modo local",
  }[backendStatus];

  const apiBadgeTone: BadgeTone =
    backendStatus === "online" ? "teal" : backendStatus === "checking" ? "amber" : "muted";

  return (
    <main className="km-anim-screen min-h-screen bg-[#F7F4EF] text-[#1F2933]">
      <section className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
        {/* Hero: propuesta de valor clara en menos de 10 segundos */}
        <section className="km-anim-fade-up mb-6 overflow-hidden rounded-[2rem] border border-[#E5DED4] bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="p-5 sm:p-8 xl:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0F766E]">
                Kit del Medico de Primer Nivel
              </p>
              <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl xl:text-6xl">
                Herramientas clinicas para documentar consultas mas rapido
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#52606D] sm:text-lg">
                Formatos editables, notas SOAP, checklist de consulta e historia clinica.
                Sin enviar datos clinicos al servidor.
              </p>

              <div className="mt-5 flex flex-wrap gap-2" aria-label="Caracteristicas del producto">
                <Badge tone="teal">Beta</Badge>
                <Badge tone="neutral">Procesamiento local</Badge>
                <Badge tone="neutral">Sin registro</Badge>
                <Badge tone={apiBadgeTone} dot>{backendLabel}</Badge>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => onOpenTool?.("soap")}
                  className="km-press km-focus rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#115E59] hover:shadow-md"
                >
                  Probar nota SOAP
                </button>
                <button
                  type="button"
                  onClick={() => onOpenTool?.("consultation-checklist")}
                  className="km-press km-focus rounded-xl border border-[#E5DED4] bg-white px-5 py-3 text-sm font-semibold text-[#52606D] hover:border-[#0F766E] hover:text-[#0F766E]"
                >
                  Ver checklist
                </button>
              </div>

              <p className="mt-5 text-xs font-medium text-[#697586]">
                {readyCount} herramientas listas hoy. {backendHealth ? `${backendHealth.service} v${backendHealth.version}.` : ""} Funciona en tu navegador, sin instalar nada.
              </p>
            </div>

            {/* Seccion de privacidad: visible arriba del pliegue */}
            <aside className="bg-[#1F2933] p-5 text-white sm:p-8 xl:p-10">
              <p className="text-sm font-semibold text-white/60">Privacidad por diseno</p>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-white/85">
                <li className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#34D399]" />
                  Procesamiento local en tu navegador.
                </li>
                <li className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#34D399]" />
                  Los borradores se guardan solo en este dispositivo.
                </li>
                <li className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#34D399]" />
                  No sustituye tu juicio clinico.
                </li>
              </ul>
              <p className="mt-5 rounded-2xl bg-white/10 p-4 text-xs leading-5 text-white/65">
                Esta app organiza informacion. No sustituye guias, normas, protocolos institucionales ni juicio medico.
              </p>
            </aside>
          </div>
        </section>

        {/* Seccion de herramientas disponibles */}
        <div className="km-anim-fade-up mb-4 flex items-end justify-between gap-4" style={{ animationDelay: "60ms" }}>
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Herramientas disponibles</h2>
            <p className="mt-1 text-sm text-[#697586]">Abre, llena y copia al expediente. Lo siguiente: referencia, consentimiento y cronicos.</p>
          </div>
        </div>

        <div className="km-anim-fade-up mb-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center" style={{ animationDelay: "120ms" }}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Busca: SOAP, diabetes, referencia..."
            aria-label="Buscar herramientas"
            className="w-full rounded-2xl border border-[#E5DED4] bg-white px-4 py-3 text-base outline-none transition placeholder:text-[#9AA4B2] focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10"
          />
          <p className="rounded-2xl border border-[#E5DED4] bg-white px-4 py-3 text-sm font-semibold text-[#697586]">
            {filteredTools.length} herramientas visibles
          </p>
        </div>

        <nav className="km-anim-fade-up mb-5 flex gap-2 overflow-x-auto pb-1" style={{ animationDelay: "160ms" }} aria-label="Categorias de herramientas">
          {toolCategories.map((category) => {
            const isActive = category.id === activeCategory;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={[
                  "km-press km-focus whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold",
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

        {filteredTools.length === 0 && (
          <div className="km-anim-fade-up mb-24 rounded-3xl border border-dashed border-[#E5DED4] bg-white p-8 text-center">
            <p className="text-sm font-semibold text-[#344054]">Sin resultados para tu busqueda.</p>
            <p className="mt-1 text-sm text-[#697586]">Prueba con otra palabra o limpia los filtros.</p>
          </div>
        )}

        <section className="grid gap-3 pb-24 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTools.map((tool, index) => {
            const isReady = tool.status === "Listo";

            return (
              <article
                key={tool.id}
                style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
                className="km-anim-fade-up group rounded-3xl border border-[#E5DED4] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#0F766E] hover:shadow-lg"
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
                    "km-focus mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold transition duration-200",
                    isReady
                      ? "bg-[#0F766E] text-white shadow-sm hover:bg-[#115E59] hover:shadow-md active:scale-[0.98]"
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

type BadgeTone = "teal" | "amber" | "muted" | "neutral";

function Badge({ children, tone, dot = false }: { children: ReactNode; tone: BadgeTone; dot?: boolean }) {
  const toneClass = {
    teal: "bg-[#E6F3EF] text-[#115E59]",
    amber: "bg-[#FBEFD8] text-[#8A6A3C]",
    muted: "bg-[#F0EEE9] text-[#52606D]",
    neutral: "bg-[#F0EEE9] text-[#52606D]",
  }[tone];

  const dotClass = {
    teal: "bg-[#0F766E]",
    amber: "bg-[#D97706]",
    muted: "bg-[#9AA4B2]",
    neutral: "bg-[#9AA4B2]",
  }[tone];

  return (
    <span className={["inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", toneClass].join(" ")}>
      {dot && <span aria-hidden="true" className={["h-1.5 w-1.5 rounded-full", dotClass].join(" ")} />}
      {children}
    </span>
  );
}
