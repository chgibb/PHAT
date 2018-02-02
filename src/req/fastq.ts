import * as fs from "fs";
import * as readline from "readline";

import {File} from "./file";
import {QCData,getQCReportData} from "./QCData";
import {makeValidID} from "./MakeValidID";
export default class Fastq extends File
{
    public sizeString : string;
    public sequences : number;
    public validID : string;
    public checked : boolean;
    public seqLength : number;
    public QCData : QCData;
    public constructor(path : string)
    {
        super(path);
        this.sequences = 0;
        this.validID = makeValidID(path);
        this.checked = false;
        this.QCData = new QCData();
    }
}

export function parseSeqLengthFromQCReport(fastq : Fastq) : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        let rl : readline.ReadLine = readline.createInterface(<readline.ReadLineOptions>{
            input : fs.createReadStream(getQCReportData(fastq))
        });

        rl.on("line",function(line : string){
            let tokens = line.split(/\s/g);
            if(tokens[0] && tokens[1])
            {
                if(tokens[0] == "Sequence" && tokens[1] == "length")
                {
                    fastq.seqLength = parseInt(tokens[2]);
                    rl.close();
                    return resolve();
                }
            }
        });

    });
}