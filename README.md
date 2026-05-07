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
4. Set the repository URL, branch, and compose path:

```text
docker-compose.yml
```

5. Deploy the stack.

The stack builds the Next.js app from `Dockerfile` and exposes the container
on port `3000` by default. To use a different host port in Portainer, set this
environment variable before deploying:

```text
EMWAC_WEB_PORT=3003
```

If the Portainer environment is Docker Swarm, build the image in CI or locally,
push it to a registry, and replace the `build` section in `docker-compose.yml`
with the registry image name. Swarm stacks do not build images during deploy.

## Product scope

This repository currently contains a frontend-only MVP that uses typed mock monitoring data.
Live data ingestion, persistence, and production algorithm services are intentionally out of scope for this iteration.
