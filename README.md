# Phone Catalog

Catálogo de teléfonos móviles desarrollado con React, TypeScript y Vite.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 18
- pnpm (recomendado)

### Instalación

```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Instalar dependencias
pnpm install

# Variables de entorno
cp .env.example .env
# Editar .env y agregar tu API_KEY
```

### Scripts Disponibles

- `pnpm dev`: Inicia el servidor de desarrollo
- `pnpm build`: Construye la aplicación para producción
- `pnpm test`: Ejecuta los tests
- `pnpm lint`: Ejecuta el linter

## 🏗 Arquitectura

El proyecto sigue los principios de Clean Architecture y Domain-Driven Design (DDD):

```
src/
├── modules/          # Módulos de dominio
│   ├── phone/       # Módulo de teléfonos
│   │   ├── application/    # Casos de uso
│   │   ├── domain/        # Entidades y repos
│   │   └── infrastructure/ # Implementaciones
│   └── cart/        # Módulo de carrito
├── components/      # Componentes React
└── context/        # Contextos de React
```

### Patrones y Decisiones

- **Clean Architecture**: Separación en capas (domain, application, infrastructure)
- **Context API**: Gestión del estado global con React Context
- **Repository Pattern**: Abstracción del acceso a datos
- **Use Cases**: Lógica de negocio encapsulada en casos de uso

## 🎨 Características Técnicas

- **Frontend**: React 19 con TypeScript
- **Build**: Vite para desarrollo y producción
- **Testing**: Vitest para pruebas unitarias
- **State**: React Context API para estado global
- **Autenticación**: API Key en headers
- **Estilos**: CSS Modules con variables CSS
- **Linting**: ESLint con configuración TypeScript

## 📱 Responsive Design

- Grid system adaptativo
- Media queries para diferentes breakpoints
- Unidades relativas (rem, em)
- Diseño mobile-first

## ♿ Accesibilidad

- Elementos HTML semánticos
- Atributos ARIA cuando necesario
- Alto contraste en textos
- Navegación por teclado
- Estados interactivos claros

## 🔧 Desarrollo

El proyecto tiene dos modos principales:

- **Desarrollo**: Assets sin minificar, hot reload
- **Producción**: Assets optimizados y minificados

## 📚 Documentación API

La API requiere autenticación mediante `x-api-key` en los headers:

```typescript
headers: {
  'x-api-key': process.env.VITE_API_KEY
}
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x"
import reactDom from "eslint-plugin-react-dom"

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
