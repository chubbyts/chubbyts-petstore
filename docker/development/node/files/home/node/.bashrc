export CLICOLOR='true'
export PS1='\[\e[1;32m\]\h\[\e[0m\] \[\e[1;37m\]\w\[\e[0m\] \[\e[3m\]($(git rev-parse --abbrev-ref HEAD 2> /dev/null))\[\e[23m\] \[\e[1;32m\]\u\[\e[0m\] '

# history
export HISTCONTROL='ignoreboth:erasedups'
export HISTFILE=~/.bash_history
export HISTSIZE=5000
export SAVEHIST=100000

export PROMPT_COMMAND='history -a'

alias cls="printf '\033c'; printf '\033[3J'"

alias ls='ls -ahl --color=auto'
alias mkdir='mkdir -pv'

alias cp='cp -i'
alias ln='ln -i'
alias mv='mv -i'
alias rm='rm -i'

export EDITOR='vim'

export PATH=$HOME/.fnm:$PATH
eval "$(fnm env --shell=bash --use-on-cd)"

if [ -f "$HOME/.bash_docker" ]; then
    source $HOME/.bash_docker
fi

