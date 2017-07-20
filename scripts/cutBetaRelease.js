const GitHubAPI = require("github-api");
let args = process.argv.slice(2);
const token = args[0];
const tag_name = args[1];
async function cutBetaRelease(user,repo,token,tag_name)
{
    return new Promise((resolve,reject) => {
        const ghapi = new GitHubAPI({token : token});
        ghapi.getRepo(user,repo).createRelease({
            tag_name : tag_name,
            target_commitish : "beta",
            name : tag_name,
            body : "",
            draft : false,
            prerelease : true
        }).then(() => {
            console.log("success");
            resolve();
        }).catch((err) => {
            reject(err);
        })
    });
}
(async function(){
    await cutBetaRelease("chgibb","PHAT",args[0],args[1]);
})();