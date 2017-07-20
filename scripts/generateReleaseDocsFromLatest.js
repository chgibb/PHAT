const fs = require("fs");

const walk = require("walk");

module.exports = async function generateReleaseDocsFromLatest(tag_name)
{
    return new Promise((resolve,reject) => {
        let walker = walk.walk(`docs/docs/latest`,{});
        fs.mkdirSync(`docs/docs/releases/${tag_name}`);
        walker.on("file",function(root,fileStats,next){
            let file = fs.readFileSync(`${root}/${fileStats.name}`).toString();
            file = file.replace(/\/latest\//g,`/releases/${tag_name}/`);
            file = file.replace(/\$TAGNAME\$/g,`${tag_name}`);     
            fs.writeFileSync(`docs/docs/releases/${tag_name}/${fileStats.name}`,file);
            next();
        });
    });
}