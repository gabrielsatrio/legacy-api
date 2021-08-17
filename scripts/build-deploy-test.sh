#!/bin/bash

read -p "* What should the app version be? " VERSION

echo ""

HOSTNAME="api-test.ateja.co.id"

docker build -t atjdev/ezio-api-test:$VERSION .
docker save -o ~/docker/images/ezio-api-test-$VERSION.tar atjdev/ezio-api-test:$VERSION
scp ~/docker/images/ezio-api-test-$VERSION.tar root@$HOSTNAME:~/docker/images/
ssh -t root@$HOSTNAME "docker load -i ~/docker/images/ezio-api-test-$VERSION.tar && docker tag atjdev/ezio-api-test:$VERSION dokku/api-test:$VERSION && dokku tags:deploy api-test $VERSION && dokku logs api-test"

# [if using Docker Hub]
#docker push atjdev/ezio-api-test:$VERSION
#ssh root@$HOSTNAME "docker pull atjdev/ezio-api-test:$VERSION && docker tag atjdev/ezio-api-test:$VERSION dokku/api-test:$VERSION && dokku tags:deploy api-test $VERSION && dokku logs api-test"
# [end if]
