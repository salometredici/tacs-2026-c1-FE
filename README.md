# TACS 2026 C1 — Frontend

Frontend en React + TypeScript para la plataforma de intercambio de figuritas del Mundial 2026

## Levantar el stack completo

La forma sugerida es levantar todo desde el repo del backend, que ya orquesta los 5 servicios (mongo + mongo-init + mongo-seed + backend + frontend) con healthchecks y dependencias entre sí. Ver instrucciones en el [README del backend](https://github.com/Leo-de-Riv3r/tp1c2026)

Con esa opción no hace falta clonar este repo: el servicio `frontend` del compose pullea la imagen publicada en GHCR (correspondiente al tag de la Entrega actual)

## Levantar con el compose local del frontend

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
3. **mongo-seed** — corre `seed/seed.js` y carga el catálogo de 500 figuritas + los usuarios de prueba. Termina y sale
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

## Usuarios de prueba

Todos los users del seed comparten el mismo password: **`123456`**

| Email                    | Rol   | Notas                                                                            |
|--------------------------|-------|----------------------------------------------------------------------------------|
| `peperacing@gmail.com`   | USER  | Tiene cards en colección (3x card_001, 2x card_005, 1x card_010) y missing cards |
| `moniargento@gmail.com`  | USER  | Tiene 2 publicaciones activas (card_003 y card_004)                      |
| `dfuseneco@outlook.com`  | USER  | Usuario "vacío" — sin colección, faltantes, publicaciones ni propuestas. Para probar los empty states de cada sección |
| `admin@mail.com`         | ADMIN | Usuario administrador. Login desde la misma pantalla — el FE detecta el rol del JWT y redirige a `/admin` |

> **Corrección respecto de la entrega anterior:** el admin ya no se valida contra variables `ADMIN_EMAIL`/`ADMIN_PASSWORD` del `.env`. Ahora es un `User` más en Mongo con campo `role: ADMIN`. El endpoint de login es único (`POST /api/auth/login`) y el FE decodifica el claim `role` del JWT para decidir a qué UI redirigir

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
