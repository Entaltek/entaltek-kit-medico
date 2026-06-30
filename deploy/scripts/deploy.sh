#!/usr/bin/env bash
#
# Despliegue de Kit del Medico de Primer Nivel
# - Frontend: build estatico de Vite publicado por Nginx (con releases + symlink)
# - Backend:  API FastAPI levantada con Docker Compose
#
# Uso (en el VPS, dentro del repo clonado):
#   sudo ./deploy/scripts/deploy.sh
#
# Variables opcionales:
#   REPO_DIR       Ruta del repo clonado        (default: /opt/entaltek-kit-medico)
#   WEB_ROOT       Raiz del frontend en Nginx   (default: /var/www/medico)
#   BRANCH         Rama a desplegar             (default: main)
#   KEEP_RELEASES  Releases a conservar         (default: 5)
#
# Nota: esta app NO maneja datos clinicos, base de datos ni secretos de
# aplicacion. No requiere migraciones.

set -euo pipefail

REPO_DIR="${REPO_DIR:-/opt/entaltek-kit-medico}"
WEB_ROOT="${WEB_ROOT:-/var/www/medico}"
BRANCH="${BRANCH:-main}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"
HEALTH_URL="${HEALTH_URL:-https://api-medico.entaltek.com/api/v1/health}"

echo "==> Kit del Medico :: despliegue"
cd "$REPO_DIR"

echo "==> 1/6 Actualizando codigo (rama ${BRANCH})"
git fetch --all --prune
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

echo "==> 2/6 Construyendo frontend"
npm ci
npm run build

echo "==> 3/6 Publicando nueva release del frontend"
RELEASE="${WEB_ROOT}/releases/$(date +%Y%m%d%H%M%S)"
mkdir -p "$RELEASE"
cp -r dist/. "$RELEASE/"
ln -sfn "$RELEASE" "${WEB_ROOT}/current"
echo "    release activa: ${RELEASE}"

echo "==> 4/6 Limpiando releases viejas (se conservan ${KEEP_RELEASES})"
if [ -d "${WEB_ROOT}/releases" ]; then
  ls -1dt "${WEB_ROOT}"/releases/*/ 2>/dev/null | tail -n +"$((KEEP_RELEASES + 1))" | xargs -r rm -rf
fi

echo "==> 5/6 Reconstruyendo y levantando la API (Docker Compose)"
( cd backend && docker compose up -d --build )

echo "==> 6/6 Recargando Nginx"
nginx -t
systemctl reload nginx

echo "==> Verificando salud de la API"
sleep 3
if curl -fsS "$HEALTH_URL" >/dev/null; then
  echo "    health OK (${HEALTH_URL})"
else
  echo "    ADVERTENCIA: el health check fallo. Revisa: docker compose -f backend/compose.yaml logs"
fi

echo "==> Despliegue completo."
