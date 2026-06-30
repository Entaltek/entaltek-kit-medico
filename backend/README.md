# Kit Médico — Backend API

FastAPI foundation para el backend del Kit del Médico de Primer Nivel.

> **Estado:** Foundation únicamente. Sin base de datos, sin autenticación, sin endpoints clínicos todavía.

## Requisitos

**Sin Docker:**
- Python 3.11+
- [uv](https://docs.astral.sh/uv/) (recomendado) o `pip`

**Con Docker:**
- Docker 24+
- Docker Compose v2 (`docker compose`)

---

## Correr localmente (sin Docker)

### Con uv (recomendado)

```bash
cd backend

# Instalar dependencias (crea virtualenv automáticamente)
uv sync --extra dev

# Iniciar servidor de desarrollo con hot-reload
uv run uvicorn app.main:app --reload --port 8000
```

### Con pip + venv

```bash
cd backend

python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate

pip install -e ".[dev]"

uvicorn app.main:app --reload --port 8000
```

El servidor queda disponible en `http://localhost:8000`.

---

## Correr con Docker Compose

```bash
cd backend

# Construir imagen e iniciar el contenedor
docker compose up --build

# En background
docker compose up --build -d

# Ver logs
docker compose logs -f

# Detener
docker compose down
```

El servidor queda disponible en `http://localhost:8000`.

> El contenedor incluye un `HEALTHCHECK` automático cada 30 s apuntando a `/api/v1/health`.

---

## Probar el endpoint de health

```bash
# Con curl
curl http://localhost:8000/api/v1/health

# Respuesta esperada
# {"status":"ok","service":"Kit Medico API","version":"0.1.0"}

# Con formato JSON legible
curl -s http://localhost:8000/api/v1/health | python -m json.tool
```

---

## Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/health` | Estado del servicio |
| GET | `/docs` | Documentación interactiva (Swagger UI) |
| GET | `/redoc` | Documentación alternativa (ReDoc) |

### Ejemplo de respuesta — `/api/v1/health`

```json
{
  "status": "ok",
  "service": "Kit Medico API",
  "version": "0.1.0"
}
```

---

## Correr pruebas

```bash
cd backend

# Con uv
uv run pytest -v

# Con pip/venv activo
pytest -v
```

---

## Estructura

```
backend/
├── app/
│   ├── main.py               # Punto de entrada FastAPI + CORS
│   ├── api/
│   │   └── routes/
│   │       ├── __init__.py   # Router principal
│   │       └── health.py     # GET /api/v1/health
│   ├── core/
│   │   └── config.py         # Configuración via pydantic-settings
│   ├── models/               # Modelos ORM (vacío por ahora)
│   └── schemas/              # Schemas Pydantic (vacío por ahora)
├── tests/
│   └── test_health.py
├── Dockerfile
├── compose.yaml
├── .dockerignore
├── .env.example
├── pyproject.toml
└── README.md
```

---

## Variables de entorno

Copiar `.env.example` a `.env` (no commitear el `.env`):

```bash
cp .env.example .env
```

| Variable | Default | Descripción |
|----------|---------|-------------|
| `DEBUG` | `false` | Modo debug de uvicorn |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | Orígenes CORS permitidos (separar con comas) |

---

## Próximos pasos

Ver `docs/backend-roadmap.md` en la raíz del repositorio.
