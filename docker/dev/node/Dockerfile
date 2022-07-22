FROM rockylinux:9.0

SHELL ["/bin/bash", "-c"]

RUN dnf install -y \
    compat-openssl11 \
    net-tools \
    sudo \
    unzip \
    zsh

ARG USER_ID
ARG GROUP_ID

RUN groupadd -g ${GROUP_ID} node \
    && useradd -u ${USER_ID} -g ${GROUP_ID} -s /bin/bash node \
    && echo 'source ~/.bash_aliases' >> /home/node/.bashrc \
    && echo 'source ~/.zsh_aliases' >> /home/node/.zshrc \
    && echo 'node ALL=(ALL) NOPASSWD: ALL' > '/etc/sudoers.d/node'

USER node

WORKDIR /home/node

RUN curl -fsSL https://fnm.vercel.app/install | bash -s -- --skip-shell \
    && echo 'export PATH=/home/node/.fnm:$PATH' >> .bashrc \
    && echo 'eval "$(fnm env --shell=bash --use-on-cd)"' >> .bashrc \
    && echo 'export PATH=/home/node/.fnm:$PATH' >> .zshrc \
    && echo 'eval "$(fnm env --shell=zsh --use-on-cd)"' >> .zshrc \
    && export PATH=/home/node/.fnm:$PATH \
    && eval "$(fnm env --shell=bash --use-on-cd)" \
    && fnm install 18 \
    && fnm default 18 \
    && fnm use 18

WORKDIR /app

CMD tail -f /dev/null
