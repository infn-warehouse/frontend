#!/bin/bash
pm2 delete "npx serve -l 8080"
npm install
npm run build
cd $HOME/frontend/dist
pm2 start "npx serve -l 8080"
pm2 delete update-frontend