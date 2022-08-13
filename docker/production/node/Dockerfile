# base
FROM rockylinux:9.0 AS base

SHELL ["/bin/bash", "-c"]

RUN dnf upgrade -y --refresh

RUN dnf install -y \
    compat-openssl11 \
    nmap-ncat \
    procps-ng \
    unzip

COPY docker/production/node/files /

RUN groupadd -g 1000 node \
    && useradd -u 1000 -g 1000 -s /bin/bash -M node \
    && chown -Rf node: /home/node

USER node

WORKDIR /home/node

RUN curl -fsSL https://fnm.vercel.app/install | bash -s -- --skip-shell \
    && source ~/.bashrc \
    && fnm install 18 \
    && fnm default 18 \
    && fnm use 18

# build
FROM base as build

USER root

COPY . /app-build

RUN chown -Rf node: /app-build

USER node

WORKDIR /app-build

RUN source ~/.bashrc \
    && npm install \
    && npm run cs \
    && npm run test \
    && npm run test:integration \
    && npm run build

# prod
FROM base

USER root

COPY --from=build /app-build/dist /app
COPY --from=build /app-build/package.json /app
COPY --from=build /app-build/package-lock.json /app

RUN chown -Rf node: /app

USER node

WORKDIR /app

RUN source ~/.bashrc \
    && npm install --omit=dev

CMD source ~/.bashrc \
    && node bootstrap/index.js
