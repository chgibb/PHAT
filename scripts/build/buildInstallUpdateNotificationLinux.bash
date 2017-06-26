 #!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compaibility

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    gcc -Wall -c src/InstallUpdateProcess/installUpdateNotificationLinux.c `pkg-config --cflags gtk+-2.0` \
    `pkg-config --libs gtk+-2.0`
    gcc -o dist/installUpdateNotificationLinux installUpdateNotificationLinux.o `pkg-config --cflags gtk+-2.0` \
    `pkg-config --libs gtk+-2.0`

    rm installUpdateNotificationLinux.o
fi