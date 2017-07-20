const fs = require("fs");

let args = process.argv.slice(2);

async function generateDownloadTemplate(type,tag_name)
{
    return new Promise((resolve,reject) => {
        let releaseTemplate = fs.readFileSync("releaseTemplate.md").toString();
        let debTagName = tag_name.replace("-",".");
        releaseTemplate = releaseTemplate.replace(/\$TAGNAME\$/g,tag_name);
        releaseTemplate = releaseTemplate.replace(/\$DEBTAGNAME\$/g,debTagName);

        let changeLog = fs.readFileSync(`docs/docs/${type}ChangeLog.md`).toString();
        releaseTemplate = releaseTemplate.replace(/\$CHANGELOG\$/g,changeLog);
        console.log(releaseTemplate);
        fs.mkdirSync(`docs/releases/${type}/${tag_name}`); 
        fs.writeFileSync(`docs/releases/${type}/${tag_name}/index.md`,releaseTemplate);
        fs.appendFileSync(`docs/docs/stableChangeLog.md`)
    });
}
(async function(){
    await generateDownloadTemplate(args[0],args[1]);
})();