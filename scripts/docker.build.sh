#!/bin/bash

read -p "* What should the app version be? " VERSION

echo ""

docker build -t atjdev/ais-server:$VERSION .
