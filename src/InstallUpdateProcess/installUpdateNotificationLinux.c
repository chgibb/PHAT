#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <unistd.h>
#include <signal.h>
#include <errno.h>

#include <gtk/gtk.h>

gboolean deleteEvent(GtkWidget* widget,GdkEvent* event,gpointer data)
{
    return TRUE;
}

void destroy(GtkWidget* widget,gpointer data)
{
    gtk_main_quit();
}

pid_t pid;

gboolean waitThenClose()
{
    int* status;
    waitpid(pid,status,WNOHANG);
    if(WIFEXITED(status))
    {
        gtk_main_quit();

        return FALSE;
    }
    return TRUE;
}

int main(int argc,char* argv[])
{
    pid = fork();
    if(pid == 0)
    {
        int res = execl("/usr/bin/python","/usr/bin/python","resources/app/installUpdateProcess.py",(char*)NULL);
        FILE*file = fopen("execlerror","w");
        fprintf(file,"%d %d",res,errno);
    }
    else if(pid  < 0)
    {
        exit(1);
    }
    else
    {
        GtkWidget* window;
        GtkWidget* notificationLabel;
    
        gtk_init(&argc,&argv);
    
        window = gtk_window_new (GTK_WINDOW_TOPLEVEL);

        gtk_window_set_default_size(GTK_WINDOW(window),50,50);
        gtk_container_set_border_width(GTK_CONTAINER(window),10);
        gtk_window_set_title(GTK_WINDOW(window),"PHAT");
    
        g_signal_connect(window,"delete-event",G_CALLBACK(deleteEvent),NULL);
    
        g_signal_connect(window,"destroy",G_CALLBACK(destroy),NULL);
    
    
    
        notificationLabel = gtk_label_new("PHAT is updating. Do not close this window or shutdown your computer. This window will close automatically.");
    

        gtk_container_add(GTK_CONTAINER(window),notificationLabel);

        gtk_widget_show(notificationLabel);
    
        gtk_widget_show(window);
        
        g_timeout_add(10,&waitThenClose,NULL);
    
        gtk_main();

        
    
        return 0;
    }
}