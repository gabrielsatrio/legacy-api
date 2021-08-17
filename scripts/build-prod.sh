#!/bin/bash

read -p "* What should the app version be? : " VERSION
read -p "* Do you want to run it and forcibly remove the existing image? (y/n) : " CONFIRM

echo ""

if [ -z $CONFIRM ] ; then CONFIRM='n' ; fi

docker build --build-arg ENV=production -t atjdev/ezio-api:$VERSION .

if [ $CONFIRM = 'y' ]
then
  docker container rm -f ezio-api
  docker run -t -p 4000:4000 --name ezio-api atjdev/ezio-api:$VERSION
fi
