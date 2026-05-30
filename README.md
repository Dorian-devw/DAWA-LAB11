# Parte B — next-shadcn-ui (documentación detallada)

Este documento describe en detalle la rama "Parte B" del workspace: el proyecto `next-shadcn-ui`. Incluye la estructura, los cambios realizados durante la depuración, instrucciones de desarrollo y despliegue, y soluciones a problemas frecuentes.

## Resumen del proyecto

`next-shadcn-ui` es una plantilla Next.js (App Router) que integra los componentes y patrones de `shadcn/ui` con Tailwind CSS y una estructura pensada para prototipado rápido y producción. Está configurado para Next.js 16.x con Turbopack.

## Estructura principal

- `app/` — rutas de la aplicación (App Router). Contiene `layout.tsx`, `globals.css`, y `dashboard/page.tsx` con la UI principal.
- `components/` — componentes reutilizables (forms, UI primitives, `DashboardContext.tsx`, etc.).
- `lib/` — tipos y utilidades (ej. `types.ts`, `utils.ts`).
- `public/` — activos estáticos.
- `package.json` / `next.config.ts` — configuración del proyecto.

## Cambios y justificación (detallado)

1. Seeds por defecto y fallbacks
	- Se añadieron datos de ejemplo (`sampleProjects`, `sampleTeam`, `sampleTasks`) en `components/DashboardContext.tsx` para que la vista `/dashboard` siempre muestre contenido al arrancar en desarrollo o tras despliegues estáticos. Esto facilita pruebas sin depender de APIs externas.

2. Normalización de prioridades
	- En `components/ProjectForm.tsx` se normalizaron las opciones de prioridad a `Baja`, `Media`, `Alta`, `Urgente` para mantener consistencia con los tipos en `lib/types.ts` y con la interfaz de usuario en español.

3. Paleta global naranja/blanco
	- `app/globals.css` contiene variables CSS con la paleta solicitada (naranja + blanco) y ajustes para temas claros/oscuro. Esto garantiza consistencia visual en todos los componentes.

4. Corrección de error de JSX en `app/dashboard/page.tsx`
	- Se detectó y eliminó un cierre JSX duplicado dentro del `projects.map` que provocaba un error de parse durante el build en Vercel. El cambio permitió que Turbopack compile correctamente.

5. Manejo de fuentes (Turbopack)
	- Durante pruebas de build en Vercel, Turbopack reportó errores al resolver `next/font/google`. Para evitar fallos de compilación en entornos que no expongan acceso a Google Fonts en tiempo de build, se removió temporalmente el import desde `next/font/google` (`app/layout.tsx`). Si se desea, se puede restaurar la estrategia de carga con alguna de las alternativas sugeridas más abajo.

6. Tipos TypeScript y dependencias
	- Se añadió `@types/uuid` como dependencia de desarrollo para resolver el error de tipado en `components/DashboardContext.tsx` donde se usa `uuid` para generar IDs.

## Cómo ejecutar en desarrollo

1. Instalar dependencias:

```bash
npm install
```

2. Ejecutar servidor de desarrollo:

```bash
npm run dev
```

3. Abrir en el navegador:

```
http://localhost:3000
```

Consejo: si quieres forzar la carga de datos de ejemplo, abre la página `/dashboard` y verifica que aparecen `projects`, `team` y `tasks` sin necesidad de APIs.

## Build y despliegue (Vercel)

Recomendaciones y pasos para despliegue en Vercel:

- Ejecuta localmente el build para validar antes de push:

```powershell
npm run build
```

- Evita commitear archivos locales temporales (por ejemplo `.env.local` o scripts de mitigación que limitan Turbopack) al repositorio.

- Si el build en Vercel falla por problemas con fuentes y Turbopack (errores tipo `Can't resolve '@vercel/turbopack-next/internal/font/google/font'`), aplica una de estas alternativas:
  1. Servir fuentes localmente: descargar los `.woff2` necesarios a `public/fonts/` y referenciarlos desde `globals.css`.
  2. Usar un CDN (preferentemente con URLs directas accesibles en el entorno de build) en lugar de `next/font/google`.
  3. Restaurar `next/font/google` solo si estás seguro de que el entorno de build puede acceder a `fonts.gstatic.com`.

## Seeds y datos por defecto

Los seeds están en `components/DashboardContext.tsx`. Contienen ejemplos de:

- Proyectos (id, nombre, descripción, prioridad, owner)
- Equipo (miembros con nombre, rol y avatar)
- Tareas (asignadas a proyectos, con estado y prioridad)

Estos datos se usan como estado inicial y permiten que las vistas muestren contenido inmediatamente.

## Temas, estilos y paleta

- `app/globals.css`: define variables CSS para la paleta naranja/blanco y las clases base. Cambia las variables en `:root` para ajustar tonos.
- Componentes UI usan Tailwind + estilos modulados (`*.module.css`) para mantener encapsulación.

## Problemas comunes y soluciones rápidas

- Error TypeScript por `uuid`: ejecutar `npm i --save-dev @types/uuid` (ya aplicado en este repositorio).
- Build fallando en Vercel por fuentes: ver sección "Build y despliegue" y aplicar alguna alternativa de carga de fuentes.
- Vistas vacías en `/dashboard`: asegurarse de que `DashboardContext` inicializa `projects`, `team` y `tasks` con seeds. Si no, reiniciar el servidor de dev.

## Cómo contribuir

1. Crea una rama por feature: `git checkout -b feat/mi-cambio`.
2. Añade tests o verifica manualmente en `npm run dev`.
3. Haz PR con descripción clara de cambios y pasos para reproducir.

## Contacto y notas finales

Si necesitas que:

- restaure la carga de Google Fonts con una estrategia concreta, lo hago y pruebo el build en local y en Vercel;
- incorpore un comando para cargar datos de ejemplo desde un script (`npm run seed`);
- muestre nombres de proyecto en la tabla de tareas (me lo pides y lo implemento).

---

Documento generado como guía detallada de la Parte B (`next-shadcn-ui`).
