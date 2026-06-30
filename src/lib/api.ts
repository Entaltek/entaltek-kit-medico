export type BackendHealth = {
  status: string;
  service: string;
  version: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function getBackendHealth(): Promise<BackendHealth> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${API_URL}/api/v1/health`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("Backend no disponible");
    }

    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}
