(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    chmod +x phat-linux-x64/phat
fi
