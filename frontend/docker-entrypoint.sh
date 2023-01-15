#!/usr/bin/env bash
set -e

# print all comands to console if DEBUG is set
if [[ ! -z "${DEBUG}" ]]; then
    set -x
fi
NODE_ID_SEED=${NODE_ID_SEED:-$RANDOM}
GF_URL=$GF_URL
OLD_URL="http://127.0.0.1:8080/"
echo ${GF_URL}
sed -i "s=${OLD_URL}=$GF_URL=g" dev/game.js 
exec npm run serve -- --port 8070
