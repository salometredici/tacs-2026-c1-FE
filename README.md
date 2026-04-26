# TACS 2026 C1 — Frontend

Frontend en React + TypeScript para la plataforma de intercambio de figuritas.

## Requisitos

- [Docker](https://www.docker.com/) y Docker Compose
- O Node.js 22+ para desarrollo local

## Levantar con Docker (stack completo)

Ambos repos deben estar clonados en la misma carpeta padre:

```
carpeta-padre/
├── tacs-2026-c1-FE/   ← este repo
└── tp1c2026/          ← repo del backend
```

Desde dentro de `tacs-2026-c1-FE/`, ejecutar:

```bash
docker compose up --build
```

| Servicio  | URL                    |
|-----------|------------------------|
| Frontend  | http://localhost:80    |
| Backend   | http://localhost:8080  |

## Levantar en modo local (dev)

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
