import * as fs from "fs";

const tarfs = require("tar-fs");
const tarStream = require("tar-stream");
const gunzip = require("gunzip-maybe");

let totalFiles = 0;
let countedFiles = 0;
process.on
(
    "message",function(data : any)
    {
        if(data.target)
        {
            if(totalFiles == 0 && countedFiles == 0)
            {
                let countFiles = tarStream.extract();
                countFiles.on
                (
                    "entry",function(header : any,stream : any,next : any)
                    {
                        if(header)
                            totalFiles++;
                        stream.on
                        (
                            "end",function()
                            {
                                next();
                            }
                        );
                        stream.resume();
                    }
                );
                countFiles.on
                (
                    "finish",function()
                    {
                        process.send({totalFiles : totalFiles});
                    }
                );
                try
                {
                    fs.createReadStream(data.target).pipe(gunzip()).pipe(countFiles);
                }
                catch(err){}
            }
        }
    }
);