#!/bin/bash

read -p "* What should the app version be? " VERSION
read -p "* Do you want to forcibly remove the existing app container? (y/N) " REMOVE

echo ""


docker build -t atjdev/ais-server:$VERSION .

if [ "${REMOVE}" = 'y' ]
then
  docker container rm -f api
fi

docker run -t -p 4000:4000 --name api atjdev/ais-server:$VERSION
