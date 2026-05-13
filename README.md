# TACS 2026 C1 — Frontend

Frontend en React + TypeScript para la plataforma de intercambio de figuritas del Mundial 2026

## Levantar el stack completo (recomendado)

La forma sugerida es levantar todo desde el repo del backend, que ya orquesta los 4 servicios (mongo + seed + backend + frontend) con healthchecks y depende del orden correcto. Ver instrucciones en el [README del backend](https://github.com/Leo-de-Riv3r/tp1c2026)

Con esa opción no hace falta clonar este repo: el servicio `frontend` del compose pullea la imagen publicada en GHCR

## Levantar con el compose local del frontend (alternativa)

Si ya tenés este repo clonado y querés trabajar sobre el código del FE viendo los cambios reflejados en Docker, podés usar el `docker-compose.yml` que vive acá. Asume que el repo del backend está como hermano:

```
carpeta-padre/
├── tp1c2026/             ← repo del backend
└── tacs-2026-c1-FE/      ← este repo
```

Desde la raíz de este repo:

```bash
docker compose up -d --build
```

Eso levanta los 4 servicios en orden:

1. **Mongo** — espera healthcheck
2. **mongo-seed** — corre `seed/seed.js` y carga el catálogo de 500 figuritas + los usuarios de prueba. Termina y sale
3. **Backend** — espera a que el seed termine OK; se buildea desde `../tp1c2026/backend`
4. **Frontend** — se buildea desde el código local

| Servicio  | URL                                          |
|-----------|----------------------------------------------|
| Frontend  | http://localhost (puerto 80, default HTTP)   |
| Backend   | http://localhost:8080                        |
| MongoDB   | localhost:27018                              |

Para apagar todo:

```bash
docker compose down
```

Para resetear la base (borra el volumen y vuelve a seedear desde cero):

```bash
docker compose down -v
docker compose up -d --build
```

## Desarrollar en local (sin Docker)

**Requisitos:** Node.js 18+

El backend debe estar corriendo en el puerto 8080 antes de arrancar el frontend (ver README del backend).

```bash
npm install
npm run build
npm run dev
```

La app estará disponible en http://localhost:5173.

## Usuarios de prueba

Esta entrega incluye una implementación inicial de autenticación. Para facilitar la prueba de flujos entre usuarios (crear, aceptar y rechazar propuestas, etc.), se sumaron los siguientes usuarios al seed de la base:

| Email              | Contraseña | Rol   |
|--------------------|------------|-------|
| user@test.com      | 1234       | USER  |
| publisher@test.com | 1234       | USER  |
| admin@test.com     | 1234       | ADMIN |

> El admin no se siembra en MongoDB: el backend lo valida contra las variables `ADMIN_EMAIL` y `ADMIN_PASSWORD` definidas en el `.env` (ver sección siguiente).

## Variables de entorno

| Variable          | Valor por defecto     | Descripción                                      |
|-------------------|-----------------------|--------------------------------------------------|
| VITE_API_BASE_URL | http://localhost:8080 | URL base del backend (solo para el build Docker) |

En modo dev no hace falta — axios apunta directo al backend en `localhost:8080`.

### Secretos (`.env`)

El `docker-compose.yml` del FE consume las siguientes variables desde un archivo `.env` en la raíz del repo, que **no está versionado** para no exponer credenciales:

- `JWT_SECRET` y `JWT_EXPIRATION` — firma y vida útil de los tokens JWT
- `ADMIN_EMAIL` y `ADMIN_PASSWORD` — credenciales del usuario admin (validadas por el backend, ver tabla anterior)

Los valores de `JWT_SECRET` y `JWT_EXPIRATION` fueron enviados por mail al equipo docente. Pegarlos en un `.env` junto con las credenciales de admin (`admin@test.com` / `1234`) antes de levantar el stack.

## En progreso

Algunas pantallas aún están en evolución y, en consecuencia, hay piezas que se incorporarán en la próxima iteración una vez estabilizada su estructura:

- **Tests del frontend** — la suite de Vitest está configurada y se sumarán los tests cuando termine de definirse la estructura final de las pantallas afectadas.
- **Sugerencias automáticas** — la lógica del cruce faltantes/repetidas todavía no está definida; la pantalla de Home consume datos mockeados.
- **Notificaciones** — el bell del Navbar muestra notificaciones mockeadas; el endpoint del backend ya existe pero falta cablear el FE.
- **Estadísticas del panel admin** — las métricas se renderizan desde mocks; pendiente de conectar al backend.

## Documentación

Decisiones de arquitectura y lineamientos de desarrollo en la [Wiki del proyecto](https://github.com/salometredici/tacs-2026-c1-FE/wiki).
