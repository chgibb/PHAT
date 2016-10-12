g++ -Wall -fexceptions -fexpensive-optimizations -O3  -c src/fileSize/main.cpp -o main.o
g++  -o fileSize main.o  -s
rm main.o
cp fileSize dist
rm fileSize  
