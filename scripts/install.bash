#!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility
#set -e

#install all deb packages under scripts/install
sudo dpkg -R -i scripts/install

#install the following
#sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y
sudo apt-get update -y
#sudo apt-get install libstdc++6 -y
sudo apt-get install gcc -y
sudo apt-get install g++ -y
sudo apt-get install ant

#remove and remake dist
rm -rf dist

mkdir dist
mkdir dist/styles

#install npm dependencies
npm install

#for each script in scripts/install, run it
for f in scripts/install/*.sh
do
	sh $f
done

for f in scripts/install/*.bash
do
	bash $f
done

#run packaging script
bash scripts/package.bash
