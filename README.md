# arkon-test (TypeScript)

Backend test akron test api.


## Requirements
- Node.js >= 20
- npm >= 9
- Docker & Docker Compose
- MySQL >= 8.0


## Quick start

1. Copy `.env.example` to `.env` and adjust DB settings if needed.

2. Start with Docker:

```bash
docker-compose up --build
```

It is not necessary to run npm install, but it is required to do so.

```bash
npm install
```
## Rest Endpoints

API will be on http://localhost:3000/api for api 

## GraphQL Endpoints

- `http://localhost:3000/graphql`

*In the root directory is the docs folder where the postman file is located for your use.


## Scripts

- `npm run dev` - start in dev mode with ts-node-dev
- `npm run build` - compile to `dist`
- `npm start` - run compiled `dist`
- `npm test` - run tests (uses ts-jest)

## Notes

- Tests focus on business rules (use cases) using jest mocks for repositories.
- Database migrations are in `src/infrastructure/database/migrations` and will be executed by MySQL container on startup.


```markdown
## Project Structure

- src/
  - application/   # use cases
  - domain/        # entities, value objects, exceptions
  - infrastructure/# database, repositories, external services
  - presentation/  # GraphQL resolvers, controllers
- tests/           # unit tests
- docs/            # postman collection and documentation