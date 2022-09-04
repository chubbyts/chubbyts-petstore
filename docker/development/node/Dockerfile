FROM rockylinux:9.0

SHELL ["/bin/bash", "-c"]

RUN dnf upgrade -y --refresh

RUN dnf install -y \
    compat-openssl11 \
    git \
    glibc-langpack-de \
    langpacks-de \
    nmap-ncat \
    procps-ng \
    sudo \
    unzip \
    vim \
    zsh

RUN echo "LANG=de_CH.UTF-8" > /etc/locale.conf \
    && cp -f /usr/share/zoneinfo/Europe/Zurich /etc/localtime

COPY docker/development/node/files /

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
