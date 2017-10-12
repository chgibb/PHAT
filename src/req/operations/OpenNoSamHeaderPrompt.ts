import * as atomic from "./atomicOperations";
import * as winMgr from "./../main/winMgr";
import {InputBamFile} from "./InputBamFile";
export class OpenNoSamHeaderPrompt extends atomic.AtomicOperation
{
    public inputBamFile : InputBamFile;
    constructor()
    {
        super();
        this.ignoreScheduler = true;
    }
    public setData(data : InputBamFile)
    {
        this.inputBamFile = data;
    }
    public run() : void
    {
        this.logRecord = atomic.openLog("openNoSamHeaderPrompt","Open No Sam Header Prompt");
        winMgr.windowCreators["noSamHeaderPrompt"].Create();

        let prompts = winMgr.getWindowsByName("noSamHeaderPrompt");
        let prompt = prompts[prompts.length - 1];
        let self = this;
        setTimeout(
            function(){
                prompt.webContents.send("noSamHeaderPrompt",{action : "getKey",key : "inputBamFile",val : self.inputBamFile});
            }
        );
        this.setSuccess(this.flags);
        this.update();
    }
}