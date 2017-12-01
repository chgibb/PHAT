import * as electron from "electron";
import { setTimeout } from "timers";
const ipc = electron.ipcRenderer;

let webview = document.getElementsByTagName("webview")[0];

//on message to attach new wc
ipc.on("changeGuestInstance",function(event : Electron.IpcMessageEvent,arg : any){
    
    //attach new wc
    webview.setAttribute("guestinstance",arg.guestinstance);
    //poll until attach has completed
    pollWebContents(webview,arg);

});

ipc.on("devtools-opened",function(){
    (<any>webview).getWebContents().openDevTools({mode : "right"});
});

function pollWebContents(webView : any,arg : any) : void
{
    if((<any>webView).getWebContents())
    {
        console.log("ready");
        ipc.send(`guestInstance-${arg.guestinstance}-Attached`,{});
        (<any>webview).style.height = "100%"; 
        (<any>webview).style.width = "100%";
        setTimeout(function(){
            (<any>webView).getWebContents().invalidate();
        },100);
    }
    else
    {
        console.log("not ready");
        setTimeout(function(){
            pollWebContents(webView,arg);
        },50);
    }
}