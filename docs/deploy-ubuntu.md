# Despliegue en Ubuntu — Kit del Médico de Primer Nivel

Guía paso a paso para publicar el MVP en un VPS Ubuntu con **Nginx + Docker Compose + Certbot**.

- **Frontend** (React + Vite): build estático servido por Nginx en `https://medico.entaltek.com`.
- **Backend** (FastAPI): API en Docker Compose detrás de Nginx en `https://api-medico.entaltek.com`.
- **VPS**: Ubuntu en `207.246.70.27`.
- **Dominio**: `entaltek.com` (DNS en GoDaddy).

> **Alcance del MVP:** el backend **no** guarda datos clínicos, **no** usa base de datos y **no** tiene autenticación. Solo expone `/api/v1/health`. Esta guía no incluye DB, migraciones ni login.

---

## 0. Arquitectura

```
                    Internet
                       │
              ┌────────┴─────────┐
              │  GoDaddy DNS      │
              │  medico      → A 207.246.70.27
              │  api-medico  → A 207.246.70.27
              └────────┬─────────┘
                       │
              ┌────────▼─────────┐
              │   Nginx (443)    │  TLS con Certbot
              ├──────────────────┤
   estático ◄─┤ medico.*         │
              │ api-medico.*  ───┼──► 127.0.0.1:8000
              └──────────────────┘        │
                                  ┌────────▼─────────┐
                                  │ Docker Compose   │
                                  │ FastAPI (uvicorn)│
                                  └──────────────────┘
```

---

## 1. DNS en GoDaddy

En **GoDaddy → Mis productos → entaltek.com → DNS → Registros**, crea dos registros tipo **A**:

| Tipo | Nombre       | Valor (apunta a)   | TTL     |
|------|--------------|--------------------|---------|
| A    | `medico`     | `207.246.70.27`    | 1 hora  |
| A    | `api-medico` | `207.246.70.27`    | 1 hora  |

Esto crea `medico.entaltek.com` y `api-medico.entaltek.com`.

Verifica la propagación (puede tardar de minutos a unas horas):

```bash
dig +short medico.entaltek.com
dig +short api-medico.entaltek.com
# Ambos deben devolver 207.246.70.27
```

> No emitas certificados HTTPS (paso 8) hasta que el DNS resuelva a la IP correcta.

---

## 2. Acceso SSH

Desde tu máquina local:

```bash
ssh root@207.246.70.27
# o, si tienes un usuario con sudo:
ssh tu_usuario@207.246.70.27
```

(Recomendado) Crea un usuario sin privilegios root para operar:

```bash
adduser deploy
usermod -aG sudo deploy
# copia tu clave publica
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
su - deploy
```

---

## 3. Preparar el servidor

```bash
sudo apt update && sudo apt upgrade -y

# Utilidades basicas
sudo apt install -y git curl ufw

# Firewall: permitir SSH y Nginx (HTTP/HTTPS)
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## 4. Instalar Docker, Nginx y Certbot

### Docker + Docker Compose plugin

```bash
# Repositorio oficial de Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# (Opcional) usar docker sin sudo
sudo usermod -aG docker $USER
# cierra y reabre la sesion SSH para que tome efecto

docker --version
docker compose version
```

### Node.js (para construir el frontend en el servidor)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version   # v20.x
npm --version
```

### Nginx + Certbot

```bash
sudo apt install -y nginx
sudo apt install -y certbot python3-certbot-nginx
```

---

## 5. Clonar el repositorio

```bash
sudo mkdir -p /opt/entaltek-kit-medico
sudo chown "$USER":"$USER" /opt/entaltek-kit-medico
git clone https://github.com/Entaltek/entaltek-kit-medico.git /opt/entaltek-kit-medico
cd /opt/entaltek-kit-medico
```

---

## 6. Backend con Docker Compose

```bash
cd /opt/entaltek-kit-medico/backend

# Crear el .env de produccion a partir del ejemplo
cp .env.production.example .env
chmod 600 .env
nano .env   # ajusta ALLOWED_ORIGINS si hace falta
```

`backend/.env` para producción:

```env
DEBUG=false
ALLOWED_ORIGINS=["https://medico.entaltek.com"]
```

**Importante (CORS):** en `backend/compose.yaml` la clave `environment.ALLOWED_ORIGINS` está fijada a `localhost` y **tiene prioridad sobre `.env`**. Para producción, edita ese valor (o elimina la línea para que mande el `.env`):

```yaml
# backend/compose.yaml
services:
  api:
    # Exponer SOLO en loopback: que Nginx haga de puerta, no internet directo
    ports:
      - "127.0.0.1:8000:8000"
    environment:
      ALLOWED_ORIGINS: '["https://medico.entaltek.com"]'
```

Levanta la API:

```bash
cd /opt/entaltek-kit-medico/backend
docker compose up -d --build
docker compose ps
# Prueba local (en el servidor)
curl -s http://127.0.0.1:8000/api/v1/health
# {"status":"ok","service":"Kit Medico API","version":"0.1.0"}
```

---

## 7. Frontend (build de Vite) y Nginx

### 7.1 Variable de entorno del frontend

El frontend lee `VITE_API_URL` (ver `src/lib/api.ts`). Apúntalo al dominio de la API:

```bash
cd /opt/entaltek-kit-medico
echo 'VITE_API_URL=https://api-medico.entaltek.com' > .env.production
```

> **Los `VITE_*` NO son secretos.** Vite **incrusta** estas variables en el bundle JavaScript público; cualquiera puede leerlas en el navegador. Usa `VITE_*` **solo** para valores públicos (como la URL de la API). **Nunca** pongas tokens, claves de API privadas, contraseñas ni cadenas de conexión en variables `VITE_*`. Los secretos van únicamente en el backend (`backend/.env`, fuera del control de versiones).

### 7.2 Construir y publicar

```bash
cd /opt/entaltek-kit-medico
npm ci
npm run build      # genera dist/

# Estructura de releases con symlink (permite rollback)
sudo mkdir -p /var/www/medico/releases
sudo mkdir -p /var/www/certbot           # para retos ACME (webroot)
RELEASE="/var/www/medico/releases/$(date +%Y%m%d%H%M%S)"
sudo mkdir -p "$RELEASE"
sudo cp -r dist/. "$RELEASE/"
sudo ln -sfn "$RELEASE" /var/www/medico/current
```

### 7.3 Configurar Nginx (reverse proxy + estático)

Copia las configuraciones versionadas del repo:

```bash
sudo cp /opt/entaltek-kit-medico/deploy/nginx/medico.entaltek.com.conf /etc/nginx/sites-available/
sudo cp /opt/entaltek-kit-medico/deploy/nginx/api-medico.entaltek.com.conf /etc/nginx/sites-available/

sudo ln -s /etc/nginx/sites-available/medico.entaltek.com.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api-medico.entaltek.com.conf /etc/nginx/sites-enabled/

# (Opcional) quitar el sitio default
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t
sudo systemctl reload nginx
```

En este punto, `http://medico.entaltek.com` ya debería servir el frontend (sin HTTPS todavía).

---

## 8. HTTPS con Certbot

Con el DNS resolviendo a la IP y Nginx escuchando en el puerto 80:

```bash
sudo certbot --nginx -d medico.entaltek.com -d api-medico.entaltek.com
```

Certbot:
- valida la propiedad del dominio,
- obtiene los certificados,
- **edita los archivos de Nginx** agregando el bloque `server` en 443 y la redirección 80 → 443,
- programa la renovación automática.

Verifica la renovación automática:

```bash
sudo certbot renew --dry-run
sudo systemctl list-timers | grep certbot
```

Prueba final:

```bash
curl -s https://medico.entaltek.com | head -n 5
curl -s https://api-medico.entaltek.com/api/v1/health
# {"status":"ok","service":"Kit Medico API","version":"0.1.0"}
```

---

## 9. Actualizaciones (deploys posteriores)

Usa el script versionado `deploy/scripts/deploy.sh`, que actualiza el código, reconstruye frontend y backend, publica una nueva release y recarga Nginx:

```bash
cd /opt/entaltek-kit-medico
sudo ./deploy/scripts/deploy.sh
```

Variables opcionales:

```bash
sudo BRANCH=main KEEP_RELEASES=5 ./deploy/scripts/deploy.sh
```

Pasos equivalentes manuales:

```bash
cd /opt/entaltek-kit-medico
git pull --ff-only origin main
npm ci && npm run build
# publicar nueva release del frontend (ver 7.2)
cd backend && docker compose up -d --build && cd ..
sudo nginx -t && sudo systemctl reload nginx
```

---

## 10. Rollback

### Frontend (instantáneo: re-apuntar el symlink)

```bash
# Ver releases disponibles (mas reciente arriba)
ls -1dt /var/www/medico/releases/*/

# Volver a una release anterior
sudo ln -sfn /var/www/medico/releases/<TIMESTAMP_ANTERIOR> /var/www/medico/current
sudo systemctl reload nginx
```

### Backend (volver a un commit anterior y reconstruir)

```bash
cd /opt/entaltek-kit-medico
git checkout <commit_o_tag_estable>
cd backend
docker compose up -d --build
```

---

## 11. Debugging común

| Síntoma | Diagnóstico / solución |
|--------|------------------------|
| `502 Bad Gateway` en la API | El contenedor no está arriba o no escucha en `127.0.0.1:8000`. Revisa `docker compose -f backend/compose.yaml ps` y `... logs -f api`. |
| El frontend carga pero el estado dice "Modo local" | El navegador no alcanza la API. Verifica `VITE_API_URL`, que `api-medico` tenga HTTPS y CORS (`ALLOWED_ORIGINS`) incluya `https://medico.entaltek.com`. Mira la consola del navegador (errores CORS). |
| Error CORS en consola | `ALLOWED_ORIGINS` no coincide con el origen del frontend. Recuerda que `environment` en compose pisa al `.env`. Ajusta y `docker compose up -d`. |
| Certbot falla al emitir | DNS aún no propaga, o el puerto 80 está bloqueado. Revisa `dig +short medico.entaltek.com` y `sudo ufw status`. |
| `nginx -t` falla | Error de sintaxis o symlink roto en `sites-enabled`. Lee el mensaje; revisa rutas de certificados. |
| Cambios del frontend no se ven | El navegador cachea. El `index.html` se sirve con `no-cache`; fuerza recarga (Ctrl+Shift+R) o confirma que `current` apunta a la nueva release. |
| `docker compose` no encontrado | Falta el plugin: instala `docker-compose-plugin` (paso 4) y usa `docker compose` (con espacio). |
| Permisos al copiar a `/var/www` | Ejecuta los `cp/ln` con `sudo` o ajusta el dueño con `chown`. |

Logs útiles:

```bash
# Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# API (Docker)
cd /opt/entaltek-kit-medico/backend
docker compose logs -f api
```

---

## 12. Checklist final de producción

**DNS y red**
- [ ] `medico.entaltek.com` y `api-medico.entaltek.com` resuelven a `207.246.70.27`.
- [ ] Firewall (`ufw`) permite OpenSSH y Nginx Full; el resto cerrado.
- [ ] El puerto `8000` **no** está expuesto a internet (compose con `127.0.0.1:8000:8000`).

**Backend**
- [ ] `backend/.env` creado desde `.env.production.example`, con `chmod 600`.
- [ ] `DEBUG=false`.
- [ ] `ALLOWED_ORIGINS` = `["https://medico.entaltek.com"]` (y coincide con lo que pisa `compose.yaml`).
- [ ] `curl http://127.0.0.1:8000/api/v1/health` responde `ok` en el servidor.
- [ ] `restart: unless-stopped` activo (la API revive tras reinicios).

**Frontend**
- [ ] `VITE_API_URL=https://api-medico.entaltek.com` en `.env.production`.
- [ ] **Ningún** secreto en variables `VITE_*` (solo valores públicos).
- [ ] `npm run build` sin errores; `dist/` publicado en una release y `current` apunta a ella.

**HTTPS / Nginx**
- [ ] Certificados emitidos para ambos subdominios.
- [ ] Redirección 80 → 443 activa.
- [ ] `sudo certbot renew --dry-run` pasa.
- [ ] Encabezados de seguridad presentes (`X-Content-Type-Options`, etc.).

**Privacidad (MVP)**
- [ ] El backend **no** persiste datos clínicos, no hay base de datos ni login.
- [ ] Los datos clínicos se procesan en el navegador; los borradores quedan solo en el dispositivo.
- [ ] No se registran datos clínicos en logs de Nginx ni de la API.

**Operación**
- [ ] `deploy/scripts/deploy.sh` probado (deploy + health check OK).
- [ ] Rollback verificado (re-apuntar `current` a una release previa).
