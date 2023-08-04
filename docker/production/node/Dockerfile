# base
FROM rockylinux/rockylinux:9.2 AS base

SHELL ["/bin/bash", "-c"]

RUN dnf upgrade -y --refresh

RUN dnf install -y 'dnf-command(config-manager)' \
    && dnf config-manager --set-enabled crb \
    && dnf install -y epel-release

RUN dnf install -y \
    compat-openssl11 \
    glibc-langpack-de \
    langpacks-de \
    jemalloc \
    jemalloc-devel \
    nmap-ncat \
    procps-ng \
    unzip

ENV TZ=Europe/Zurich

RUN echo "LANG=de_CH.UTF-8" > /etc/locale.conf \
    && cp -f /usr/share/zoneinfo/${TZ} /etc/localtime

COPY docker/production/node/files /

RUN groupadd -g 1000 node \
    && useradd -u 1000 -g 1000 -s /bin/bash -M node \
    && chown -Rf node: /home/node

USER node

WORKDIR /home/node

RUN curl -fsSL https://fnm.vercel.app/install | bash -s -- --install-dir "$HOME/.fnm" --skip-shell \
    && source ~/.bashrc \
    && fnm install 18 \
    && fnm default 18 \
    && fnm use 18 \
    && npm install -g npm@latest

# build
FROM base as build

USER root

COPY . /app-build

RUN chown -Rf node: /app-build

USER node

WORKDIR /app-build

RUN source ~/.bashrc && npm install
RUN source ~/.bashrc && npm run cs
RUN source ~/.bashrc && npm run lint
RUN source ~/.bashrc && npm run test -- --coverage --no-cache
RUN source ~/.bashrc && npm run test:integration -- --no-cache
RUN source ~/.bashrc && npm run build

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
    && export LD_PRELOAD=`jemalloc-config --libdir`/libjemalloc.so.`jemalloc-config --revision` \
    && node bootstrap/index.js
