import { useState } from "react";
import { HomePage, ToolId } from "./pages/HomePage";
import { SoapNoteTool } from "./tools/soap/SoapNoteTool";

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);

  if (activeTool === "soap") {
    return <SoapNoteTool onBack={() => setActiveTool(null)} />;
  }

  return <HomePage onOpenTool={setActiveTool} />;
}
