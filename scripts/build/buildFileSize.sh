printf "Building fileSize\n"
g++ -Wall -fexceptions -fexpensive-optimizations -O3  -c src/fileSize/main.cpp -o main.o
g++  -o fileSize main.o  -s
printf "Bundling fileSize\n"
rm main.o
cp fileSize dist
rm fileSize  
