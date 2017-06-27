gcc -Wall -c src/InstallUpdateProcess/installUpdateNotificationWin32.c
gcc -o installUpdateNotificationWin32.exe installUpdateNotificationWin32.o -mwindows

rm installUpdateNotificationWin32.o