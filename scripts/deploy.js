const appendNewCommitsToChangeLog = require("./appendNewCommitsToChangeLog");
const generateReleaseDocsFromLatest = require("./generateReleaseDocsFromLatest");
const generateDownloadTemplate = require("./generateDownloadTemplate");
const appendToAllReleases = require("./appendToAllReleases");
const cutRelease = require("./cutRelease");

let args = process.argv.slice(2);
const token = args[0];
const tag_name = args[1];
const type = args[2];

(async function(){
    await appendNewCommitsToChangeLog("chgibb","PHAT",args[0],args[1],type);
    await generateReleaseDocsFromLatest(tag_name);
    await generateDownloadTemplate(type,tag_name);
    await appendToAllReleases(tag_name,type);
    await cutRelease("chgibb","PHAT",args[0],args[1],type);

})().catch((err) => {
    console.log(err);
});