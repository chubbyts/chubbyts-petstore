FROM rockylinux:9.0

SHELL ["/bin/bash", "-c"]

RUN dnf upgrade -y --refresh

RUN dnf install -y \
    compat-openssl11 \
    nmap-ncat \
    procps-ng \
    unzip

COPY docker/prod/node/files /
COPY . /app-build

RUN mkdir /app \
    && groupadd -g 1000 node \
    && useradd -u 1000 -g 1000 -s /bin/bash -M node \
    && chown -Rf node: /home/node \
    && chown -Rf node: /app-build \
    && chown -Rf node: /app

USER node

WORKDIR /home/node

RUN curl -fsSL https://fnm.vercel.app/install | bash -s -- --skip-shell \
    && source ~/.bashrc \
    && fnm install 18 \
    && fnm default 18 \
    && fnm use 18

WORKDIR /app-build

RUN source ~/.bashrc \
    && npm install \
    && npm run cs \
    && npm run test \
    && npm run test:integration \
    && npm run build \
    && cp -r dist/* /app \
    && cp package.json /app \
    && cp package-lock.json /app

WORKDIR /app

RUN source ~/.bashrc \
    && npm install --omit=dev

CMD source ~/.bashrc \
    && node bootstrap/index.js
