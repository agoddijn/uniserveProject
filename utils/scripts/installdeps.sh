#!/usr/bin/sh

mkdir ~/dependencies
cd ~/dependencies
mkdir bin

#Download and install node
wget https://nodejs.org/dist/v6.11.4/node-v6.11.4-linux-x64.tar.xz
tar -xJf node-v6.11.4-linux-x64.tar.xz
rm node-v6.11.4-linux-x64.tar.xz

#Download and install yarn
wget https://github.com/yarnpkg/yarn/releases/download/v1.1.0/yarn-v1.1.0.tar.gz
tar zvxf yarn-v1.1.0.tar.gz
rm yarn-v1.1.0.tar.gz

