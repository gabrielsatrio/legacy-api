#!/bin/bash

read -p "* What should the app version be? : " VERSION

ENV=production

if [ $ENV = "testing" ]
then
  read -p "* Do you want to run it and forcibly remove the existing image? (y/n) : " CONFIRM
fi

if [ -z $CONFIRM ] ; then CONFIRM='n' ; fi

echo ""

docker build --build-arg ENV=$ENV -t atjdev/ezio-api:$VERSION .

if [ $CONFIRM = 'y' ]
then
  docker container rm -f ezio-api
  docker run -t -p 4000:4000 --name ezio-api atjdev/ezio-api:$VERSION
fi
