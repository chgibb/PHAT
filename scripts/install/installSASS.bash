(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility
git clone https://github.com/eSlider/sassc-binaries
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    cp sassc-binaries/dist/sassc .
fi
if [[ "$OSTYPE" == "cygwin" ]]; then
    cp sassc-binaries/dist/sassc.exe .
fi
rm -rf sassc-binaries
