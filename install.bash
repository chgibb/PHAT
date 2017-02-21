#!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility
#set -e

sudo dpkg -R -i scripts/install


sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y
sudo apt-get update -y
sudo apt-get install libstdc++6 -y
sudo apt-get install gcc -y
sudo apt-get install g++ -y
sudo apt-get install ant

rm -rf dist

mkdir dist
mkdir dist/styles

npm install

for f in scripts/install/*.sh
do
	sh $f
done

for f in scripts/install/*.bash
do
	bash $f
done


bash package.bash
