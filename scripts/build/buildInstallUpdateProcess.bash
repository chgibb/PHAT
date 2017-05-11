 #!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    gcc -c src/InstallUpdateProcess/main.c
    gcc -o installUpdateProcess main.o
    if [ $? != 0 ]; then
		exit 1
	fi
    cp installUpdateProcess dist
    cp src/InstallUpdateProcess/*.py dist

    rm main.o
    rm installUpdateProcess
fi