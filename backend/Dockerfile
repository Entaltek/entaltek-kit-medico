FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema mínimas
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Copiar solo el manifiesto primero para aprovechar cache de capas
COPY pyproject.toml .

# Instalar dependencias de producción (sin dev)
RUN pip install --no-cache-dir ".[dev]"

# Copiar el código fuente
COPY app/ app/

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
