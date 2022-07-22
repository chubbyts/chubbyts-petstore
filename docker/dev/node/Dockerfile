FROM rockylinux:9.0

SHELL ["/bin/bash", "-c"]

RUN dnf upgrade -y --refresh

RUN dnf install -y \
    compat-openssl11 \
    git \
    net-tools \
    procps-ng \
    sudo \
    unzip \
    vim \
    zsh

COPY docker/dev/node/files /

ARG USER_ID
ARG GROUP_ID

RUN groupadd -g ${GROUP_ID} node \
    && useradd -u ${USER_ID} -g ${GROUP_ID} -s /bin/bash -M node \
    && chown -Rf node: /home/node \
    && echo 'node ALL=(ALL) NOPASSWD: ALL' > '/etc/sudoers.d/node'

USER node

WORKDIR /home/node

RUN curl -fsSL https://fnm.vercel.app/install | bash -s -- --skip-shell \
    && source ~/.bashrc \
    && fnm install 18 \
    && fnm default 18 \
    && fnm use 18

WORKDIR /app

CMD tail -f /dev/null
