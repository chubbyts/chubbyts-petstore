# fnm
export PATH=$HOME/.fnm:$PATH
eval "$(fnm env --shell=bash --use-on-cd)"

# pnpm
export PNPM_HOME="$HOME/.local/share/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac
