#!/bin/bash

read -p "* What is the IP Address or hostname of the server? " HOSTNAME

echo ""

yarn build
scp -r dist/* root@$HOSTNAME:~/app/new-release/server/
scp .env.production root@$HOSTNAME:~/app/new-release/server/
scp ormconfig.js root@$HOSTNAME:~/app/new-release/server/
scp package.json root@$HOSTNAME:~/app/new-release/server/
scp yarn.lock root@$HOSTNAME:~/app/new-release/server/
ssh -t root@$HOSTNAME '/root/app/scripts/ais-server.sh'
