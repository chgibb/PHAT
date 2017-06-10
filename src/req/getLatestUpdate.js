"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let GitHubAPI = require("github-api");
const semver = require("semver");
const pjson = require("./package.json");
let isRightOS;
if (process.platform == "linux")
    isRightOS = new RegExp("(linux)", "i");
else if (process.platform == "win32")
    isRightOS = new RegExp("(win32)", "i");
let isRightArch = new RegExp("(x64)", "i");
let isUpdate = new RegExp("(update)", "i");
function getLatestUpdate(userName, repo, token) {
    return new Promise((resolve, reject) => {
        let ghapi = new GitHubAPI({ token: token });
        ghapi.getRepo(userName, repo).listReleases((error, result, request) => {
            if (error)
                return reject({ status: -1, msg: error });
        }).then((arg) => {
            for (let i = arg.data.length - 1; i != -1; i--) {
                console.log(arg.data[i]);
                if (semver.satisfies(arg.data[i].tag_name, ">" + pjson.version)) {
                    for (let k = 0; k != arg.data[i].assets.length; ++k) {
                        if (isUpdate.test(arg.data[i].assets[k].name) &&
                            isRightOS.test(arg.data[i].assets[k].name) &&
                            isRightArch.test(arg.data[i].assets[k].name)) {
                            return resolve({
                                status: 0,
                                msg: "Release is available",
                                asset: arg.data[i].assets[k],
                                tag_name: arg.data[i].tag_name
                            });
                        }
                    }
                    return reject({ status: 1, msg: "No update for platform" });
                }
            }
            return reject({ status: 2, msg: "No valid release" });
        }).catch((arg) => {
            return reject(arg);
        });
    });
}
exports.getLatestUpdate = getLatestUpdate;
