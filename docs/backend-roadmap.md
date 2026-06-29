# Backend Roadmap — Kit del Médico de Primer Nivel

> **Estado actual:** MVP sin backend. Todo corre localmente en el navegador.
> Este documento describe la arquitectura recomendada para cuando se agregue persistencia y sincronización al producto.

---

## 1. Arquitectura propuesta

Se propone una arquitectura **REST API + base de datos relacional**, desacoplada del frontend, con acceso exclusivamente autenticado para datos clínicos.

```
┌─────────────────────────────────┐
│         Frontend (React/Vite)   │
│  - Funciona offline por default │
│  - Sincroniza al tener conexión │
└────────────┬────────────────────┘
             │ HTTPS / JSON
┌────────────▼────────────────────┐
│         API REST                │
│  /api/v1/...                    │
│  Autenticación JWT              │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│     Base de datos relacional    │
│  PostgreSQL                     │
│  Datos cifrados en reposo       │
└─────────────────────────────────┘
```

El frontend **puede seguir funcionando offline** usando `localStorage`; el backend actúa como capa de sincronización y respaldo, no como requisito.

---

## 2. Stack recomendado: comparación

### Opción A — FastAPI + PostgreSQL (recomendado)

| Pros | Contras |
|------|---------|
| Python: ecosistema médico/datos maduro | El equipo debe conocer Python |
| Validación automática con Pydantic | Requiere infra propia o PaaS |
| Documentación OpenAPI automática | Más configuración inicial que BaaS |
| Control total sobre seguridad y datos | |
| Fácil de auditar para datos clínicos | |

### Opción B — Node.js + NestJS + PostgreSQL

| Pros | Contras |
|------|---------|
| Mismo lenguaje que el frontend (TypeScript) | NestJS tiene curva de aprendizaje alta |
| Tipado compartido frontend/backend | Ecosistema médico menos robusto |
| Buen soporte para APIs REST y WebSockets | |

### Opción C — Supabase (BaaS)

| Pros | Contras |
|------|---------|
| Setup muy rápido (días vs semanas) | Menos control sobre privacidad de datos |
| Auth, storage y DB incluidos | Datos clínicos en servidores de terceros |
| SDK TypeScript de primera clase | Vendor lock-in |
| Ideal para MVP rápido | Puede violar requisitos COFEPRIS/HIPAA-MX si no se configura bien |

### Decisión recomendada

**FastAPI + PostgreSQL** para producción con datos clínicos reales, por control y auditabilidad.
**Supabase** es aceptable para un prototipo extendido o piloto interno cerrado, siempre que se valide el cumplimiento regulatorio.

---

## 3. Modelos de datos iniciales

### User

```python
User:
  id          UUID        PK
  email       str         único, indexado
  full_name   str
  role        enum        ["medico_general", "pasante", "admin"]
  institution str | None
  created_at  datetime
  updated_at  datetime
```

### ClinicalNote (nota clínica genérica)

```python
ClinicalNote:
  id           UUID      PK
  user_id      UUID      FK → User
  tool_id      str       ej. "soap", "historia-clinica"
  title        str | None
  content      JSON      contenido libre según la herramienta
  is_draft     bool      default true
  created_at   datetime
  updated_at   datetime
```

> El campo `content` almacena la estructura específica de cada herramienta sin forzar un esquema rígido por tabla. Se puede migrar a tablas especializadas cuando escale.

### SoapNote (extensión de ClinicalNote para SOAP)

```python
SoapNote:
  id            UUID    PK
  note_id       UUID    FK → ClinicalNote
  patient_name  str | None   # Nunca nombre completo + CURP juntos
  patient_age   str | None
  date          date
  subjective    text
  objective     text
  assessment    text
  plan          text
```

> La información de identidad del paciente se minimiza deliberadamente. Ver sección 5.

### Template (plantilla clínica editable)

```python
Template:
  id           UUID    PK
  user_id      UUID | None   FK → User (None = plantilla global del sistema)
  tool_id      str           herramienta a la que aplica
  name         str
  content      JSON          estructura predefinida de la herramienta
  is_default   bool
  is_shared    bool          default false
  created_at   datetime
  updated_at   datetime
```

### ToolUsageEvent (telemetría anónima)

```python
ToolUsageEvent:
  id         UUID    PK
  user_id    UUID | None   FK → User (None = evento anónimo)
  tool_id    str
  event_type enum    ["opened", "completed", "exported", "copied"]
  metadata   JSON | None   ej. {"export_format": "pdf"}
  timestamp  datetime
```

> Este modelo no almacena datos clínicos. Solo mide qué herramientas se usan y cómo.

---

## 4. Endpoints REST mínimos

Base: `/api/v1`

### Autenticación

```
POST   /auth/register          Crear cuenta
POST   /auth/login             Obtener JWT
POST   /auth/logout            Invalidar token
POST   /auth/refresh           Renovar JWT
POST   /auth/password-reset    Solicitar reset de contraseña
```

### Notas clínicas

```
GET    /notes                  Listar notas del usuario autenticado
POST   /notes                  Crear nota nueva
GET    /notes/{id}             Obtener nota por ID
PUT    /notes/{id}             Actualizar nota
DELETE /notes/{id}             Eliminar nota (soft delete)
GET    /notes/{id}/export/pdf  Generar y descargar PDF
GET    /notes/{id}/export/txt  Descargar como texto plano
```

### Plantillas

```
GET    /templates              Listar plantillas disponibles (globales + del usuario)
POST   /templates              Crear plantilla personalizada
GET    /templates/{id}         Obtener plantilla
PUT    /templates/{id}         Actualizar plantilla propia
DELETE /templates/{id}         Eliminar plantilla propia
```

### Telemetría

```
POST   /events                 Registrar evento de uso (anónimo o autenticado)
```

### Usuarios (solo perfil propio)

```
GET    /users/me               Ver perfil
PUT    /users/me               Actualizar perfil
DELETE /users/me               Solicitar eliminación de cuenta
```

---

## 5. Privacidad y seguridad para datos clínicos

### Principios generales

- **Minimización de datos:** No se solicita ni almacena más información del paciente de la estrictamente necesaria para la herramienta. Nombre completo sin CURP/fecha de nacimiento completa.
- **Propósito definido:** Los datos clínicos son exclusivamente del médico para su propia práctica. No se usan para entrenamiento de modelos, estadísticas de salud pública ni publicidad.
- **Sin diagnóstico automático:** El backend no infiere ni sugiere diagnósticos. Solo persiste y recupera información ingresada por el médico.

### Medidas técnicas obligatorias

| Capa | Medida |
|------|--------|
| Transporte | HTTPS/TLS 1.3 obligatorio, HSTS habilitado |
| Autenticación | JWT de corta duración (15 min) + refresh token rotativo |
| Autorización | Cada endpoint valida que `user_id` del recurso == usuario autenticado |
| Almacenamiento | Cifrado en reposo (PostgreSQL + cifrado a nivel de disco) |
| Campos sensibles | Columnas de `patient_name` cifradas a nivel de aplicación (AES-256) |
| Contraseñas | Hashing con bcrypt (costo ≥ 12) o argon2id |
| Logs | Sin datos clínicos en logs de acceso. Solo IDs, timestamps y códigos HTTP |
| Backups | Cifrados, con retención definida y pruebas de restauración periódicas |
| Exportación PDF | Generado en servidor, transmitido por HTTPS, no almacenado permanentemente |

### Control de acceso

- Un médico solo puede acceder a sus propias notas y plantillas.
- No existe un endpoint de administración que exponga notas de otros usuarios.
- La eliminación de cuenta incluye eliminación de todos los datos clínicos asociados (derecho al olvido).

### Regulación aplicable (México)

- **Ley Federal de Protección de Datos Personales en Posesión de Particulares (LFPDPPP)**
- **NOM-024-SSA3-2012** — Sistemas de información de registro electrónico para la salud
- **Aviso de privacidad** requerido antes de recolectar cualquier dato

---

## 6. Qué NO debe construir el backend en el MVP

Las siguientes funcionalidades están fuera de alcance para la primera versión del backend:

| Funcionalidad | Razón para excluir |
|---------------|-------------------|
| Diagnóstico asistido por IA | Fuera del propósito del producto, riesgo regulatorio alto |
| Expediente electrónico del paciente | Requiere integración con NOM-024, identidad del paciente, historia longitudinal |
| Integración con sistemas hospitalarios (HIS/RIS) | Complejidad y certificaciones adicionales |
| Telemedicina o videoconsulta | Producto diferente |
| Prescripción electrónica | Marco legal específico, firma electrónica certificada |
| Compartir notas entre médicos | Requiere consentimiento del paciente, modelo de permisos complejo |
| Almacenamiento de imágenes clínicas (DICOM, fotos) | Alto costo de almacenamiento, regulación específica |
| Roles de administrador para ver notas de usuarios | Nunca debe existir por privacidad |
| Analíticas agregadas de notas clínicas | Requiere anonimización robusta, fuera de alcance |
| Multi-tenant para instituciones | Arquitectura diferente, posponer |

---

## 7. Fases sugeridas de implementación

```
Fase 0 (actual)
  └── MVP local sin backend
      Funciona 100% en el navegador con localStorage

Fase 1 — Persistencia básica
  └── Auth (registro/login)
  └── Guardar y recuperar notas SOAP
  └── Exportar PDF desde servidor
  └── Deploy: Railway / Render / Fly.io + Supabase DB

Fase 2 — Plantillas y sincronización
  └── Plantillas personalizadas por usuario
  └── Sincronización de notas entre dispositivos
  └── Exportación de múltiples formatos (TXT, PDF)

Fase 3 — Herramientas adicionales
  └── Historia clínica, control prenatal, crónicos
  └── Cada herramienta nueva sigue el modelo ClinicalNote + content JSON

Fase 4 — Cumplimiento y producción
  └── Auditoría de seguridad externa
  └── Aviso de privacidad formal
  └── Cumplimiento NOM-024 si aplica
  └── Eliminación de cuenta y portabilidad de datos
```

---

## 8. Tecnologías de referencia (sin agregar al proyecto todavía)

| Propósito | Opción recomendada |
|-----------|-------------------|
| API | FastAPI 0.111+ |
| ORM | SQLAlchemy 2 + Alembic |
| Base de datos | PostgreSQL 16 |
| Autenticación | python-jose (JWT) + passlib |
| Generación de PDF | WeasyPrint o reportlab |
| Validación | Pydantic v2 |
| Testing | pytest + httpx |
| CI/CD | GitHub Actions |
| Deploy | Railway, Render o Fly.io |

---

> **Nota final:** El backend existe para dar al médico control y continuidad sobre sus propias notas. No reemplaza el criterio clínico, no diagnostica, y no expone datos a terceros. Esos son límites de diseño, no solo de implementación.
