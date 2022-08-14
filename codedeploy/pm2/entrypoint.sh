#!/bin/sh
set -eo pipefail

#if [[ ! -f ".env" ]]
#then
#    echo "Error: .env not found."
#    cp .env.example .env
#fi

pm2-runtime pm2.json

exit 0
