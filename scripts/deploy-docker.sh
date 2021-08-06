#!/bin/bash

read -p "* What is the IP Address or hostname of the server? " HOSTNAME
read -p "* Which version should the app to be deploy? " VERSION

echo ""

docker save -o ~/docker/images/ais-server-$VERSION.tar atjdev/ais-server:$VERSION
scp ~/docker/images/ais-server-$VERSION.tar root@$HOSTNAME:~/docker/images/
ssh -t root@$HOSTNAME "docker load -i ~/docker/images/ais-server-$VERSION.tar && docker tag atjdev/ais-server:$VERSION dokku/api:$VERSION && dokku tags:deploy api $VERSION && dokku logs api"

# [if using Docker Hub]
#docker push atjdev/ais-server:$VERSION
#ssh root@$HOSTNAME "docker pull atjdev/ais-server:$VERSION && docker tag atjdev/ais-server:$VERSION dokku/api:$VERSION && dokku tags:deploy api $VERSION && dokku logs api"
# [end if]
