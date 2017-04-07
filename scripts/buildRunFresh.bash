 #!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compatibility

#if linux
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    #remove rt folder
    rm -rf phat-linux-x64/resources/app/rt
fi

#if windows
if [[ "$OSTYPE" == "cygwin" ]]; then
    #remove rt folder
    rm -rf phat-win32-x64/resources/app/rt
fi

#build then run
bash scripts/build.bash
sh scripts/run.sh