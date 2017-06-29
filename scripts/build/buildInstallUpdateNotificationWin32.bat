C:\MinGW\bin\gcc -Wall -c -static src/InstallUpdateProcess/installUpdateNotificationWin32.c
C:\MinGW\bin\gcc -static -static-libgcc -o dist/installUpdateNotificationWin32.exe installUpdateNotificationWin32.o -mwindows

rm installUpdateNotificationWin32.o

:start

goto start