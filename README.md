# Inditex Product Catalog

A modern web application built with React, TypeScript, and Vite for browsing and managing phone products, featuring a shopping cart functionality and clean architecture.

## 🌐 Demo

Check out the live demo: [Inditex Catalog](https://inditex-catalog.vercel.app/)

## 🚀 Features

- Product catalog browsing
- Search functionality
- Product details view
- Shopping cart management
- Local storage persistence
- Clean Architecture implementation
- Comprehensive test coverage

## 🛠️ Tech Stack

- React 18
- TypeScript
- Vite
- Vitest for testing
- CSS for styling
- Clean Architecture pattern

## 📦 Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd inditex-catalog
```

2. Install dependencies using pnpm:

```bash
pnpm install
```

## 🚀 Running the Application

### Development mode

```bash
pnpm dev
```

This will start the development server at `http://localhost:5173`

### Build for production

```bash
pnpm build
```

### Run tests

```bash
pnpm test
```

## 🏗️ Project Structure

```
src/
├── components/         # React components
│   ├── cart/          # Cart related components
│   ├── layout/        # Layout components
│   ├── phone/         # Phone related components
│   └── ui/            # Reusable UI components
├── context/           # React context providers
├── modules/           # Clean Architecture modules
│   ├── cart/         # Cart module
│   │   ├── application/
│   │   ├── domain/
│   │   └── infrastructure/
│   └── phone/        # Phone module
│       ├── application/
│       ├── domain/
│       └── infrastructure/
└── styles/           # CSS styles
```

## 🏗️ Architecture

This project follows Clean Architecture principles with three main layers:

- **Domain Layer**: Contains business logic and entities
- **Application Layer**: Contains use cases and business rules
- **Infrastructure Layer**: Contains implementations of repositories and external services

## 💾 Data Persistence

- Shopping cart data is persisted using LocalStorage
- Product data is fetched from an API

## 🧪 Testing

The project includes comprehensive tests for:

- Components (using Vitest)
- Use Cases
- Repositories
- Domain entities

Run tests with:

```bash
pnpm test
```

## 🔧 Configuration

The application can be configured through various configuration files:

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details
