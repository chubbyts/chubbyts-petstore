FROM rockylinux/rockylinux:9.5

SHELL ["/bin/bash", "-c"]

RUN dnf upgrade -y --refresh

RUN dnf install -y 'dnf-command(config-manager)' \
    && dnf config-manager --set-enabled crb \
    && dnf install -y epel-release

RUN dnf install -y \
    git \
    glibc-langpack-de \
    jemalloc \
    jemalloc-devel \
    langpacks-de \
    nmap-ncat \
    procps-ng \
    sudo \
    unzip \
    vim \
    zsh

ENV TZ=Europe/Zurich

RUN echo "LANG=de_CH.UTF-8" > /etc/locale.conf \
    && cp -f /usr/share/zoneinfo/${TZ} /etc/localtime

COPY docker/development/node/files /

ARG USER_ID
ARG GROUP_ID

RUN groupadd -g ${GROUP_ID} node \
    && useradd -u ${USER_ID} -g ${GROUP_ID} -s /bin/bash -M node \
    && chown -Rf node: /home/node \
    && echo 'node ALL=(ALL) NOPASSWD: ALL' > '/etc/sudoers.d/node'

USER node

WORKDIR /home/node

RUN curl -fsSL https://fnm.vercel.app/install | bash -s -- --install-dir "$HOME/.fnm" --skip-shell \
    && source ~/.bashrc \
    && fnm install 22 \
    && fnm default 22 \
    && fnm use 22 \
    && npm install -g corepack@latest \
    && npm uninstall -g npm \
    && corepack enable pnpm

WORKDIR /app

CMD export LD_PRELOAD=`jemalloc-config --libdir`/libjemalloc.so.`jemalloc-config --revision` \
    && trap "exit $?" TERM; while :; do sleep 1; done
