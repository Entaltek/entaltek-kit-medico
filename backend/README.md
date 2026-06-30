# Kit Médico — Backend API

FastAPI foundation para el backend del Kit del Médico de Primer Nivel.

> **Estado:** Foundation únicamente. Sin base de datos, sin autenticación, sin endpoints clínicos todavía.

## Requisitos

- Python 3.11+
- [uv](https://docs.astral.sh/uv/) (recomendado) o `pip`

## Correr localmente

### Con uv (recomendado)

```bash
cd backend

# Instalar dependencias (crea virtualenv automáticamente)
uv sync --extra dev

# Iniciar servidor de desarrollo
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

## Correr pruebas

```bash
cd backend

# Con uv
uv run pytest -v

# Con pip/venv activo
pytest -v
```

## Estructura

```
backend/
├── app/
│   ├── main.py               # Punto de entrada FastAPI
│   ├── api/
│   │   └── routes/
│   │       ├── __init__.py   # Router principal
│   │       └── health.py     # GET /health
│   ├── core/
│   │   └── config.py         # Configuración via pydantic-settings
│   ├── models/               # Modelos ORM (vacío por ahora)
│   └── schemas/              # Schemas Pydantic (vacío por ahora)
├── tests/
│   └── test_health.py
├── pyproject.toml
└── README.md
```

## Variables de entorno

Crear un archivo `backend/.env` (no commitear):

```env
DEBUG=false
ALLOWED_ORIGINS=http://localhost:5173
```

## Próximos pasos

Ver `docs/backend-roadmap.md` en la raíz del repositorio.
