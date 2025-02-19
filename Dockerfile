#############
# Serve Nuxt in development mode.

# Should be the specific version of `node:slim`.
# `sqitch` requires at least `buster`.
FROM node:18.11.0-slim@sha256:686940406cdfe77b43cf539fbe84ef653e2c715ecf9ea17751c09994f033c8bf AS development

ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /srv/app/

COPY ./docker-entrypoint.sh /usr/local/bin/

# Update and install dependencies.
# - `libdbd-pg-perl postgresql-client sqitch` is required by the entrypoint
# - `wget` is required by the healthcheck
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        libdbd-pg-perl postgresql-client sqitch \
        wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pnpm

VOLUME /srv/.pnpm-store
VOLUME /srv/app
VOLUME /srv/sqitch

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pnpm", "run", "dev"]

# Waiting for https://github.com/nuxt/framework/issues/6915
# HEALTHCHECK --interval=10s --start-period=60s CMD wget -O /dev/null http://localhost:3000/api/healthcheck || exit 1


########################
# Prepare Nuxt.

# Should be the specific version of `node:slim`.
# Could be the specific version of `node:alpine`, but the `prepare` stage uses slim too.
FROM node:18.11.0-slim@sha256:686940406cdfe77b43cf539fbe84ef653e2c715ecf9ea17751c09994f033c8bf AS prepare

WORKDIR /srv/app/

COPY ./nuxt/pnpm-lock.yaml ./

RUN npm install -g pnpm && \
    pnpm fetch

COPY ./nuxt/ ./

RUN pnpm install --offline && \
    pnpm nuxi prepare


########################
# Build Nuxt.

# Should be the specific version of `node:slim`.
# Could be the specific version of `node:alpine`, but the `prepare` stage uses slim too.
FROM node:18.11.0-slim@sha256:686940406cdfe77b43cf539fbe84ef653e2c715ecf9ea17751c09994f033c8bf AS build

ARG CI=false
ENV CI ${CI}
ARG NUXT_ENV_STACK_DOMAIN=maev.si
ENV NUXT_ENV_STACK_DOMAIN=${NUXT_ENV_STACK_DOMAIN}
ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /srv/app/

COPY --from=prepare /srv/app/ ./

ENV NODE_ENV=production
RUN npm install -g pnpm && \
    pnpm run build


########################
# Nuxt: lint

# Should be the specific version of `node:slim`.
# Could be the specific version of `node:alpine`, but the `prepare` stage uses slim too.
FROM node:18.11.0-slim@sha256:686940406cdfe77b43cf539fbe84ef653e2c715ecf9ea17751c09994f033c8bf AS lint

WORKDIR /srv/app/

COPY --from=prepare /srv/app/ ./

RUN npm install -g pnpm && \
    pnpm run lint


########################
# Nuxt: test (code)

# Should be the specific version of `node:slim`.
# Could be the specific version of `node:alpine`, but the `prepare` stage uses slim too.
FROM node:18.11.0-slim@sha256:686940406cdfe77b43cf539fbe84ef653e2c715ecf9ea17751c09994f033c8bf AS test

WORKDIR /srv/app/

COPY --from=prepare /srv/app/ ./

RUN npm install -g pnpm && \
    pnpm run test:code


########################
# Nuxt: test (integration)

# Should be the specific version of `node:slim`.
# Could be the specific version of `node:alpine`, but the `prepare` stage uses slim too.
FROM node:18.11.0-slim@sha256:686940406cdfe77b43cf539fbe84ef653e2c715ecf9ea17751c09994f033c8bf AS test-integration

ENV NODE_OPTIONS=--openssl-legacy-provider

# Update and install dependencies.
# - `wget` is used for testing
# - `procps` is required by `start-server-and-test` on `debian:slim` (https://github.com/bahmutov/start-server-and-test/issues/132#issuecomment-448581335)
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        wget \
        procps

WORKDIR /srv/app/

COPY --from=build /srv/app/ ./

RUN npm install -g pnpm && \
    WAIT_ON_TIMEOUT=6000 pnpm start-server-and-test 'pnpm start' 3000 'wget http://0.0.0.0:3000/' && \
    WAIT_ON_TIMEOUT=120000 pnpm start-server-and-test 'pnpm dev' 3000 'wget http://0.0.0.0:3000/'


########################
# Nuxt: test (visual)

# Should be the specific version of node:slim.
# `storycap` requires Debian.
FROM node:18.11.0-slim@sha256:686940406cdfe77b43cf539fbe84ef653e2c715ecf9ea17751c09994f033c8bf AS test-visual

ARG CI=false
ENV CI ${CI}
ENV NODE_OPTIONS=--openssl-legacy-provider

# Update and install dependencies.
# - `ca-certificates curl` is required by test.sh
# - `fonts-dejavu-core gconf-service`, ... is required by `puppeteer`
# - `procps` is required by `start-server-and-test` on `debian:slim` (https://github.com/bahmutov/start-server-and-test/issues/132#issuecomment-448581335)
# - `jq` is required for storycap
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        ca-certificates curl \
        fonts-dejavu-core gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdbus-1-3 libdrm2 libgbm1 libgconf-2-4 libgtk-3-0 libnspr4 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxfixes3 libxi6 libxrandr2 libxss1 libxtst6 fonts-liberation libayatana-appindicator1 libnss3 libxshmfence1 lsb-release xdg-utils \
        procps \
        jq

WORKDIR /srv/app/

COPY ./.git ./.git
COPY --from=prepare /srv/app/ ./

RUN npm install -g pnpm && \
    pnpm run test:visual


########################
# Nuxt: test (visual, standalone)

# Should be the specific version of node:slim.
# `storycap` requires Debian.
FROM node:18.11.0-slim@sha256:686940406cdfe77b43cf539fbe84ef653e2c715ecf9ea17751c09994f033c8bf AS test-visual_standalone

# Update and install dependencies.
# - `fonts-dejavu-core gconf-service`, ... is required by `puppeteer`
# - `procps` is required by `start-server-and-test` on `debian:slim` (https://github.com/bahmutov/start-server-and-test/issues/132#issuecomment-448581335)
# - `jq` is required for storycap
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        fonts-dejavu-core gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdbus-1-3 libdrm2 libgbm1 libgconf-2-4 libgtk-3-0 libnspr4 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxfixes3 libxi6 libxrandr2 libxss1 libxtst6 fonts-liberation libayatana-appindicator1 libnss3 libxshmfence1 lsb-release xdg-utils \
        procps \
        jq \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /srv/app/

CMD ["pnpm", "run", "storycap"]


#######################
# Collect build, lint and test results.

# Should be the specific version of node:slim.
FROM node:18.11.0-slim@sha256:686940406cdfe77b43cf539fbe84ef653e2c715ecf9ea17751c09994f033c8bf AS collect

WORKDIR /srv/app/

COPY --from=build /srv/app/.output ./.output
COPY --from=lint /srv/app/package.json /tmp/lint/package.json
COPY --from=test /srv/app/package.json /tmp/test/package.json
COPY --from=test-integration /srv/app/package.json /tmp/test/package.json
COPY --from=test-visual /srv/app/package.json /tmp/test-visual/package.json

#######################
# Provide a web server.
# Requires node (cannot be static) as the server acts as backend too.

# Should be the specific version of node:slim.
# `sqitch` requires at least `buster`.
FROM node:18.11.0-slim@sha256:686940406cdfe77b43cf539fbe84ef653e2c715ecf9ea17751c09994f033c8bf AS production

ENV NODE_ENV=production

# Update and install dependencies.
# - `libdbd-pg-perl postgresql-client sqitch` is required by the entrypoint
# - `wget` is required by the healthcheck
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        libdbd-pg-perl postgresql-client sqitch \
        wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /srv/app/

COPY --from=collect /srv/app/ ./

COPY ./sqitch/ /srv/sqitch/
COPY ./docker-entrypoint.sh /usr/local/bin/

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", ".output/server/index.mjs"]
HEALTHCHECK --interval=10s CMD wget -O /dev/null http://localhost:3000/api/healthcheck || exit 1
