#!/bin/bash
pm2 delete http-server
npm install
npm run build
cd $HOME/frontend/dist
pm2 start http-server
pm2 delete update-frontend