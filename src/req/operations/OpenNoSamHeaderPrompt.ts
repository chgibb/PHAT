import * as atomic from "./atomicOperations";
import * as winMgr from "./../main/winMgr";
import {InputBamFile} from "./InputBamFile";

export interface OpenNoSamHeaderPromptData
{
    opName : "openNoSamHeaderPrompt";
    data : InputBamFile
}

export class OpenNoSamHeaderPrompt extends atomic.AtomicOperation<OpenNoSamHeaderPromptData>
{
    public inputBamFile : InputBamFile;
    constructor(data : OpenNoSamHeaderPromptData)
    {
        super(data);
        this.ignoreScheduler = true;

        this.inputBamFile = data.data;
    }

    public run() : void
    {
        this.logRecord = atomic.openLog("openNoSamHeaderPrompt","Open No Sam Header Prompt");
        this.logObject(this.inputBamFile!.bamPath);
        winMgr.windowCreators["noSamHeaderPrompt"].Create();

        let prompts = winMgr.getWindowsByName("noSamHeaderPrompt");
        let prompt = prompts[prompts.length - 1];
        let options = {
            action : "getKey",
            key : "inputBamFile",
            val : this.inputBamFile
        };
        setTimeout(
            function()
            {
                prompt.webContents.send("noSamHeaderPrompt",options);
            },500
        );
        this.setSuccess(this.flags);
        this.update!();
    }
}