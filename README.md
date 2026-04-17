# CUDE App

A full-stack web application built with Spring Boot backend and React + TypeScript frontend.

## Project Structure

```
learn-spring-boot/
├── spring/                 # Spring Boot backend
│   ├── src/main/java/com/example/cude/
│   │   ├── controllers/    # REST API endpoints
│   │   ├── models/         # JPA entities
│   │   ├── repos/          # Data repositories
│   │   ├── services/       # Business logic
│   │   ├── config/         # Security & app config
│   │   ├── dto/            # Data transfer objects
│   │   └── utils/          # Utility classes
│   └── src/test/java/      # JUnit tests
├── react-ts/               # Vite + React + TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── stores/         # Zustand state management
│   │   └── types/          # TypeScript types
│   └── public/             # Static assets
└── docker-compose.yml      # Local PostgreSQL service
```

## Tech Stack

### Backend
- Java 17
- Spring Boot 4.0.0
- Spring Data JPA
- PostgreSQL
- Lombok
- Spring Security with JWT

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Zustand (state management)
- React Router 7
- Axios

## Prerequisites

- Java 17+
- Node.js 18+
- Docker & Docker Compose
- Maven (or use the included `mvnw` wrapper)

## Getting Started

### 1. Start the Database

```bash
docker compose up -d
```

This starts PostgreSQL on `localhost:5432` with the following credentials:
- **Database:** `mydb`
- **Username:** `myuser`
- **Password:** `mypassword`

### 2. Run the Backend

```bash
cd spring
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`

### 3. Run the Frontend

```bash
cd react-ts
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Development Commands

### Backend

| Command | Description |
|---------|-------------|
| `./mvnw spring-boot:run` | Start the Spring Boot server |
| `./mvnw test` | Run JUnit tests |
| `./mvnw clean install` | Build and package the application |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint on TypeScript files |
| `npm run preview` | Preview production build locally |

## Configuration

### Backend (`spring/src/main/resources/application.properties`)

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
spring.datasource.username=myuser
spring.datasource.password=mypassword
server.port=8080
jwt.secret=${JWT_SECRET:your-default-dev-secret}
app.cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

### Frontend (`react-ts/.env.example`)

Copy `.env.example` to `.env` and configure your API endpoint.

## Security

- JWT-based authentication
- CORS configured for local development origins
- **Do not commit real secrets** - use environment variables for production

## Testing

### Backend Tests

```bash
cd spring
./mvnw test
```

### Frontend Checks

```bash
cd react-ts
npm run lint
npm run build
```

## Code Style

- **Java:** 4 spaces, lowercase packages, `PascalCase` classes, `camelCase` methods/fields
- **TypeScript:** Follow existing formatting in `react-ts/src/`
- **Components:** `PascalCase` files (e.g., `AddProduct.tsx`)
- **Hooks/Stores:** `camelCase` (e.g., `useProducts.ts`)

## Contributing

1. Keep commits focused with short, imperative messages (e.g., `add jwt`, `config security`)
2. Include PR descriptions with backend/frontend impact
3. Run tests and lint before opening a PR
4. Link related issues when applicable

## License

This project is for learning purposes.
