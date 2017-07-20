const generateDownloadTemplate = require("./generateDownloadTemplate");
const cutRelease = require("./cutRelease");

let args = process.argv.slice(2);
const token = args[0];
const tag_name = args[1];
const type = args[2];

(async function(){
    await generateDownloadTemplate(type,tag_name);
    await cutRelease("chgibb","PHAT",args[0],args[1],type);

})();