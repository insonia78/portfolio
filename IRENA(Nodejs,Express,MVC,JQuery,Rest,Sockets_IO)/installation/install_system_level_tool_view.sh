#!/bin/bash

mkdir /opt/www
dpkg -i DEBIAN_PACKAGE
cd /opt/www/SystemLevelToolView
sudo -u acelerex npm install
cd public
sudo -u acelerex bower install
