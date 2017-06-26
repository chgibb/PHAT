gcc -Wall -c src/InstallUpdateProcess/installUpdateNotificationLinux.c `pkg-config --cflags gtk+-2.0` \
`pkg-config --libs gtk+-2.0`
gcc -o installUpdateNotificationLinux installUpdateNotificationLinux.o `pkg-config --cflags gtk+-2.0` \
`pkg-config --libs gtk+-2.0`

rm installUpdateNotificationLinux.o