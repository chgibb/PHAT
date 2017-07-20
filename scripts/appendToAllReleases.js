const fs = require("fs");

module.exports = function appendToAllReleases(tag_name,branch)
{
    fs.appendFileSync(`docs/allReleases.md`,`[${new Date}: PHAT@${tag_name} cut from ${branch}](https://chgibb.github.io/PHAT/releases/${tag_name}/index)`);
}