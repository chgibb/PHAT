#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <signal.h>
#include <errno.h>
//Adapted from http://www.microhowto.info/howto/cause_a_process_to_become_a_daemon_in_c.html#id2407077
int main(int arg,char*argv[])
{
    pid_t pid = fork();
    if(pid != 0)
        _exit(0);
    
    setsid();

    signal(SIGHUP,SIG_IGN);
    pid = fork();
    if(pid != 0)
        _exit(0);
    
    umask(0);
    close(STDIN_FILENO);
    close(STDOUT_FILENO);
    close(STDERR_FILENO);

    int res = execl("resources/app/installUpdateNotificationLinux","resources/app/installUpdateNotificationLinux");
    FILE*file = fopen("execlerror","w");
    fprintf(file,"%d %d",res,errno);
    return 0;
}