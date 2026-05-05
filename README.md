# TACS 2026 C1 — Frontend

Frontend en React + TypeScript para la plataforma de intercambio de figuritas.

## Levantar el stack completo

El stack completo (mongo + backend + frontend) se levanta desde el repo del backend. Ver [README del backend](https://github.com/Leo-de-Riv3r/tp1c2026).

## Desarrollar en local

**Requisitos:** Node.js 22+

El backend debe estar corriendo en el puerto 8080 antes de arrancar el frontend (ver README del backend).

```bash
npm install
npm run dev
```

La app estará disponible en http://localhost:5173.

El dev server tiene un proxy configurado que redirige `/api` → `http://localhost:8080`, por lo que no hace falta configurar ninguna variable de entorno.

## Variables de entorno

| Variable          | Valor por defecto     | Descripción                                      |
|-------------------|-----------------------|--------------------------------------------------|
| VITE_API_BASE_URL | http://localhost:8080 | URL base del backend (solo para el build Docker) |

En modo dev no hace falta — el proxy de Vite lo maneja automáticamente.

## Documentación

Decisiones de arquitectura y lineamientos de desarrollo en la [Wiki del proyecto](https://github.com/salometredici/tacs-2026-c1-FE/wiki).
