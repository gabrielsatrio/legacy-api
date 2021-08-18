#!/bin/bash

read -p "* What is the IP Address or hostname of the server? " HOSTNAME
read -p "* Which version should the app to be deploy? : " VERSION

echo ""

docker save -o ~/docker/images/ezio-api-test-$VERSION.tar atjdev/ezio-api-test:$VERSION
scp ~/docker/images/ezio-api-test-$VERSION.tar root@$HOSTNAME:~/docker/images/
ssh -t root@$HOSTNAME "docker load -i ~/docker/images/ezio-api-test-$VERSION.tar && docker tag atjdev/ezio-api-test:$VERSION dokku/api-test:$VERSION && dokku tags:deploy api-test $VERSION && dokku logs api-test"

# [if using Docker Hub]
#docker push atjdev/ezio-api-test:$VERSION
#ssh root@$HOSTNAME "docker pull atjdev/ezio-api-test:$VERSION && docker tag atjdev/ezio-api-test:$VERSION dokku/api-test:$VERSION && dokku tags:deploy api-test $VERSION && dokku logs api-test"
# [end if]
