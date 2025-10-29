# CMME 2025

Modern rewrite of Theodor Dumitrescu’s mensural notation editor (mensural music notation viewer/editor).

> **Estado**: import inicial y puesta a punto del repo. Se ha migrado a **Git LFS** los binarios (TTF/ICO/GIF/PSD).

## Requisitos

- **Node.js 18+** (o 20+ recomendado)
- **npm** (o pnpm/yarn si prefieres)
- Git LFS activado en el repo (ya configurado)

## Instalación

```bash
npm ci
```

> Si `npm ci` falla, usa `npm install` y avísame para fijar versiones.

## Scripts habituales

```bash
# Compilar
npm run build

# Desarrollo (dev server / watcher)
npm run start

# Linter (si está configurado)
npm run lint

# Tests (si/cuando los añadamos)
npm test
```

## Estructura (resumen)

```
src/                 # Código TypeScript (núcleo del editor/visor)
  DataStruct/        # Modelos y estructuras musicales (mensural, eventos, etc.)
  Editor/            # UI y lógica del editor
  Gfx/               # Renderizado, fuentes, PDF, MusicXML
  Util/              # Utilidades y glue code
  Viewer/            # Entradas del visor
  java*/ javax*/     # Adapts/ports de APIs “java-like” en TS

www/                 # Demo / assets web (HTML, CSS, bundles)
dist/                # Salida de build (si aplica)
webpack.config.js    # Bundler actual
package.json         # Dependencias y scripts
```

## Assets y Git LFS

Los binarios (p. ej., `*.ttf`, `*.ico`, `*.gif`, `*.psd`) están **trackeados con Git LFS**.  
Comandos útiles:

```bash
git lfs ls-files
git lfs push --all origin
git lfs fsck
```

## Hoja de ruta (propuesta)

- 🔧 Migración de Webpack a **Vite** o esbuild.
- 📦 Posible modularización (core/renderer/UI).
- 🧭 **TypeScript estricto** y limpieza de APIs “java-like”.
- ✅ Tests + **CI** (Forgejo Actions en Codeberg).
- 🌐 Demo pública con ejemplos.
- 📝 Documentación de `.cmme.xml` y conversión a MusicXML.
- ♿ Accesibilidad básica del UI.
- 🔐 Revisión de licencias de **fuentes** y **assets**.

## Contribuir

1. Crea rama desde `main`:  
   `git checkout -b feat/nombre`
2. Commits pequeños y claros  
3. Pull Request a `main`

## Créditos

- Basado en el trabajo original de **Theodor Dumitrescu**.  
- Reescritura y mantenimiento: **Ángel Manuel Olmos**.

## Licencia

> **Por decidir.** Revisa la licencia del código/recursos originales antes de publicar en abierto.
