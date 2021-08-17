#!/bin/bash

read -p "* What should the app version be? : " VERSION

ENV=testing

if [ $ENV = "testing" ]
then
  read -p "* Do you want to run it and forcibly remove the existing image? (y/n) : " CONFIRM
fi

if [ -z $CONFIRM ] ; then CONFIRM='n' ; fi

echo ""

docker build --build-arg ENV=$ENV -t atjdev/ezio-api-test:$VERSION .

if [ $CONFIRM = 'y' ]
then
  docker container rm -f ezio-api-test
  docker run -t -p 4000:4000 --name ezio-api-test atjdev/ezio-api-test:$VERSION
fi
