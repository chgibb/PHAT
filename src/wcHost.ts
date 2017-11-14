import * as electron from "electron";
const ipc = electron.ipcRenderer;

ipc.on("changeGuestInstance",function(event : Electron.IpcMessageEvent,arg : any){
    console.log(arg);
    document.getElementsByTagName("webview")[0].setAttribute("guestinstance",arg.guestinstance);
});