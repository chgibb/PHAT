import * as electron from "electron";
const ipc = electron.ipcRenderer;

//on message to attach new wc
ipc.on("changeGuestInstance",function(event : Electron.IpcMessageEvent,arg : any){
    let webview = document.getElementsByTagName("webview")[0];
    //attach new wc
    webview.setAttribute("guestinstance",arg.guestinstance);
    //poll until attach has completed
    pollWebContents(webview,arg);

});

function pollWebContents(webView : any,arg : any) : void
{
    if((<any>webView).getWebContents())
    {
        console.log("ready");
        ipc.send(`guestInstance-${arg.guestinstance}-Attached`,{});
    }
    else
    {
        console.log("not ready");
        setTimeout(function(){
            pollWebContents(webView,arg);
        },50);
    }
}