const generateDownloadTemplate = require("./generateDownloadTemplate");
const cutRelease = require("./cutRelease");
const generateReleaseDocsFromLatest = require("./generateReleaseDocsFromLatest");
const appendToAllReleases = require("./appendToAllReleases");

let args = process.argv.slice(2);
const token = args[0];
const tag_name = args[1];
const type = args[2];

(async function(){
    console.log("1");
    await generateReleaseDocsFromLatest(tag_name);
    console.log("2");
    await generateDownloadTemplate(type,tag_name);
    console.log("3");
    await appendToAllReleases(tag_name,type);
    console.log("4");
    await cutRelease("chgibb","PHAT",args[0],args[1],type);

})().catch((err) => {
    console.log(err);
});