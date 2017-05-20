const GithubAPI = require("github-api");

/**
 * This method is only for internal testing in order to limit access to the application
 * to collaborators. This needs to be removed for the public release. token should be
 * a GitHub oAuth token.
 * @export
 * @param {string} token
 * @returns {Promise<{}>} 
 */
export function checkServerPermission(token : string) : Promise<{}>
{
    return new Promise((resolve,reject) => {
        let ghapi = new GithubAPI({token : token});
        ghapi.getRepo("chgibb","PHAT").listReleases(
            (error : string,result : any,request : any) => {
                if(error)
                    return reject(error);

        }).then((arg : any) => {
            resolve();
        }).catch((arg : any) => {
            reject(arg);
        });
    });
}