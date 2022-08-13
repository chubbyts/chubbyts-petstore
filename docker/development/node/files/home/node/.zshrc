autoload colors && colors
setopt PROMPT_SUBST
export PROMPT='%{$fg_bold[green]%}%m%{$reset_color%} %{$fg_bold[white]%}%~%{$reset_color%} ($(git symbolic-ref --short HEAD 2> /dev/null)) %{$fg_bold[green]%}%n%{$reset_color%} % '

# history
setopt hist_ignore_dups
setopt hist_ignore_space
setopt hist_expire_dups_first
setopt inc_append_history
export HISTFILE=~/.zsh_history
export HISTSIZE=5000
export SAVEHIST=100000

alias cls="printf '\033c'; printf '\033[3J'"

alias ls='ls -ahl --color=auto'
alias mkdir='mkdir -pv'

alias cp='cp -i'
alias ln='ln -i'
alias mv='mv -i'
alias rm='rm -i'

export EDITOR='vim'

export PATH=$HOME/.fnm:$PATH
eval "$(fnm env --shell=zsh --use-on-cd)"

if [ -f "$HOME/.zsh_docker" ]; then
    source $HOME/.zsh_docker
fi
