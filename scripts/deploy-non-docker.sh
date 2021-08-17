#!/bin/bash

read -p "* What is the IP Address or hostname of the server? " HOSTNAME

echo ""

yarn build
scp -r dist/* root@$HOSTNAME:~/app/new-release/api/
scp .env.production root@$HOSTNAME:~/app/new-release/api/
scp ormconfig.js root@$HOSTNAME:~/app/new-release/api/
scp package.json root@$HOSTNAME:~/app/new-release/api/
scp yarn.lock root@$HOSTNAME:~/app/new-release/api/
ssh -t root@$HOSTNAME '/root/app/scripts/ezio-api.sh'
