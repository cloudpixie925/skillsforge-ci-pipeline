# Packages the output of `npm run build` (dist/) into a small runtime image.
# The app is NOT rebuilt here: in CI the package job downloads dist/ as an
# artifact from the build job. Locally, run `npm run build` first.
FROM node:24-alpine

ARG APP_VERSION=dev
ENV NODE_ENV=production \
    PORT=3000 \
    APP_VERSION=${APP_VERSION}

WORKDIR /app

# dist/server.cjs is a self-contained bundle, so no node_modules are needed.
COPY --chown=node:node dist/ ./dist/

# Never run as root inside the container.
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1

CMD ["node", "dist/server.cjs"]
