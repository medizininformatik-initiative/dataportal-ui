# Installation

The Dataportal UI is an Angular 19 application. It needs a running backend and a Keycloak server to start.

## Prerequisites

- Node.js 22 (the CI uses Node 22)
- npm
- A running [dataportal backend](https://github.com/medizininformatik-initiative/dataportal-backend) with Elasticsearch and an ontology
- A Keycloak realm with a client for the UI (see [Backend & Auth](./backend))

## Start the development server

```bash
npm install
npm start
```

Open `http://localhost:4200`. The app redirects you to the Keycloak sign-in page first.

The dev server forwards these paths (see `proxy.conf.json`):

| Path          | Target                  |
| ------------- | ----------------------- |
| `/api`        | `http://localhost:8090` |
| `/aqleditor`  | `http://localhost:8091` |

## Local backend stack

The E2E tests use a Docker Compose stack with backend, Keycloak, PostgreSQL and Elasticsearch. You can use the same stack for development:

```bash
cd cypress/docker
docker compose up -d
```

The test user is `testuser` / `testpassword`. Use it only on your local machine.

::: warning Ontology version
The backend image ships its own ontology. Elasticsearch must load the same ontology version. If the versions differ, the concept search in filters returns no results, because the value set URLs do not match.
:::

## Build

```bash
npm run build
```

The production build goes to `dist/`. The Docker image (`docker/Dockerfile`) serves it with nginx.

## Tests

| Command                | What it runs                          |
| ---------------------- | ------------------------------------- |
| `npm test`             | Jest unit tests                       |
| `npm run test-ci`      | Jest with JUnit report and coverage   |
| `npm run lint`         | ESLint                                |
| `npm run cypress`      | Cypress, interactive                  |
| `npm run cypress:run`  | Cypress, headless in Chrome           |
| `npm run gherkin:lint` | Lint for the `.feature` files         |

See [Behaviour Specification](./testing) for how the Gherkin features describe the UI.

## Documentation

```bash
npm run docs:dev      # live preview
npm run docs:build    # static site in docs/.vitepress/dist
```
