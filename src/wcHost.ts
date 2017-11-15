import * as electron from "electron";
const ipc = electron.ipcRenderer;

ipc.on("changeGuestInstance",function(event : Electron.IpcMessageEvent,arg : any){
    let webview = document.getElementsByTagName("webview")[0];
    webview.setAttribute("guestinstance",arg.guestinstance);
    webview.addEventListener("console-message",function(e : any){
        console.log(`${e.message}`);
    });
});