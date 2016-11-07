set -e

sudo dpkg -R -i scripts/install


sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y
sudo apt-get update -y
sudo apt-get install libstdc++6 -y
sudo apt-get install gcc -y
sudo apt-get install g++ -y
sudo apt-get install ant

for f in scripts/install/*.sh
do
	sh $f
done


npm install
