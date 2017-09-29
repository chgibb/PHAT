const modConcat = require("module-concat");

const inFile = process.argv[2];
const outputFile = process.argv[3];
modConcat(
    inFile,
    outputFile,
    {
        excludeFiles : [
            './package.json',
            "node_modules/electron/index.js"
        ],
        allowUnresolvedModules : true
    },function(err : any,stats : any){
	    if(err) throw err;
	    console.log(stats.files.length + " were combined into " + outputFile);
});