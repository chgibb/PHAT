const fs = require("fs");

module.exports = async function generateDownloadTemplate(type,tag_name)
{
    return new Promise((resolve,reject) => {
        let releaseTemplate = fs.readFileSync("releaseTemplate.md").toString();

        //The deb build replaces the hyphen in the beta tag with a full stop
        //All other builds are fine
        let debTagName = tag_name.replace("-",".");

        //Patch all occurences of $TAGNAME$ and $DEBTAGNAME$ with the current version being deployed
        releaseTemplate = releaseTemplate.replace(/\$TAGNAME\$/g,tag_name);
        releaseTemplate = releaseTemplate.replace(/\$DEBTAGNAME\$/g,debTagName);

        //Patch $CHANGELOG$ with this branch's changelog
        let changeLog = fs.readFileSync(`docs/docs/${type}ChangeLog.md`).toString();
        releaseTemplate = releaseTemplate.replace(/\$CHANGELOG\$/g,changeLog);
        console.log(releaseTemplate);
        
        fs.mkdirSync(`docs/releases/${tag_name}`); 
        fs.writeFileSync(`docs/releases/${tag_name}/index.md`,releaseTemplate);

        resolve();
    });
}
