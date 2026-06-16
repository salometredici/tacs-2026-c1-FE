# TACS 2026 C1 — Frontend

Frontend en React + TypeScript para la plataforma de intercambio de figuritas del Mundial 2026

## Acceso al deploy (cloud)

La aplicación está corriendo en cloud sobre **tier free** de los tres proveedores (Atlas M0 + Render free + Netlify free):

| Componente | URL |
|---|---|
| Frontend (Netlify) | https://tacs-2026.netlify.app |
| Backend (Render)   | https://tacs-backend-2026.onrender.com |

**Probar la app**: abrir https://tacs-2026.netlify.app en el browser. El BE solo acepta tráfico desde ese origen (CORS) — no se puede consumir la API directamente desde otro origen.

### Cold start

El BE de Render free se "duerme" tras **15 min sin tráfico**. El primer request post-idle tarda **~30 s** en responder. La pantalla de login carga rápido (es estático en Netlify), pero el click "Iniciar sesión" puede colgar 30 s la primera vez. Para evitarlo, pegarle a https://tacs-backend-2026.onrender.com/actuator/health un minuto antes.

### Usuarios disponibles

Todos comparten el mismo password: **`123456`**

| Email                    | Rol   | Estado inicial                                                      |
|--------------------------|-------|---------------------------------------------------------------------|
| `peperacing@gmail.com`   | USER  | Tiene cards en colección (3× FWC1, 2× MEX1, 1× BRA3)                |
| `moniargento@gmail.com`  | USER  | Tiene cards en colección (1× FWC3, 2× ARG1, 3× BRA1, 1× ARG3, 1× MEX7) |
| `dfuseneco@outlook.com`  | USER  | Usuario "vacío" — sin colección. Útil para probar empty states      |
| `admin@mail.com`         | ADMIN | Usuario administrador. Login normal — el FE detecta `role: ADMIN` del DTO y redirige a `/admin` |

No hay publicaciones, subastas, propuestas ni intercambios preseedeados — los crean los users durante la demo (a menos que se levante el `--profile demo` del compose del BE).

## Levantar local — opción rápida

La forma más simple es levantar el **stack completo desde el repo del backend**: el `docker-compose.yml` del BE orquesta los 5 servicios (mongo + mongo-init + mongo-seed + backend + frontend) con healthchecks y dependencias.

Ver [README del backend](https://github.com/Leo-de-Riv3r/tp1c2026) para el comando exacto.

Con esa opción **no hace falta clonar este repo**: el servicio `frontend` del compose pullea la imagen publicada en GHCR correspondiente al tag de la entrega.

### Usuarios del seed local

Mismos que el cloud (ver "Acceso al deploy" arriba). El stack local es independiente del cloud — los users solo existen como duplicado para que el setup sea autocontenido.

## Más documentación en la Wiki

Lo siguiente vive en la [Wiki del repo](https://github.com/salometredici/tacs-2026-c1-FE/wiki) para no inflar este README:

- **Decisiones de arquitectura del FE**: estructura de carpetas, convenciones, Material Design 3 con styled-components, `useFetch` en vez de React Query, estado actual de las pantallas (qué está mockeado, conectado al BE o WIP).
- **Lineamientos de desarrollo**: cómo agregar una nueva pantalla, cómo se manejan estilos compartidos (`components/common/styles/`), cómo se conectan servicios al BE.
- **Levantar el FE en modo dev (sin Docker)**: `npm install && npm run dev` apuntando al BE en `localhost:8080`. Útil para iterar sobre el código del FE viendo cambios en vivo.
- **Levantar este repo con Docker (Opción B — `docker-compose.yml` del FE)**: para cuando se quiere construir la imagen del FE desde el código local en lugar de pullear de GHCR, asumiendo que el repo del BE está clonado bajo el mismo padre.
- **Variables de entorno** (`VITE_API_BASE_URL`, secretos en `.env`) y cómo configurarlas para los distintos modos.
- **Uso de IA en el proyecto**: declaración requerida por el TP.
