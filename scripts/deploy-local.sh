#!/bin/bash

if [ ! -d ~/app/api ]
then
  mkdir ~/app/api
fi

pm2 stop ezio-api

cd $EZ/api
yarn build
cp -r dist/* ~/app/api
cp -r .env.dev-local-deploy ~/app/api/
mv ~/app/api/.env.dev-local-deploy ~/app/api/.env.development
cp -r ormconfig.js ~/app/api/
cp -r package.json ~/app/api/
cp -r yarn.lock ~/app/api/
cd ~/app/api
yarn

cross-env NODE_ENV=development pm2 start index.js --name ezio-api -i 2

pm2 logs ezio-api
