# Contribuyendo a Órbita 2

Gracias por tu interés en contribuir a **Órbita 2**.

## Primeros pasos

1. **Cloná** el repositorio.
2. **Instalá las dependencias:**

   ```bash
   pnpm install
   ```

3. **Configurá las variables de entorno:**

   ```bash
   cp .env.example .env.local
   ```

4. **Levantá el proyecto en desarrollo:**

   ```bash
   pnpm dev
   ```

5. Creá una rama para tu contribución:

   ```bash
   git checkout -b feat/tu-feature
   ```

---

## Estándares de código

- Seguí la configuración de **ESLint** y **Prettier** existente.
- Todo el código debe ser **type-safe** con TypeScript.
- Mantené la estructura feature-based existente en `src/features/`.
- Los servicios de datos deben respetar el patrón de filtrado por `sede_id`.

Antes de hacer un PR, ejecutá:

```bash
pnpm lint && pnpm format && pnpm build
```

---

## Mensajes de commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(modulo): descripción corta
fix(modulo): descripción corta
refactor(modulo): descripción corta
docs: descripción corta
chore: descripción corta
```

---

## Pull Requests

- Seguí el template de PR incluido.
- Mantené los PRs enfocados y concisos.
- Referenciá los issues relacionados.
