#!/bin/bash

read -p "* What should the app version be? " VERSION

echo ""

HOSTNAME="api.ateja.co.id"

docker build -t atjdev/ezio-api:$VERSION .
docker save -o ~/docker/images/ezio-api-$VERSION.tar atjdev/ezio-api:$VERSION
scp ~/docker/images/ezio-api-$VERSION.tar root@$HOSTNAME:~/docker/images/
ssh -t root@$HOSTNAME "docker load -i ~/docker/images/ezio-api-$VERSION.tar && docker tag atjdev/ezio-api:$VERSION dokku/api:$VERSION && dokku tags:deploy api $VERSION && dokku logs api"

# [if using Docker Hub]
#docker push atjdev/ezio-api:$VERSION
#ssh root@$HOSTNAME "docker pull atjdev/ezio-api:$VERSION && docker tag atjdev/ezio-api:$VERSION dokku/api:$VERSION && dokku tags:deploy api $VERSION && dokku logs api"
# [end if]
