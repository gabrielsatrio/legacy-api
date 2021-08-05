#!/bin/bash

read -p "* What should the app version be? " VERSION
read -p "* Do you want to run it and forcibly remove the existing image? (y/N) " CONFIRM

echo ""

docker build -t atjdev/ais-server:$VERSION .

if [ "${CONFIRM}" = 'y' ]
then
  docker container rm -f api
  docker run -t -p 4000:4000 --name api atjdev/ais-server:$VERSION
fi
