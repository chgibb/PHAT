(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility
git clone https://github.com/eSlider/sassc-binaries
cp sassc-binaries/dist/sassc .
rm -rf sassc-binaries
