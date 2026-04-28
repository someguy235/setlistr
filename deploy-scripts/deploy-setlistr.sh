#!/bin/bash

echo ""

echo "sourcing .bashrc for nvm..."
# Load profile so NVM and its PATH additions are available in non-login shells
export HOME="${HOME:-$(eval echo ~$(whoami))}"
[ -f "$HOME/.bash_profile" ] && source "$HOME/.bash_profile"
[ -f "$HOME/.bashrc" ] && source "$HOME/.bashrc"

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "killing pm2 process..."
pm2 stop setlistr-server

echo "move to deploy folder..."
cd /var/www/setlistr

echo "updating from github..."
git pull

echo "installing dependencies..."
npm ci

echo "building app..."
npm run build

echo "starting server..."
pm2 start server/setlistr-server.js