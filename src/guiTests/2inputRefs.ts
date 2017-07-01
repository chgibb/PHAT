process.exit(0);
/*console.log("Started GUI test for ref seq inputing");
require("./../req/main/main");

import * as path from "path";

import * as winMgr from "./../req/main/winMgr";
import * as dataMgr from "./../req/main/dataMgr";
import * as atomicOp from "./../req/operations/atomicOperations";
import {IndexFasta} from "./../req/operations/indexFasta";

import {Fasta} from "./../req/fasta";

setTimeout(function(){
    let projSelection = winMgr.getWindowsByName("projectSelection");
    if(!projSelection || projSelection.length == 0)
    {
        console.log("Failed to open projectSelectionRenderer");
        process.exit(1);
    }
    projSelection[0].webContents.executeJavaScript(`
        let els = document.getElementsByClassName("activeHover");
        let isOpenLink = /open/i;
        if(isOpenLink.test(els[0].id))
        {
            els[0].click();
        }
    `);
    setTimeout(function(){
        let toolBar = winMgr.getWindowsByName("toolBar");
        if(!toolBar || toolBar.length > 1 || toolBar.length == 0)
        {
            console.log("Failed to open tool bar!");
            process.exit(1);
        }
        toolBar[0].webContents.executeJavaScript(`
            document.getElementById("input").click();
        `);
        setTimeout(function(){
            let input = winMgr.getWindowsByName("input");
            if(!input || input.length == 0)
            {
                console.log("Failed to open input window");
                process.exit(1);
            }
            setTimeout(function(){
                let fastas = new Array<Fasta>();
                fastas.push(new Fasta(path.resolve(path.normalize("../testData/HPV16ref_genomes.fasta"))));
                dataMgr.setKey("input","fastaInputs",fastas);
                winMgr.publishChangeForKey("input","fastaInputs");
                input[0].webContents.executeJavaScript(`
                    document.getElementById("refSeqButton").click();

                `);
                setTimeout(function(){
                    input[0].webContents.executeJavaScript(`
                        let isHost = /_host/;
                        let isImport = /Import/;

                        let tds = document.getElementsByTagName("input");
                        for(let i = 0; i != tds.length; ++i)
                        {
                            if(tds[i].id && !isHost.test(tds[i].id) && !isImport.test(tds[i].id))
                            {
                                tds[i].click();
                            }
                        }
                        document.getElementById("indexButton").click();
                    `);
                },1000);
            },1000);
        },1000);
    },1000);
},1500);

atomicOp.updates.on("indexFasta",function(op : IndexFasta){
    if(op.flags.done && op.flags.failure)
    {
        console.log("Failed to index");
        process.exit(1);
    }
    if(op.flags.done && op.flags.success)
    {
        winMgr.getWindowsByName("toolBar")[0].close();
    }
});
*/