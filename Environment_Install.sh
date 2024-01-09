#!/bin/sh
sudo apt-get update
sudo apt-get -y install python3-pip
sudo apt update
sudo apt -y install libpq-dev python3-dev
sudo apt update
sudo apt -y install wget ca-certificates
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
sudo apt update
sudo apt -y install postgresql postgresql-contrib
sudo apt-get update
sudo apt-get -y install curl
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash
sudo apt -y install nodejs
sudo npm -y install -g create-react-app
sudo apt-get update
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt -y install yarn
































