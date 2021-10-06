#!/bin/bash

read -p "* What is the IP Address or hostname of the server? " HOSTNAME

echo ""

ssh -t root@$HOSTNAME '/root/app/scripts/deploy-ezio-api.sh'
