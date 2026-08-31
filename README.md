# RiwiMediCare Plus — Supply Request Management API

REST API built for the "Prueba de desempeño – Módulo 5.2 Node.js". It manages
clinics, warehouses, medication inventory and medication supply requests for
RiwiMediCare Plus, replacing the previous email/spreadsheet-based workflow.

## Coder

- **Name:** Luis Rafael Reyes Caro
- **Clan:** _<NodeJS Nest AM>_

## Tech stack

- **Node.js** 18+ / **TypeScript**
- **Express 5**
- **Sequelize** (ORM) + **PostgreSQL**
- **JSON Web Token (jsonwebtoken)** for authentication
- **bcrypt** for password hashing
- **Multer** for the JSON-based database seeding endpoint
- **Swagger** (`swagger-jsdoc` + `swagger-ui-express`) for API documentation
- **Docker** / **Docker Compose**
- **tsx** for running TypeScript directly in development

## Project structure

```
app/
├── index.ts                # App entrypoint: middleware, routers, error handling
├── Dockerfile
└── src/
    ├── config/              # Sequelize/database connection
    ├── controllers/         # Request handlers (one per resource) + BaseController
    ├── dto/                 # TypeScript interfaces for request/response shapes
    ├── middleware/          # Auth, role checks, per-resource business validations
    ├── models/              # Sequelize models
    ├── repository/          # Data-access layer (only layer that talks to Sequelize)
    ├── routes/               # Express routers + Swagger (@openapi) documentation
    ├── seeder/               # Fixed-user seeder (npm run seed)
    ├── services/             # Business logic layer
    ├── utils/                # Shared helpers (bcrypt, JWT, validation, Sequelize)
    └── doc/swagger.ts        # OpenAPI base configuration
docker-compose.yml
.env.example
```

## Installation

### Prerequisites

- Node.js 18 or higher (only needed for running outside Docker)
- Docker and Docker Compose (recommended way to run the project)
- PostgreSQL 17 (only needed if you run the API outside Docker, without the provided `db` container)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/LuisReyes970304/prueba_de_desempeno_node.git
   cd prueba_de_desempeno_node
   ```
2. Copy the example environment file and adjust it if needed:
   ```bash
   cp .env.example .env
   ```
3. Run it with Docker Compose (see below), or install dependencies locally:
   ```bash
   cd app
   npm install
   ```

## Environment variables

Create a `.env` file at the project root (same folder as `docker-compose.yml`) based on `.env.example`:

```env
SERVER_CONTAINER_NAME=crud-application
SERVER_PORT=3015
SERVER_URL=http://localhost
SERVER_CPU_LIMIT=2
SERVER_MEM_LIMIT=512MB

POSTGRES_USER=your_postgres_user
POSTGRES_DB=your_database_name
POSTGRES_PASSWORD=your_postgres_password

POSTGRES_HOST=db
POSTGRES_PORT=5432
DB_CPU_LIMIT=2
DB_MEN_LIMIT=512MB

JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=1h
```

> `POSTGRES_HOST` must be `db` when running through Docker Compose (the service
> name in `docker-compose.yml`), or `localhost` when running the API directly
> against a locally installed PostgreSQL.
>
> `JWT_SECRET` must never be a guessable value in a real deployment — the one
> above is only a placeholder.

## Running the project

### Option A — Docker Compose (recommended)

From the project root:

```bash
docker compose up --build
```

This builds the API image, starts a PostgreSQL container with a persistent
volume, waits for the database to be healthy, seeds the two fixed base users,
and starts the API in watch mode. The API will be available at
`http://localhost:3015`, and the Swagger docs at `http://localhost:3015/docs`.

To stop it:

```bash
docker compose down
```

### Option B — Running locally (without Docker)

Requires a running PostgreSQL instance reachable with the credentials in your
`.env` file.

```bash
cd app
npm install
npm run seed   # seeds the two fixed base users (see below)
npm run dev    # starts the API with tsx --watch
```

## Seeding the database

There are two independent ways to populate the database:

### 1. Fixed user seeder (`npm run seed`)

```bash
cd app
npm run seed
```

Creates two fixed users you can log in with right away (idempotent — running
it again does not create duplicates):

| Name | Email | Password | Role |
|---|---|---|---|
| Luis Reyes | luisreyescaro@gmail.com | LuisDev2026! | admin |
| Demo User | user@gmail.com | DemoUser2026! | manager |

This runs automatically before `npm run dev` in Docker Compose, via the
`start` script (`npm run seed && npm run dev`).

### 2. JSON upload endpoint (Multer) — clinics, warehouses, medications, users

`POST /seed/upload` accepts a JSON file (via `multipart/form-data`, field name
`file`) and populates any combination of `users`, `clinics`, `warehouses` and
`medications`. It requires a valid **admin** JWT. Seeding is idempotent: rows
that already exist (matched by a natural unique key — email, NIT, name) are
skipped instead of duplicated, and a single invalid row does not abort the
rest of the batch.

An example file is provided at `app/src/seed-data.example.json`. To use it:

```bash
# 1. Log in as an admin to get a token
curl -X POST http://localhost:3015/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"luisreyescaro@gmail.com","password":"LuisDev2026!"}'

# 2. Upload the seed file with that token
curl -X POST http://localhost:3015/seed/upload \
  -H "Authorization: Bearer <token_from_step_1>" \
  -F "file=@app/src/seed-data.example.json"
```

The response includes a per-entity summary of how many rows were created,
skipped, or failed (with the reason for each failed row).

## API documentation

Full Swagger UI documentation is available at `http://localhost:3015/docs`
once the server is running, including request bodies, parameters and response
codes for every endpoint. Use the "Authorize" button there to paste a JWT and
try out protected endpoints directly from the browser.

### Endpoint overview

| Resource | Base path | Notes |
|---|---|---|
| Auth | `/auth` | `POST /auth/login` |
| Users | `/user` | `POST /user/create_user` is public (self-selects role: `admin` or `manager`) |
| Clinics | `/clinic` | Admin-only writes; NIT duplication is validated |
| Warehouses | `/warehouse` | Admin-only writes |
| Medications | `/medication` | Admin-only writes |
| Inventory | `/inventory` | Stock per warehouse/medication pair; admin-only writes |
| Supply requests | `/requests` | Create/update-status: admin + manager; full CRUD: admin only |
| Seed upload | `/seed/upload` | Admin-only, Multer JSON upload |

All routes require a JWT (`Authorization: Bearer <token>`) except
`POST /user/create_user` and `POST /auth/login`.

## Repository

https://github.com/LuisReyes970304/prueba_de_desempeno_node
