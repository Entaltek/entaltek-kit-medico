export type BackendHealth = {
  status: string;
  service: string;
  version: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function getBackendHealth(): Promise<BackendHealth> {
  const response = await fetch(`${API_URL}/api/v1/health`);

  if (!response.ok) {
    throw new Error("Backend no disponible");
  }

  return response.json();
}
