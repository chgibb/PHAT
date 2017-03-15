printf "Building copy\n"
g++ -Wall -fexceptions -fexpensive-optimizations -O3 -std=c++11 -c src/copy/main.cpp -o main.o
if [ $? != 0 ]; then
    printf "Failed building copy\n"
    exit 1
fi
g++ -o copy main.o -s
if [ $? != 0 ]; then
    printf "Failed linking copy\n"
    rm main.o
    exit 1
fi
cp copy dist
rm main.o
rm copy
