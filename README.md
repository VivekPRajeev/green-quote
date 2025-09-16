# Green Quote

A minimal end-to-end app that lets an authenticated user request a pre-qualification
quote for a residential solar system and view results

## Tech Stack

- **Frontend & Backend**: [Next.js 15](https://nextjs.org/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL 15](https://www.postgresql.org/)
- **Authentication**: [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken), [jose](https://github.com/panva/jose)
- **API Docs**: [zod-openapi](https://github.com/asteasolutions/zod-to-openapi) + [swagger-ui-react](https://github.com/swagger-api/swagger-ui)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **PDF Rendering**: [Puppeteer](https://pptr.dev/)
- **Testing**: [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/)

---

## Running with Docker

### 1. Clone the repository

```bash

git clone https://github.com/VivekPRajeev/green-quote.git
cd green-quote

```

### 2. Environment Variables setup

create a .env file and add the variables (refer .env.example)

### 3. Running the project

#### Production mode

```bash

docker-compose up --build web

```

- Next.js app runs on: http://localhost:3000
- Postgres runs on port 5432

This will run:

- npx wait-on tcp:db:5432
- npx prisma migrate deploy
- npm run seed
- npm run start

#### Development mode (hot reload)

```bash

docker-compose up --build web-dev

```

- Next.js app runs on: http://localhost:3001
- Code changes reload automatically (via bind mount)

This will run:

- npx wait-on tcp:db:5432
- npx prisma migrate de
- npm run dev

### 4. Database & Prisma

Run migrations

#### Production:

```bash

docker-compose exec web npx prisma migrate deploy

```

#### Development:

```bash

docker-compose exec web-dev npx prisma migrate dev

```

#### Seed the database

```bash

docker-compose exec web npm run seed

```

### 5. API Documentation

Swagger UI is included via swagger-ui-react.
If mounted at /api/docs, open:
for dev enviornments you can find the doc at :
http://localhost:3001/api/docs

### 6. 🧪 Development & Testing

Run tests

```bash

npm test

```

Watch mode:

```bash

npm run test:watch

```

Coverage:

```bash

npm run test:coverage

```

Linting & Formatting

Run ESLint:

```bash

npm run lint


```

Format with Prettier:

```bash

npx prettier --write .

```

### Scripts overview

```bash

npm run dev → Start Next.js in development mode
npm run build → Build for production
npm run start → Run the built app in production
npm run seed → Seed the database with initial data
npm run test → Run Jest tests
npm run test:watch → Run tests in watch mode
npm run test:coverage → Run tests with coverage report
npm run lint → Run ESLint

```

### Docker Commands

Rebuild containers

```bash

docker-compose build --no-cache

```

View logs

```bash

docker-compose logs -f web

```

Access DB shell

```bash

docker-compose exec db psql -U postgres -d green_quote

```

Stop containers

```bash

docker-compose down

```

## Architecture

- web → Production container (optimized, no hot reload)
- web-dev → Development container (hot reload, bind mount local code)
- db → PostgreSQL database container
