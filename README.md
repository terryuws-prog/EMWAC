# EMWAC

## Workspace

- `docs/` holds the PRD and planning docs.
- `apps/web` contains the MVP frontend.

## Local development

```bash
pnpm install
pnpm dev
```

## Quality checks

```bash
pnpm lint
pnpm test
pnpm e2e
```

## Portainer deployment

This project can be deployed as a Portainer stack from a Git repository.

1. Push this repository to GitHub.
2. In Portainer, open the target environment.
3. Go to `Stacks` -> `Add stack` -> `Git repository`.
4. To deploy only the internal EMWAC service, set the compose path:

```text
docker-compose.yml
```

5. To deploy the production reverse-proxy stack that serves both apps, set the compose path:

```text
CAMATHERN2/docker-compose.yml
```

6. Deploy the stack.

The root stack builds the Next.js app from `Dockerfile` and exposes port `3000`
only inside Docker. The production proxy stack is the only public listener on
host port `3000`; it routes `/` to the new EMWAC service and `/cam/` plus the
legacy `/carmarthenshire/` path to CAMATHERN2.

If the Portainer environment is Docker Swarm, build the image in CI or locally,
push it to a registry, and replace the `build` section in `docker-compose.yml`
with the registry image name. Swarm stacks do not build images during deploy.

## Product scope

This repository currently contains a frontend-only MVP that uses typed mock monitoring data.
Live data ingestion, persistence, and production algorithm services are intentionally out of scope for this iteration.
