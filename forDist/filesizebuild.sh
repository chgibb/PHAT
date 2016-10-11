rm -rf fileSize

cd src
cd cpp
cd fileSize

printf "Building fileSize\n"
g++ -Wall -fexceptions -fexpensive-optimizations -O3  -c /home/gibbsticks/Desktop/RegularTie/RegularTieMulti/src/cpp/fileSize/main.cpp -o obj/Release/main.o

printf "Linking fileSize\n"
g++  -o bin/Release/fileSize obj/Release/main.o  -s  

cd ../
cd ../
cd ../

cp src/cpp/fileSize/bin/Release/fileSize ./
