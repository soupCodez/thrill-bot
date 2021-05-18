#!/bin/bash

apt-get install -y wget
wget https://deb.nodesource.com/setup_current.x
bash setup_current.x
apt-get install -y nodejs
apt-get install -y build-essential