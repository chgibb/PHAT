const fs = require("fs");

const walk = require("walk");

module.exports = async function generateReleaseDocsFromLatest(tag_name)
{
    return new Promise((resolve,reject) => {
        let walker = walk.walk(`docs/docs/latest`,{});
        fs.mkdirSync(`docs/docs/releases/${tag_name}`);
        walker.on("file",function(root,fileStats,next){
            let file = fs.readFileSync(`${root}/${fileStats.name}`);
            file = file.replace(/\/latest\//g,`/${tag_name}/`);
            fs.writeFileSync(`docs/docs/releases/${tag_name}/${fileStats.name}`);
        });
    });
}