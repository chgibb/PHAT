#include <gtk/gtk.h>

gboolean deleteEvent(GtkWidget* widget,GdkEvent* event,gpointer data)
{
    return TRUE;
}

/* Another callback */
static void destroy(GtkWidget* widget,gpointer data)
{
    gtk_main_quit ();
}

int main(int argc,char* argv[])
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
    
    gtk_main ();
    
    return 0;
}