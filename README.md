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

No hay publicaciones, subastas, propuestas ni intercambios preseedeados — los crean los users durante la demo.

## Levantar local

El stack local es útil para **load tests** (apunta a Mongo en container, no Atlas — no afecta a la quota free ni a la data del cloud) y desarrollo del FE.

### Opción A: stack completo desde el backend

La más simple. El repo del backend orquesta los 5 servicios (mongo + mongo-init + mongo-seed + backend + frontend) con healthchecks y dependencias. Ver [README del backend](https://github.com/Leo-de-Riv3r/tp1c2026).

Con esa opción no hace falta clonar este repo: el servicio `frontend` del compose pullea la imagen publicada en GHCR (correspondiente al tag de la Entrega actual).

### Opción B: compose local del frontend (para editar FE y ver cambios)

Si se quiere trabajar sobre el código del FE viendo los cambios reflejados en Docker, se puede usar el `docker-compose.yml`. Asume que el repo del backend está descargado en una carpeta bajo el mismo padre:

```
carpeta-padre/
├── tp1c2026/             ← repo del backend
└── tacs-2026-c1-FE/      ← este repo
```

Desde la raíz de este repo:

```bash
docker compose up -d --build
```

Eso levanta 5 servicios en orden:

1. **Mongo** — arranca con `--replSet rs0` para soportar transacciones multi-documento.
2. **mongo-init** — espera healthcheck de Mongo y corre `rs.initiate()` una sola vez. Termina y sale
3. **mongo-seed** — corre `seed/seed.js` y carga el catálogo de 991 figuritas + los usuarios de prueba. Termina y sale
4. **Backend** — espera a que el seed termine OK; se buildea desde `../tp1c2026/backend`
5. **Frontend** — se buildea desde el código local

| Servicio  | URL                                          |
|-----------|----------------------------------------------|
| Frontend  | http://localhost (puerto 80, default HTTP)   |
| Backend   | http://localhost:8080                        |
| MongoDB   | localhost:27018 (requiere `?directConnection=true` para clientes externos) |

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

El backend debe estar corriendo en el puerto 8080 antes de arrancar el frontend (ver README del backend — desde la última iteración el BE requiere Mongo en modo **replica set** porque usa transacciones)

```bash
npm install
npm run build
npm run dev
```

Esta app estará disponible en http://localhost:5173

### Usuarios del seed local

Mismos que el cloud (ver "Acceso al deploy" arriba). El stack local es independiente del cloud — los users solo existen como duplicado para que el setup sea autocontenido.

## Variables de entorno

| Variable          | Valor por defecto     | Descripción                                      |
|-------------------|-----------------------|--------------------------------------------------|
| VITE_API_BASE_URL | http://localhost:8080 | URL base del backend (solo para el build Docker) |

En modo dev no hace falta — axios apunta directo al backend en `localhost:8080`.

### Secretos (`.env`)

El `docker-compose.yml` del FE consume las siguientes variables desde un archivo `.env` en la raíz del repo, que **no está versionado** para no exponer credenciales:

- `JWT_SECRET` y `JWT_EXPIRATION` — firma y vida útil de los tokens JWT.

Los valores fueron enviados por mail a los profes. Pegarlos en un `.env` antes de levantar el stack

## Documentación

Decisiones de arquitectura, lineamientos de desarrollo y estado actual de las pantallas en evolución (qué está mockeado, qué está conectado al BE y qué falta o está como WIP) en la [Wiki](https://github.com/salometredici/tacs-2026-c1-FE/wiki)
