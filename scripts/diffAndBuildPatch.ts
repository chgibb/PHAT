import * as fs from "fs";

const walk = require("walk");
const shasum = require("shasum");
const deleteEmpty = require("delete-empty");

let baseFolder = process.argv[2];
let compareFolder = process.argv[3];
if(!baseFolder || ! compareFolder)
    process.exit(1);

class FileCheckSum
{
    public file : string;
    public checkSum : string;
    public rootPath : string;
    public fullPath : string
    public constructor(file : string,rootPath : string,fullPath : string,checkSum : string)
    {
        this.file = file;
        this.rootPath = rootPath;
        this.fullPath = fullPath;
        this.checkSum = checkSum;
    }
}

function getFileCheckSums(dir : string) : Promise<Array<FileCheckSum>>
{
    return new Promise<Array<FileCheckSum>>(async (resolve,reject) => {
        let res : Array<FileCheckSum> = new Array<FileCheckSum>(); 

        let walker = walk.walk(dir);

        walker.on("file",function(root : string,fileStats : any,next : () => void){

            res.push(new FileCheckSum(fileStats.name,root,`${root}/${fileStats.name}`,shasum(fs.readFileSync(`${root}/${fileStats.name}`))));

            next();
        });

        walker.on("errors",function(root : string,nodeStatsArray : any,next : () => void){
            reject();
        });
        walker.on("end",function(){
            resolve(res);
        });
    });
}

function getUnchangedFiles(base : Array<FileCheckSum>,compare : Array<FileCheckSum>) : Array<FileCheckSum>
{
    let res : Array<FileCheckSum> = new Array<FileCheckSum>();

    for(let i = 0; i != compare.length; ++i)
    {
        for(let k = 0; k != base.length; ++k)
        {
            if(compare[i].file == base[k].file && compare[i].checkSum == base[k].checkSum)
            {
                res.push(base[k]);
            }
        }
    }

    return res;
}

function deleteFiles(files : Array<FileCheckSum>) : void
{
    for(let i = 0; i != files.length; ++i)
    {
        try
        {
            fs.unlinkSync(files[i].fullPath);
            console.log(`deleted file: ${files[i].fullPath}`);
        }
        catch(err){}
    }
    console.log(`Deleted ${files.length}`);

    for(let i = 0; i != files.length; ++i)
    {
        try
        {
            deleteEmpty.sync(`${files[i].rootPath}/`);
        }
        catch(err){}
    }
    
}

(async function(){
    let compare : Array<FileCheckSum> = new Array<FileCheckSum>();
    let base : Array<FileCheckSum> = new Array<FileCheckSum>();
    let unChanged : Array<FileCheckSum> = new Array<FileCheckSum>();

    compare = await getFileCheckSums(compareFolder);
    base = await getFileCheckSums(baseFolder);

    unChanged = getUnchangedFiles(base,compare);
    deleteFiles(unChanged);
    deleteEmpty.sync(`${baseFolder}/`);
})();