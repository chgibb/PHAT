const generateDownloadTemplate = require("./generateDownloadTemplate");
const cutRelease = require("./cutRelease");
const generateReleaseDocsFromLatest = require("./generateReleaseDocsFromLatest");
const appendToAllReleases = require("./appendToAllReleases");

let args = process.argv.slice(2);
const token = args[0];
const tag_name = args[1];
const type = args[2];

(async function(){
    await generateReleaseDocsFromLatest(tag_name);
    await generateDownloadTemplate(type,tag_name);
    await appendToAllReleases(tag_name,type);
    await cutRelease("chgibb","PHAT",args[0],args[1],type);

})().catch((err) => {
    console.log(err);
});