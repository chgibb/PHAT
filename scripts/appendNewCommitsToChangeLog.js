const fs = require("fs");

const GitHubAPI = require("github-api");
module.exports = async function appendNewCommitsToChangeLog(user,repo,token,tag_name,branch)
{
    return new Promise((resolve,reject) => {
        const ghapi = new GitHubAPI({token : token});
        let tag;
        //find last release for either beta/stable
        ghapi.getRepo(user,repo).listTags().then((tagsRes) => {
            if(branch == "beta")
            {
                for(let i = 0; i != tagsRes.data.length; ++i)
                {
                    if(/beta/.test(tagsRes.data[i].name))
                    {
                        tag = tagsRes.data[i];
                        break;
                    }
                }
            }
            else if(branch != "beta")
            {
                for(let i = 0; i != tagsRes.data.length; ++i)
                {
                    if(/beta/.test(tagsRes.data[i].name))
                        continue;
                    else
                    {
                        tag = tagsRes.data[i];
                        break;
                    }
                }
            }
            //get all commits since the tag was pushed
            ghapi.getRepo(user,repo).listCommits({
                sha : tag.commit.sha
            }).then((res) => {
                fs.appendFileSync(`docs/docs/${branch}ChangeLog.md`,`  ${"\n"}## ${res.data.length} Commits Since Last Release (${tag.name}) (most recent first)  ${"\n"}`);
                for(let i = 0; i != res.data.length; ++i)
                {
                    //extract the commit sha out of the url
                    let parts = res.data[i].commit.url.split(`/`);
                    let shaForURL = parts[8];
                    //place commit messages with line breaks on one line
                    let message = res.data[i].commit.message.replace(/\n/g," ");
                    fs.appendFileSync(`docs/docs/${branch}ChangeLog.md`,`${res.data[i].commit.author.name}: [${message}](https://github.com/${user}/${repo}/commit/${shaForURL})  ${"\n"}`);
                }
                resolve();
            }).catch((err) => {
                console.log(err);
                reject();
            })
        }).catch((err) => {
            console.log(err);
            reject();
        })
    });
}