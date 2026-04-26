# TACS 2026 C1 — Frontend

Frontend en React + TypeScript para la plataforma de intercambio de figuritas.

## Levantar con Docker (stack completo)

**Requisitos:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) corriendo + [`mongosh`](https://www.mongodb.com/try/download/shell) en el PATH

Ambos repos deben estar clonados en la misma carpeta padre tal cual se clonan de GitHub:

```
carpeta-padre/
├── tacs-2026-c1-FE/   ← este repo
└── tp1c2026/          ← repo del backend
```

Desde dentro de `tacs-2026-c1-FE/`:

**Primera vez (o al resetear la base):**
```bash
docker compose up --build -d
# esperar ~10 segundos a que Mongo esté listo
mongosh "mongodb://localhost:27018/tacs_db" --file ../tp1c2026/backend/seed/seed.js
```

**Levantar sin resetear:**
```bash
docker compose up -d
```

| Servicio  | URL                                       |
|-----------|-------------------------------------------|
| Frontend  | http://localhost (puerto 80, default HTTP) |
| Backend   | http://localhost:8080                     |
| MongoDB   | localhost:27018                           |

## Levantar en modo local (dev)

**Requisitos:** Node.js 22+

```bash
npm install
npm run dev
```

La app estará disponible en http://localhost:5173.  
Asegurarse de que el backend esté corriendo por separado en el puerto 8080, o ajustar `VITE_API_BASE_URL` en `.env`.

## Variables de entorno

| Variable           | Valor por defecto        | Descripción              |
|--------------------|--------------------------|--------------------------|
| VITE_API_BASE_URL  | http://localhost:8080    | URL base del backend     |

## Documentación

La guía de setup completa, decisiones de arquitectura y lineamientos de desarrollo están en la [Wiki del proyecto](https://github.com/salometredici/tacs-2026-c1-FE/wiki).
