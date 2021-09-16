#!/bin/bash

read -p "* What is the IP Address or hostname of the server? " HOSTNAME
read -p "* What environment? (testing | production) " ENVIRONMENT

echo ""

yarn build
scp -r dist/* root@$HOSTNAME:~/app/new-release/api/

if [ $ENVIRONMENT = 'testing' ]
then
  scp .env.test root@$HOSTNAME:~/app/new-release/api/.env.production
else
  scp .env.production root@$HOSTNAME:~/app/new-release/api/
fi

scp ormconfig.js root@$HOSTNAME:~/app/new-release/api/
scp package.json root@$HOSTNAME:~/app/new-release/api/
scp yarn.lock root@$HOSTNAME:~/app/new-release/api/
ssh -t root@$HOSTNAME '/root/app/scripts/ezio-api.sh'
