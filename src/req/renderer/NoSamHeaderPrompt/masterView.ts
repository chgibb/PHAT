import * as electron from "electron";
const ipc = electron.ipcRenderer;

import * as viewMgr from "./../viewMgr";
import {AtomicOperationIPC} from "./../../atomicOperationsIPC";
import {Fasta} from "./../../fasta";
import {InputBamFile} from "./../../operations/InputBamFile";

const Dialogs = require("dialogs");
const dialogs = Dialogs();

export class View extends viewMgr.View
{
    public fastaInputs : Array<Fasta>;
    public inputBamFile : InputBamFile;
    public constructor(div : string)
    {
        super("masterView",div);
        this.fastaInputs = new Array<Fasta>();
    }
    public onMount() : void
    {}
    public onUnMount() : void
    {}
    public dataChanged() : void
    {}
    public renderView() : string
    {
        let res = "";
        if(!this.inputBamFile)
            return undefined;
        res += `
            <h4>The alignment map ${this.inputBamFile.bamPath} could not be input. This may be due to missing header information. Select a reference from below to use to substitute header information.</h4>
            <h4>Note: If you select a reference which was not used to build this alignment map, the result may be unusable or otherwise broken.</h4>
            <br />
            <div id="fastaTableDiv" style="width:100%;">
            <table style="width:100%;">
                <tr>
                    <th>Reference Name</th>
                    <th>Directory</th>
                    <th>Size</th>
                </tr>
                ${(()=>
    {
        let res = "";
        for(let i = 0; i != this.fastaInputs.length; ++i)
        {
            res += `
                            <tr class="activeHover ${this.fastaInputs[i].uuid}Class" id="${this.fastaInputs[i].uuid}Row">
                                <td class="${this.fastaInputs[i].uuid}Class">${this.fastaInputs[i].alias}</td>
                                <td class="${this.fastaInputs[i].uuid}Class">${this.fastaInputs[i].imported ? "In Project" : this.fastaInputs[i].path}</td>
                                <td class="${this.fastaInputs[i].uuid}Class">${this.fastaInputs[i].sizeString}</td>
                            </tr>
                        `;
        }
        return res;
    })()}
            </table>
            </div>
        `;
        return res;
    }
    public postRender() : void
    {}
    public divClickEvents(event : JQueryEventObject) : void
    {
        for(let i = 0; i != this.fastaInputs.length; ++i)
        {
            if(event.target.classList.contains(`${this.fastaInputs[i].uuid}Class`))
            {
                let self = this;
                dialogs.confirm(
                    `Use ${this.fastaInputs[i].alias} for header information?`,
                    "Build header",
                    (ok : boolean) => 
                    {
                        if(ok)
                        {
                            ipc.send(
                                "runOperation",
                                <AtomicOperationIPC>{
                                    opName : "inputBamFile",
                                    filePath : self.inputBamFile.bamPath,
                                    fasta : self.fastaInputs[i]
                                }
                            );
                            electron.remote.getCurrentWindow().close();
                        }
                    }
                );
            }
        }
    }
}

export function addView(arr : Array<viewMgr.View>,div : string) : void
{
    arr.push(new View(div));
}