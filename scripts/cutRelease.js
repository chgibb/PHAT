const GitHubAPI = require("github-api");
module.exports = async function cutRelease(user,repo,token,tag_name,branch)
{
    return new Promise((resolve,reject) => {
        const ghapi = new GitHubAPI({token : token});
        ghapi.getRepo(user,repo).createRelease({
            tag_name : tag_name,
            target_commitish : branch,
            name : tag_name,
            body : "",
            draft : false,
            prerelease : true
        }).then(() => {
            console.log(`Cut ${user}/${repo}@${tag_name} from ${branch}`);
            resolve();
        }).catch((err) => {
            reject(err);
        })
    });
}