import { useEffect, useState } from "react";
import { ToolId } from "./content/tools";
import { HomePage } from "./pages/HomePage";
import { ConsultationChecklistTool } from "./tools/checklist/ConsultationChecklistTool";
import { ClinicalHistoryTool } from "./tools/clinical-history/ClinicalHistoryTool";
import { SoapNoteTool } from "./tools/soap/SoapNoteTool";

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [activeTool]);

  if (activeTool === "soap") {
    return <SoapNoteTool onBack={() => setActiveTool(null)} />;
  }

  if (activeTool === "consultation-checklist") {
    return <ConsultationChecklistTool onBack={() => setActiveTool(null)} />;
  }

  if (activeTool === "historia-clinica") {
    return <ClinicalHistoryTool onBack={() => setActiveTool(null)} />;
  }

  return <HomePage onOpenTool={setActiveTool} />;
}
