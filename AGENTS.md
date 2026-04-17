# Repository Guidelines

## Project Structure & Module Organization
This repository contains two apps:

- `spring/`: Spring Boot backend. Java sources live under `spring/src/main/java/com/example/cude/`, grouped into `controllers`, `models`, `repos`, `servers`, `config`, `dto`, and `utils`. Backend tests live in `spring/src/test/java/`.
- `react-ts/`: Vite + React + TypeScript frontend. App code lives in `react-ts/src/`, with UI in `components/`, route pages in `pages/`, Zustand state in `stores/`, and shared types in `types/`. Static assets live in `react-ts/public/` and `react-ts/src/assets/`.
- `docker-compose.yml`: Local PostgreSQL service for the backend.

## Build, Test, and Development Commands
- `docker compose up -d`: start PostgreSQL on `localhost:5432` with the credentials from `spring/src/main/resources/application.properties`.
- `cd spring; ./mvnw spring-boot:run`: run the backend on port `8080`.
- `cd spring; ./mvnw test`: run JUnit tests.
- `cd react-ts; npm install`: install frontend dependencies.
- `cd react-ts; npm run dev`: start the Vite dev server.
- `cd react-ts; npm run build`: type-check and build the frontend.
- `cd react-ts; npm run lint`: run ESLint on `ts` and `tsx` files.

## Coding Style & Naming Conventions
Use 4 spaces in Java and the existing TypeScript formatting style in `react-ts/src/`. Keep Java packages lowercase under `com.example.cude`; use `PascalCase` for classes, `camelCase` for methods and fields, and suffix controllers/services consistently, for example `ProductController` and `UserService`. In React, use `PascalCase` component files such as `AddProduct.tsx`, and keep hooks and Zustand stores in `camelCase`, for example `useProducts.ts`.

## Testing Guidelines
Backend tests use JUnit 5 with Spring Boot test support. Place tests under `spring/src/test/java/` and name them `*Tests.java`. The repository currently includes only a basic context-load test, so add focused controller, service, and repository tests for new behavior. The frontend does not yet have a test runner configured; at minimum, run `npm run lint` and `npm run build` before opening a PR.

## Commit & Pull Request Guidelines
Recent commits use short, imperative messages such as `add jwt` and `config security`. Keep commits focused and use the same style: lowercase, concise, and action-first. PRs should include a short description, note backend/frontend impact, link the issue if one exists, and include screenshots or API examples when behavior changes.

## Security & Configuration Tips
Do not commit real secrets. `application.properties` currently contains local development credentials; treat them as placeholders only. If you change database or auth settings, update both `docker-compose.yml` and the backend configuration together.
