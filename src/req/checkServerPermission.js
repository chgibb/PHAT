"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GithubAPI = require("github-api");
function checkServerPermission(token) {
    return new Promise((resolve, reject) => {
        let ghapi = new GithubAPI({ token: token });
        ghapi.getRepo("chgibb", "PHAT").listReleases((error, result, request) => {
            if (error)
                return reject(error);
        }).then((arg) => {
            resolve();
        }).catch((arg) => {
            reject(arg);
        });
    });
}
exports.checkServerPermission = checkServerPermission;
